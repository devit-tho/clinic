import { excludeFields } from "@repo/entities";
import { z } from "zod";
import { PatientSchema as PatientSchemaGenerated } from "./generated";
import { ObjectIdSchema } from "./utils";

// ----------------------------------------------------------------------

export const PatientSchema = PatientSchemaGenerated.extend({
  id: ObjectIdSchema(),
});

export type PatientType = z.infer<typeof PatientSchema>;

// ----------------------------------------------------------------------

export const CreateOrUpdatePatientSchema = PatientSchema.omit({
  id: true,
  createdAt: true,
  ...excludeFields,
});

export type CreateOrUpdatePatientType = z.infer<
  typeof CreateOrUpdatePatientSchema
>;
