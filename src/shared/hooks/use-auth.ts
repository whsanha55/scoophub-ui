"use client";

import { useEffect, useState } from "react";

// 클라이언트 인증 상태. 비로그인 시 user=null.
// mutation UI(is_super 게이트)와 user-menu가 함께 사용.
export type AuthUser = {
  email?: string;
  name?: string;
  is_super?: boolean;
};

export type AuthState = {
  user: AuthUser | null;
  loading: boolean;
};

// module-level 캐시. CrawlTriggerButton이 페이지마다 여러 개 렌더되므로
// /api/auth/me 중복 호출을 단일 fetch로 공유. 첫 마운트 그룹이 1회만 호출.
type Cache = { promise: Promise<AuthUser | null> } | { user: AuthUser | null };
let cache: Cache | null = null;

function fetchMe(): Promise<AuthUser | null> {
  if (!cache) {
    const promise = fetch("/api/auth/me")
      .then(async (res) => {
        if (res.ok) return (await res.json()) as AuthUser;
        if (res.status === 403) return { is_super: false };
        // 401 등은 비로그인.
        return null;
      })
      .catch(() => null)
      .finally(() => {
        // 결과 캐시 — 이후 마운트는 재fetch 없이 동일 값.
        cache = { user: null };
      });
    cache = { promise };
  }
  if ("promise" in cache) {
    return cache.promise.then((user) => {
      cache = { user };
      return user;
    });
  }
  return Promise.resolve(cache.user);
}

// /api/auth/me (백엔드 소유, proxy rewrite로 도달) 조회.
// 200 → 로그인 정보, 401 → 비로그인(null), 403 → 로그인은 했으나 비-super.
// 백엔드 미가동 등 네트워크 에러는 비로그인으로 간주해 UI가 부드럽게 동작.
export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchMe()
      .then((u) => {
        if (active) setUser(u);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { user, loading };
}
