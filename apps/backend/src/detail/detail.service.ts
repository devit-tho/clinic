import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '@repo/database';
import { UserWithoutPassword } from '@repo/entities';
import { DetailDto } from './detail.dto';

@Injectable()
export class DetailService {
  constructor() {}

  async getByInvoiceId(invoiceId: string) {
    return db.detail.findMany({
      where: { invoiceId, isDeleted: false },
    });
  }

  async create(user: UserWithoutPassword, invoiceId: string, dto: DetailDto) {
    const { patientId, treatmentId, tooth, upper, lower } = dto;

    const invoice = await db.invoice.findFirst({
      where: {
        id: invoiceId,
        patientId,
      },
      // select payment only
      select: {
        payment: true,
      },
    });

    if (!invoice) throw new NotFoundException('Invoice not found');

    const treatment = await db.treatment.findUnique({
      where: {
        id: treatmentId,
      },
      select: {
        price: true,
      },
    });

    if (!treatment) throw new NotFoundException('Treatment not found');

    // Create new detail
    const detail = await db.detail.create({
      data: {
        patientId,
        treatmentId,
        invoiceId,
        tooth,
        upper,
        lower,
        createdBy: user.id,
      },
      select: {
        treatment: true,
      },
    });

    // after created detail we have to get all payment again and calculate it
    await db.payment.update({
      data: {
        total: invoice.payment.total + detail.treatment.price,
      },
      where: {
        id: invoice.payment.id,
      },
    });
  }

  async deleteAllDetail(user: UserWithoutPassword, invoiceId: string) {
    await db.detail.updateMany({
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: user.id,
      },
      where: {
        invoiceId,
      },
    });
  }
}
