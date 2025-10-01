import { Injectable } from '@nestjs/common';
import { db } from '@repo/database';
import { Treatment, excludeFields } from '@repo/entities';
import { Request } from 'express';
import { TreatmentDto } from './treatment.dto';

@Injectable()
export class TreatmentService {
  constructor() {}

  async getAll(): Promise<Treatment[]> {
    return db.treatment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: { isDeleted: false },
      omit: excludeFields,
    });
  }

  async getById(id: string): Promise<Treatment> {
    const treatment = await db.treatment.findUnique({
      where: { id, isDeleted: false },
      omit: excludeFields,
    });

    if (!treatment) throw new Error('Treatment not found');

    return treatment;
  }

  async create(req: Request, dto: TreatmentDto) {
    return db.treatment.create({
      data: {
        ...dto,
        createdBy: req.user.id,
      },
      select: {
        id: true,
      },
    });
  }

  async update(req: Request, id: string, dto: TreatmentDto) {
    await db.treatment.update({
      data: {
        ...dto,
        updatedAt: new Date(),
        updatedBy: req.user.id,
      },
      where: {
        id,
      },
    });
  }

  async delete(req: Request, id: string) {
    await db.treatment.update({
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: req.user.id,
      },
      where: { id },
    });
  }
}
