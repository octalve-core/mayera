import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie, revokeSessionToken, SESSION_COOKIE } from "@/server/auth/session";
import { assertSameOrigin, errorResponse } from "@/server/security/request";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    await revokeSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
    const response = NextResponse.json({ ok: true });
    clearSessionCookie(response);
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
