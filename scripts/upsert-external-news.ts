import { fetchLatestNews } from "@/lib/news-service";
import prisma from "@/lib/prisma";

async function upsertExternalNews() {
  const articles = await fetchLatestNews("all", 100);
  let successCount = 0;
  let failCount = 0;
  for (const article of articles) {
    try {
      await prisma.news.upsert({
        where: { slug: article.slug },
        update: {
          title: article.title,
          excerpt: article.excerpt,
          content: typeof article.content === "string" ? article.content : (article.content || ""),
          imageUrl: article.imageUrl,
          category: {
            connectOrCreate: {
              where: { name: typeof article.category === "string" ? article.category : (article.category?.name || "General") },
              create: { name: typeof article.category === "string" ? article.category : (article.category?.name || "General") },
            },
          },
          source: article.source,
          sourceUrl: article.sourceUrl,
          publishedAt: new Date(article.publishedAt),
        },
        create: {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: typeof article.content === "string" ? article.content : (article.content || ""),
          imageUrl: article.imageUrl,
          category: {
            connectOrCreate: {
              where: { name: typeof article.category === "string" ? article.category : (article.category?.name || "General") },
              create: { name: typeof article.category === "string" ? article.category : (article.category?.name || "General") },
            },
          },
          source: article.source,
          sourceUrl: article.sourceUrl,
          publishedAt: new Date(article.publishedAt),
        },
      });
      successCount++;
    } catch (error) {
      failCount++;
      console.error(`Failed to upsert article with slug ${article.slug}:`, error);
    }
  }
  console.log(`External news upserted! Success: ${successCount}, Failed: ${failCount}`);
}

upsertExternalNews().then(() => process.exit(0));
