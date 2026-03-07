import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { db } from '@repo/database';
import {
  InvoiceDetail,
  InvoiceDetailPatient,
  UserWithoutPassword,
  excludeFields,
} from '@repo/entities';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import { InvoiceDetailDto, InvoiceDto } from './invoice.dto';

@Injectable()
export class InvoiceService {
  constructor() {}

  async getAll(): Promise<InvoiceDetailPatient[]> {
    return db.invoice.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        payment: true,
        details: {
          include: {
            treatment: true,
          },
        },
        patient: true,
      },
      orderBy: {
        invNo: 'desc',
      },
      omit: excludeFields,
    });
  }

  async getById(id: string): Promise<InvoiceDetail> {
    const invoice = await db.invoice.findFirst({
      where: { id },
      include: {
        payment: {
          omit: omit(excludeFields, [
            'createdBy',
            'updatedAt',
            'updatedBy',
            'deletedAt',
            'deletedBy',
          ]),
        },
        details: {
          include: {
            treatment: true,
          },
          omit: excludeFields,
        },
      },
    });

    if (!invoice) throw new NotFoundException('Invoice not found');

    return invoice;
  }

  async getInvNo(): Promise<string> {
    const invoiceCount = (await db.invoice.count()) + 1;
    return `INV-${invoiceCount.toString().padStart(4, '0')}`;
  }

  async getInvoiceNoById(id: string): Promise<string> {
    const invoice = await db.invoice.findUnique({
      where: { id },
      select: {
        invNo: true,
      },
    });

    if (!invoice) throw new NotFoundException('Invoice not found');

    return invoice.invNo;
  }

  async create(user: UserWithoutPassword, dto: InvoiceDto): Promise<string> {
    const { discount = 0, total = 0, patientId, status } = dto;

    const newDeposit = dto.deposit || 0;

    const patient = await db.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    const invNo = await this.getInvNo();

    if (!patient) throw new NotFoundException('Patient not found');

    const currentPayment = total - discount;

    const balance = currentPayment - newDeposit;

    if (newDeposit > currentPayment) {
      throw new BadRequestException(
        'New deposit is greater than current payment',
      );
    }

    const invoice = await db.$transaction(async (ctx) => {
      const paymentTransaction = await ctx.payment.create({
        data: {
          balance,
          total,
          deposit: newDeposit,
          discount,
          status,
        },
      });

      const invoiceTransaction = await ctx.invoice.create({
        data: {
          invNo,
          patientId: patient.id,
          paymentId: paymentTransaction.id,
          status,
          createdBy: user.id,
        },
        select: {
          id: true,
        },
      });

      return invoiceTransaction.id;
    });

    if (!invoice) throw new BadRequestException();

    return invoice;
  }

  async createInvoiceWithDetails(
    user: UserWithoutPassword,
    dto: InvoiceDetailDto,
  ) {
    const { details, invoice } = dto;

    const { discount, patientId, status, deposit: firstDeposit } = invoice;

    const newDeposit = firstDeposit ?? 0;

    const patient = await db.patient.findUnique({
      where: {
        id: patientId,
      },
      select: {
        id: true,
      },
    });

    if (!patient) throw new NotFoundException('Patient not found');

    const invNo = await this.getInvNo();

    const treatments = await db.treatment.findMany({
      where: {
        id: {
          in: details.map((detail) => detail.treatmentId),
        },
      },
      select: {
        id: true,
        price: true,
      },
    });

    if (treatments.length !== details.length) {
      throw new BadRequestException('Some of treatments not found');
    }

    const newInvoiceWithDetails = await db.$transaction(async (ctx) => {
      const payment = await ctx.payment.create({
        data: {
          status,
        },
        select: {
          id: true,
        },
      });

      const invoiceTx = await ctx.invoice.create({
        data: {
          invNo,
          patientId: patient.id,
          paymentId: payment.id,
          status,
          createdBy: user.id,
        },
        select: {
          id: true,
        },
      });

      const treatmentMaps = new Map<string, number>(
        treatments.map((treatment) => [treatment.id, treatment.price]),
      );

      let defaultPayment = 0;

      for (const detail of details) {
        const price = treatmentMaps.get(detail.treatmentId);

        if (!price) throw new NotFoundException('Treatment not found');

        const number = detail.lower + detail.upper;
        defaultPayment += number * price;

        await ctx.detail.create({
          data: {
            patientId,
            treatmentId: detail.treatmentId,
            invoiceId: invoiceTx.id,
            tooth: detail.tooth,
            upper: detail.upper,
            lower: detail.lower,
            createdBy: user.id,
          },
        });
      }

      const balance = (defaultPayment - newDeposit) * (1 - discount / 100);

      const total = defaultPayment * (1 - discount / 100);

      if (newDeposit > balance) {
        throw new BadRequestException(
          'New deposit is greater than current payment',
        );
      }

      await ctx.payment.update({
        data: {
          balance,
          defaultPayment,
          total,
          deposit: newDeposit,
          discount,
          status,
        },
        where: {
          id: payment.id,
        },
      });

      const newInvoice = await ctx.invoice.findUnique({
        where: {
          id: invoiceTx.id,
        },
        include: {
          payment: {
            omit: pick(excludeFields, ['isDeleted', 'createdAt']),
          },
          details: {
            include: {
              treatment: {
                omit: excludeFields,
              },
            },
            omit: excludeFields,
          },
        },
        omit: excludeFields,
      });

      return newInvoice;
    });

    return newInvoiceWithDetails;
  }

  async update(user: UserWithoutPassword, id: string, dto: InvoiceDetailDto) {
    const { invoice, details } = dto;
    const { discount, patientId, newDeposit } = invoice;

    await db.$transaction(async (ctx) => {
      const patient = await ctx.patient.findUnique({
        where: {
          id: patientId,
        },
      });

      if (!patient) throw new NotFoundException('Patient not found');

      const invoice = await ctx.invoice.findFirst({
        where: {
          id,
          patientId,
        },
        select: {
          id: true,
          paymentId: true,
          payment: true,
        },
      });

      if (!invoice) throw new NotFoundException();

      if (!newDeposit) return;

      // Recheck treatment again
      const treatments = await ctx.treatment.findMany({
        where: {
          id: {
            in: details.map((detail) => detail.treatmentId),
          },
        },
        select: {
          id: true,
          price: true,
        },
      });

      if (treatments.length !== details.length) {
        throw new BadRequestException('Some of treatments not found');
      }

      const treatmentMaps = new Map<string, number>(
        treatments.map((treatment) => [treatment.id, treatment.price]),
      );

      for (const detail of details) {
        const price = treatmentMaps.get(detail.treatmentId);

        if (!price) throw new NotFoundException('Treatment not found');

        if (detail.id) {
        } else {
          await ctx.detail.create({
            data: {
              patientId,
              treatmentId: detail.treatmentId,
              invoiceId: invoice.id,
              tooth: detail.tooth,
              upper: detail.upper,
              lower: detail.lower,
              createdBy: user.id,
            },
          });
        }
      }
    });
  }

  async delete(user: UserWithoutPassword, id: string) {
    const invoice = await db.invoice.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!invoice) throw new NotFoundException('Invoice not found');

    await db.invoice.update({
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: user.id,
        details: {
          updateMany: {
            data: {
              isDeleted: true,
              deletedAt: new Date(),
              deletedBy: user.id,
            },
            where: {
              invoiceId: invoice.id,
            },
          },
        },
      },
      where: { id: invoice.id },
    });
  }
}
