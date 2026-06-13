"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HealthPanel } from "@/domains/system/components/health-panel";
import { CrawlLogsPanel } from "@/domains/system/components/crawl-logs-panel";
import { LlmTestPanel } from "@/domains/system/components/llm-test-panel";

export default function SystemPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">시스템 관리</h1>

      <Tabs defaultValue="health">
        <TabsList>
          <TabsTrigger value="health">헬스 체크</TabsTrigger>
          <TabsTrigger value="crawl-logs">크롤링 로그</TabsTrigger>
          <TabsTrigger value="llm-test">LLM 테스트</TabsTrigger>
        </TabsList>
        <TabsContent value="health">
          <HealthPanel />
        </TabsContent>
        <TabsContent value="crawl-logs">
          <CrawlLogsPanel />
        </TabsContent>
        <TabsContent value="llm-test">
          <LlmTestPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
