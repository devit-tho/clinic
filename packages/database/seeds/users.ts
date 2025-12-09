import { Prisma } from "../src";

const users: Prisma.UserCreateManyInput[] = [
  {
    firstName: "Admin",
    lastName: "Clinic",
    email: "admin@tz-clinic.com",
    alias: "Admin Clinic",
    role: "ADMIN",
    username: "D0001",
    gender: "Male",
    password: "$2a$08$TckUzwGt37j53EL0lO2s9uP9laChqddnzN.WqLTgN/FQ8iA/SKYSy",
  },
  {
    firstName: "David",
    lastName: "Tz",
    email: "david@tz-clinic.com",
    alias: "David Tz",
    role: "DOCTOR",
    username: "D0002",
    gender: "Male",
    password: "$2a$08$KJeFneW2TLfzVCE.KOpMe.C3LPipFjpF7PuIjht02z0oiS38YKjne",
  },
  {
    firstName: "Srey",
    lastName: "Keo",
    email: "srey@tz-clinic.com",
    alias: "Srey Keo",
    role: "STAFF",
    username: "S0001",
    gender: "Female",
    password: "$2a$08$XDp5crpjIfyc7BL8S4gd/en/gezyxmTLC1wIbkGsNyJSoKs7PPaH2",
  },
];

export default users;
