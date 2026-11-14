import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Refresh Supabase sessions only on authenticated and auth-flow routes.
// Static assets and public marketing pages avoid unnecessary auth round-trips.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/auth/callback"
  ]
};