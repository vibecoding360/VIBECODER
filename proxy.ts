import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Only run the Supabase session refresh on routes that need auth.
// Public landing pages and static assets avoid an unnecessary auth round-trip.
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"]
};