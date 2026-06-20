"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HealthPanel } from "@/domains/system/components/health-panel";
import { CrawlLogsPanel } from "@/domains/system/components/crawl-logs-panel";
import { LlmTestPanel } from "@/domains/system/components/llm-test-panel";
import { SchedulesPanel } from "@/domains/system/components/schedules-panel";
import { ConfigPanel } from "@/domains/system/components/config-panel";
import { NotifyPanel } from "@/domains/system/components/notify-panel";

export default function SystemPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">시스템 관리</h1>

      <Tabs defaultValue="health">
        <TabsList>
          <TabsTrigger value="health">헬스 체크</TabsTrigger>
          <TabsTrigger value="crawl-logs">크롤링 로그</TabsTrigger>
          <TabsTrigger value="llm-test">LLM 테스트</TabsTrigger>
          <TabsTrigger value="schedules">스케줄</TabsTrigger>
          <TabsTrigger value="config">config</TabsTrigger>
          <TabsTrigger value="notify">발신 라우팅</TabsTrigger>
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
        <TabsContent value="schedules">
          <SchedulesPanel />
        </TabsContent>
        <TabsContent value="config">
          <ConfigPanel />
        </TabsContent>
        <TabsContent value="notify">
          <NotifyPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
