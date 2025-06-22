import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function createSlug(title: string, id: number): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
  const uniqueId = id.toString()
  return `${baseSlug}-${uniqueId}`
}

async function main() {
  const news = await prisma.news.findMany({ where: { slug: null } })
  for (const item of news) {
    const slug = createSlug(item.title, item.id)
    await prisma.news.update({
      where: { id: item.id },
      data: { slug },
    })
    console.log(`Updated news id=${item.id} with slug=${slug}`)
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
