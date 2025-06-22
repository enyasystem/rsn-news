import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // TODO: Replace with real admin session/user ID
    const adminId = 1;
    const postCount = await prisma.news.count({ where: { authorId: adminId } });
    const categoryCount = await prisma.category.count();
    return NextResponse.json({ postCount, categoryCount });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
