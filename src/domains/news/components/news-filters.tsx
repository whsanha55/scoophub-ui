"use client";

import { Button } from "@/components/ui/button";
import { NEWS_CATEGORIES } from "../types";

interface NewsFiltersProps {
  selectedCategory: string | null;
  minImportance: number | null;
  onSelectCategory: (cat: string | null) => void;
  onSelectImportance: (imp: number | null) => void;
}

export function NewsFilters({
  selectedCategory,
  minImportance,
  onSelectCategory,
  onSelectImportance,
}: NewsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">카테고리:</span>
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onSelectCategory(null)}
        className="cursor-pointer transition-colors duration-200"
      >
        전체
      </Button>
      {NEWS_CATEGORIES.map((cat) => (
        <Button
          key={cat}
          variant={selectedCategory === cat ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectCategory(cat)}
          className="cursor-pointer transition-colors duration-200 capitalize"
        >
          {cat}
        </Button>
      ))}

      <span className="ml-4 text-sm font-medium text-muted-foreground">중요도:</span>
      {[1, 5, 7].map((imp) => (
        <Button
          key={imp}
          variant={minImportance === imp ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectImportance(minImportance === imp ? null : imp)}
          className="cursor-pointer transition-colors duration-200"
        >
          {imp}+
        </Button>
      ))}
    </div>
  );
}
