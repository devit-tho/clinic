import {
  CreateOrUpdateInvoiceDetailSchema,
  CreateOrUpdateInvoiceSchema,
} from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class InvoiceDto extends createZodDto(CreateOrUpdateInvoiceSchema) {}

export class InvoiceDetailDto extends createZodDto(
  CreateOrUpdateInvoiceDetailSchema,
) {}
