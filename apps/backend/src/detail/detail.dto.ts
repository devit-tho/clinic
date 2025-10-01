import { CreateOrUpdateDetailSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class DetailDto extends createZodDto(CreateOrUpdateDetailSchema) {}
