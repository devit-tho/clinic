import { excludeFields } from "@repo/entities";
import { z } from "zod";
import {
  TreatmentSchema as TreatmentSchemaGenerated,
  TreatmentType,
} from "./generated";
import { ObjectIdSchema } from "./utils";

// ----------------------------------------------------------------------

const TreatmentSchema = TreatmentSchemaGenerated.extend({
  id: ObjectIdSchema(),
});

export { TreatmentSchema };

export type { TreatmentType };

// ----------------------------------------------------------------------

export const CreateOrUpdateTreatmentSchema = TreatmentSchema.omit({
  id: true,
  createdAt: true,
  ...excludeFields,
});

export type CreateOrUpdateTreatmentType = z.infer<
  typeof CreateOrUpdateTreatmentSchema
>;
