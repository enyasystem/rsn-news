import prisma from "@/lib/prisma";
import type { NewsArticle } from "@/lib/news-api";

export async function getAllAdminNews(): Promise<NewsArticle[]> {
  const dbNews = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
  });

  return dbNews.map((n) => ({
    id: n.id.toString(),
    title: n.title,
    slug: n.slug,
    excerpt: n.content.slice(0, 200) + (n.content.length > 200 ? "..." : ""),
    content: n.content,
    imageUrl: n.imageUrl || "/placeholder.jpg",
    category: (n as any).category?.name || "General",
    source: "Admin",
    sourceUrl: "",
    publishedAt: n.createdAt.toISOString(),
    author: n.authorId ? undefined : undefined,
  }));
}
