import { NextRequest, NextResponse } from "next/server";

const STUDIO_AUTH_COOKIE = "studio_gate";
const DEFAULT_AUTH_DAYS = 365;

function parseBasicAuth(authHeader: string) {
  const encoded = authHeader.slice("Basic ".length).trim();
  const decoded = atob(encoded);
  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex === -1) {
    return null;
  }

  return {
    username: decoded.slice(0, separatorIndex),
    password: decoded.slice(separatorIndex + 1),
  };
}

async function sha256Hex(value: string) {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function unauthorizedResponse() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="ICRI Studio", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}

export async function middleware(request: NextRequest) {
  const username = process.env.STUDIO_BASIC_AUTH_USER;
  const password = process.env.STUDIO_BASIC_AUTH_PASSWORD;
  const maxAgeDays = Number(process.env.STUDIO_BASIC_AUTH_COOKIE_DAYS || DEFAULT_AUTH_DAYS);
  const maxAgeSeconds = Math.max(1, Math.floor(maxAgeDays * 24 * 60 * 60));

  // Fail closed if someone enabled middleware but forgot credentials
  if (!username || !password) {
    return new NextResponse("Studio auth is not configured", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const expectedToken = await sha256Hex(`${username}:${password}`);
  const existingCookie = request.cookies.get(STUDIO_AUTH_COOKIE)?.value;

  if (existingCookie === expectedToken) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) {
    return unauthorizedResponse();
  }

  const parsed = parseBasicAuth(authHeader);
  if (!parsed) {
    return unauthorizedResponse();
  }

  const providedUser = parsed.username;
  const providedPass = parsed.password;

  if (providedUser !== username || providedPass !== password) {
    return unauthorizedResponse();
  }

  const response = NextResponse.next();
  response.cookies.set({
    name: STUDIO_AUTH_COOKIE,
    value: expectedToken,
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: "/studio",
    maxAge: maxAgeSeconds,
  });

  return response;
}

export const config = {
  matcher: ["/studio/:path*"],
};
