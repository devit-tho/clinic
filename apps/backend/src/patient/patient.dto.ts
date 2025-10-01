import { CreateOrUpdatePatientSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class PatientDto extends createZodDto(CreateOrUpdatePatientSchema) {}
