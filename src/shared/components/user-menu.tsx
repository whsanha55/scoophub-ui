"use client";

import { useEffect, useState } from "react";
import { Loader2, LogOut, LogIn } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AUTH_COOKIE_NAME } from "@/shared/lib/auth-config";

type Me = {
  email?: string;
  name?: string;
  is_super?: boolean;
};

// access_token 쿠키 존재 여부. HttpOnly 여부와 무관하게 이름으로 탐지.
function hasTokenCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split("; ")
    .some((c) => c.startsWith(`${AUTH_COOKIE_NAME}=`));
}

export function UserMenu() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then(async (res) => {
        if (!active) return;
        if (res.status === 401) {
          // 토큰 쿠키가 있는데 백엔드가 JWT를 거부 → 무효 토큰.
          // logout으로 access_token 쿠키를 만료시킨 뒤 /login으로.
          // (쿠키가 없는 진짜 비로그인은 user=null로 진입점 노출.)
          if (hasTokenCookie()) {
            window.location.href = "/api/auth/logout";
          }
          return;
        }
        if (res.ok) {
          setMe(await res.json());
        } else if (res.status === 403) {
          // 로그인은 됐으나 super 아님. 본문에 사용자 정보가 있으면 사용,
          // 없어도 "로그인됨"으로 식별해 Google 로그인 진입점이 잘못 노출되지 않게.
          try {
            const body = await res.json();
            setMe({ ...body, is_super: false });
          } catch {
            setMe({ is_super: false });
          }
        }
      })
      .catch(() => {
        // 백엔드 미가동 등 — 무시(다음 렌더/네비게이션 시 재시도)
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>불러오는 중…</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // 비로그인 — Google 로그인 진입점 노출.
  if (!me) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            render={<a href="/api/auth/login" />}
            className="cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            <span>Google로 로그인</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const label = me.name || me.email || "사용자";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          render={<a href="/api/auth/logout" />}
          className="cursor-pointer"
          title={me.email}
        >
          <LogOut className="h-4 w-4" />
          <span className="truncate">{label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
