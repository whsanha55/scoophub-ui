"use client";

import { useState, useCallback } from "react";
import type { LLMTestRequest, LLMTestResponse } from "../types";
import type { ApiResponse } from "@/shared/types";

export function useLlmTest() {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testLlm = useCallback(async (message: string, systemPrompt?: string) => {
    setLoading(true);
    setError(null);
    try {
      const body: LLMTestRequest = { message };
      if (systemPrompt) body.system = systemPrompt;
      const res = await fetch("/api/llm/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: ApiResponse<LLMTestResponse> = await res.json();
      if (data.success && data.data) {
        setResponse(data.data.response);
      } else {
        setError(data.error?.message || "Failed to test LLM");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { response, loading, error, testLlm };
}
