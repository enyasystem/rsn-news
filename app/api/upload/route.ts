import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }
    // Get file buffer and name
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const originalName = (file as File).name || `upload-${Date.now()}`;
    const ext = path.extname(originalName) || ".jpg";
    const fileName = `image-${Date.now()}${ext}`;
    const uploadPath = path.join(process.cwd(), "public", "uploads", fileName);
    await writeFile(uploadPath, buffer);
    // Return the public URL
    const url = `/uploads/${fileName}`;
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed.", details: String(error) }, { status: 500 });
  }
}
