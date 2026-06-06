"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface CrawlTriggerButtonProps {
  onClick: () => void;
  loading: boolean;
  label?: string;
}

export function CrawlTriggerButton({
  onClick,
  loading,
  label = "수집 실행",
}: CrawlTriggerButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      className="cursor-pointer transition-colors duration-200"
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      {loading ? "실행 중..." : label}
    </Button>
  );
}
