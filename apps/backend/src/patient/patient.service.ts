import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '@repo/database';
import {
  Patient,
  PatientInvoice,
  RecentPatient,
  Role,
  excludeFields,
} from '@repo/entities';
import { Request } from 'express';
import { PatientDto } from './patient.dto';

@Injectable()
export class PatientService {
  constructor() {}

  async getAll(req: Request): Promise<Patient[]> {
    return db.patient.findMany({
      where: {
        isDeleted: false,
        ...(req.user.role !== Role.ADMIN && { createdBy: req.user.id }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      omit: excludeFields,
    });
  }

  async getById(id: string): Promise<PatientInvoice> {
    const patientInvoice = await db.patient.findFirst({
      where: { id, isDeleted: false },
      include: {
        invoices: {
          orderBy: {
            invNo: 'desc',
          },
          where: { isDeleted: false },
          include: {
            details: {
              where: { isDeleted: false },
              include: { treatment: true },
              omit: excludeFields,
            },
            payment: true,
          },
          omit: excludeFields,
        },
      },
      omit: excludeFields,
    });

    if (!patientInvoice) throw new NotFoundException();

    return patientInvoice;
  }

  async getRecent(): Promise<RecentPatient[]> {
    const patient = await db.patient.findMany({
      include: {
        user: {
          select: {
            alias: true,
          },
        },
      },
      omit: excludeFields,
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return patient;
  }

  async create(req: Request, dto: PatientDto) {
    const patient = await db.patient.create({
      data: {
        ...dto,
        createdBy: req.user.id,
      },
      select: {
        id: true,
      },
    });

    return { message: 'success', patient };
  }

  async update(req: Request, id: string, dto: PatientDto) {
    await db.patient.update({
      data: {
        ...dto,
        updatedAt: new Date(),
        updatedBy: req.user.id,
      },
      where: {
        id,
      },
    });

    return { message: 'success' };
  }

  async delete(req: Request, id: string) {
    await db.patient.update({
      data: {
        deletedAt: new Date(),
        deletedBy: req.user.id,
        isDeleted: true,
        invoices: {
          updateMany: {
            data: {
              isDeleted: true,
              deletedAt: new Date(),
              deletedBy: req.user.id,
            },
            where: {
              patientId: id,
            },
          },
        },
        details: {
          updateMany: {
            data: {
              deletedAt: new Date(),
              isDeleted: true,
              updatedBy: req.user.id,
            },
            where: {
              patientId: id,
            },
          },
        },
      },
      where: {
        id,
      },
    });
  }
}
