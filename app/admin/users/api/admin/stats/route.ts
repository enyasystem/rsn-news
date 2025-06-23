import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Count all posts created by any admin (authorId not null)
    const postCount = await prisma.news.count({ where: { authorId: { not: null } } });
    const categoryCount = await prisma.category.count();
    return NextResponse.json({ postCount, categoryCount });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
