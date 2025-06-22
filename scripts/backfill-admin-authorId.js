const prisma = require("../lib/prisma").default;

async function main() {
  // Set this to your admin's actual ID
  const adminId = 1;
  const updated = await prisma.news.updateMany({
    where: { authorId: null },
    data: { authorId: adminId },
  });
  console.log(`Updated ${updated.count} news posts to set authorId=${adminId}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
