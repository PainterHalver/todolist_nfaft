import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const users: any[] = [
    {
      username: "john",
      password: "b59c67bf196a4758191e42f76670ceba", // 1111
    },
    {
      username: "jane",
      password: "b59c67bf196a4758191e42f76670ceba", // 1111
    },
    {
      username: "calputer",
      password: "b59c67bf196a4758191e42f76670ceba", // 1111
    },
  ];

  await Promise.allSettled(
    users.map(async (user) => {
      await prisma.user.upsert({
        where: {
          username: user.username,
        },
        update: {},
        create: user,
      });
    })
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
