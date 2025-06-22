import prisma from "../lib/prisma";

async function main() {
  const categories = await prisma.category.findMany({ select: { id: true, name: true } });
  console.log(categories);
}

main().catch(console.error);
