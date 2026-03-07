import { excludeFields, TreatmentCoverage } from "@repo/entities";
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
})
  .extend({
    coverage: z
      .enum(Object.values(TreatmentCoverage))
      .catch(TreatmentCoverage.NONE),
  })
  .superRefine((val, ctx) => {
    const teethAllowed: number[] = [];

    for (let i = 1; i <= 4; i++) {
      for (let j = 1; j <= 8; j++) {
        const result = i * 10 + j;
        teethAllowed.push(result);
      }
    }

    const includeAllowedTeeth = val.teeth.some((v) => teethAllowed.includes(v));

    // if (val.coverage === TreatmentCoverage.NONE) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "teeth is not allowed",
    //     path: ["teeth"],
    //   });
    // }

    if (
      val.coverage === TreatmentCoverage.FULL &&
      !val.teeth.every((v) => teethAllowed.includes(v))
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "teeth is invalid",
        path: ["teeth"],
      });
    }

    if (
      val.coverage === TreatmentCoverage.PARTIAL &&
      (val.teeth.length === 0 || !includeAllowedTeeth)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "teeth is required",
        path: ["teeth"],
      });
    }
  });

export type CreateOrUpdateTreatmentType = z.infer<
  typeof CreateOrUpdateTreatmentSchema
>;
