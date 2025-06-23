export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword } = await req.json();
    // TODO: Replace with real admin session/user ID
    const adminId = 1;
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }
    const valid = await bcrypt.compare(currentPassword, admin.password);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({ where: { id: adminId }, data: { password: hashed } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}
