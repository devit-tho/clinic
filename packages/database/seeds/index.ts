import { db } from "../src";

// data imports
// import users from "./users";

async function main() {
  console.log("🚀 Seeding database...");

  // await db.user.createMany({
  //   data: users,
  // });

  console.log("🚀 Database seeded successfully");
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (error) => {
    await db.$disconnect();
    console.error(error);
    process.exit(1);
  });
