import { NextRequest, NextResponse } from "next/server";
import { profile } from "@/content/profile";

export async function POST(request: NextRequest) {
  let body: { name?: string; from?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const from = body.from?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !from || !message) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const subject = encodeURIComponent(`Portfolio — ${name}`);
  const mailBody = encodeURIComponent(`${message}\n\n— ${name}\n${from}`);
  const mailto = `mailto:${profile.email}?subject=${subject}&body=${mailBody}`;

  return NextResponse.json({ ok: true, mailto });
}
