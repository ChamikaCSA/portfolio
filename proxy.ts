import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hrefForSurface } from "@/lib/surfaces";

export function proxy(request: NextRequest) {
  const legacy = request.nextUrl.searchParams.get("s");
  if (!legacy) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = hrefForSurface(legacy);
  url.searchParams.delete("s");
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: "/",
};
