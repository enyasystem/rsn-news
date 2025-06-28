import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get stats
    const [postCount, categoryCount, adminCount, recentPosts] = await Promise.all([
      prisma.news.count(),
      prisma.category.count(),
      prisma.admin.count(),
      prisma.news.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { category: true },
      }),
    ]);
    return NextResponse.json({
      postCount,
      categoryCount,
      adminCount,
      recentPosts: recentPosts.map((n) => ({
        id: n.id,
        title: n.title,
        slug: n.slug,
        createdAt: n.createdAt,
        category: n.category ? { name: n.category.name } : null,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dashboard data." }, { status: 500 });
  }
}
