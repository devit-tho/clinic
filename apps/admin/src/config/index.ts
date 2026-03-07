import { Gender, Role, Status, TreatmentCoverage } from "@repo/entities";

export default {
  WEB_API: process.env.WEB_API,
  ROLE: {
    ADMIN: Role.ADMIN,
    DOCTOR: Role.DOCTOR,
    STAFF: Role.STAFF,
  },
  GENDER: {
    MALE: Gender.Male,
    FEMALE: Gender.Female,
  },
  STATUS: {
    NO_DETAILS: Status.NO_DETAILS,
    SUCCESS: Status.SUCCESS,
    PENDING: Status.PENDING,
  },
  TREATMENT_COVERAGE: {
    NONE: TreatmentCoverage.NONE,
    FULL: TreatmentCoverage.FULL,
    PARTIAL: TreatmentCoverage.PARTIAL,
  },
  DEFAULT_PAGE_SIZE: 10,
  DATE_FORMAT: "dd MMM yyy",
};
