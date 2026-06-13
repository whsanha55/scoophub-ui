import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  API_URL,
  AUTH_COOKIE_NAME,
  PUBLIC_PAGES,
  API_REWRITE_EXCLUDE,
  API_TOKEN_EXCLUDE,
} from "@/shared/lib/auth-config";

// Next 16: middleware.ts → proxy.ts. 인증 가드 + /api/* 프록시(Bearer 주입) 통합.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // 1. /api/* → 백엔드 rewrite + 인증 헤더 주입
  if (pathname.startsWith("/api/")) {
    // 프론트 route handler 소유 경로는 rewrite하지 않고 filesystem route로 통과
    if (API_REWRITE_EXCLUDE.includes(pathname)) {
      return NextResponse.next();
    }

    const headers = new Headers(request.headers);
    headers.delete("cookie"); // 원본 쿠키 백엔드 유출 방지
    if (!API_TOKEN_EXCLUDE.includes(pathname) && token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const backendUrl = new URL(`${pathname}${search}`, API_URL);
    return NextResponse.rewrite(backendUrl, { request: { headers } });
  }

  // 2. 페이지 인증 가드
  const isPublic = PUBLIC_PAGES.includes(pathname);
  if (!token && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  // 이미 로그인한 사용자가 /login 접근 시 홈으로
  if (token && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
