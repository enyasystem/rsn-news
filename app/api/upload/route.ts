import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }
    // For demo: just return a placeholder URL. Replace with real upload logic (e.g. S3, Cloudinary, local, etc.)
    // You can save the file buffer to disk or upload to a cloud provider here.
    // Example: const buffer = Buffer.from(await file.arrayBuffer());
    // For now, return a static placeholder
    return NextResponse.json({ url: "/placeholder.jpg" });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
