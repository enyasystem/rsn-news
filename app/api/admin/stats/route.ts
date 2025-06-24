import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const postCount = await prisma.news.count();
    const categoryCount = await prisma.category.count();
    // You can add more stats as needed
    return NextResponse.json({ postCount, categoryCount });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch admin stats." }, { status: 500 });
  }
}
