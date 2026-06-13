"use client";

import { NewsSourceManager } from "@/domains/news/components/news-source-manager";

export default function NewsSourcesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">News Sources</h1>
      <NewsSourceManager />
    </div>
  );
}
