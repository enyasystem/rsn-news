import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    // Find admin by email
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    // Compare password
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    // Create JWT
    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: "JWT_SECRET is not set on the server." }, { status: 500 });
    }
    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    // Return user info (never return password)
    return NextResponse.json({
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        token,
      },
    });
  } catch (error) {
    // Debug: log error details in response (remove in production)
    return NextResponse.json({ error: "Server error. Please try again.", details: String(error) }, { status: 500 });
  }
}
