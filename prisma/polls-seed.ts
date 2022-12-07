import { PrismaClient } from "@prisma/client";
import { getSmarContractPolls } from "../src/utils/getSmarContraactPolls";

const prisma = new PrismaClient();

async function main() {
  const list = await getSmarContractPolls();

  const newPolls = list.map((p: any) => ({
    hex: p,
    description: "TO BE FETCHED",
  }));

  // delete prev polls
  await prisma.poll.deleteMany({});

  // rewrite polls
  for (let data of newPolls) {
    await prisma.poll.create({
      data,
    });
  }
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
