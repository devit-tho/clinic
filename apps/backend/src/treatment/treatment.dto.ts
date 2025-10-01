import { CreateOrUpdateTreatmentSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class TreatmentDto extends createZodDto(CreateOrUpdateTreatmentSchema) {}
