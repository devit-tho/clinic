import { Gender, Role, Status } from "@repo/entities";

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
  DEFAULT_PAGE_SIZE: 10,
  DATE_FORMAT: "dd MMM yyy",
};
