"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { CATEGORIES } from "@/types/database";

interface IdeasFilterProps {
  currentQuery: string;
  currentCategory: string;
  currentStatus: string;
  currentSort: string;
}

export default function IdeasFilter({
  currentQuery,
  currentCategory,
  currentStatus,
  currentSort,
}: IdeasFilterProps) {
  const [query, setQuery] = useState(currentQuery);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all" && value !== "newest") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/ideas?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams("q", query);
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ideen durchsuchen..."
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
        >
          Suchen
        </button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`rounded-lg border px-3 py-2.5 transition-colors ${
            showFilters
              ? "border-primary bg-primary/10 text-primary"
              : "border-border hover:bg-muted"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </form>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 rounded-lg border border-border bg-card p-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Kategorie
            </label>
            <select
              value={currentCategory}
              onChange={(e) => updateParams("category", e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">Alle Kategorien</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Status
            </label>
            <select
              value={currentStatus}
              onChange={(e) => updateParams("status", e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">Alle</option>
              <option value="open">Offen</option>
              <option value="in_progress">In Umsetzung</option>
              <option value="implemented">Umgesetzt</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Sortierung
            </label>
            <select
              value={currentSort}
              onChange={(e) => updateParams("sort", e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="newest">Neueste zuerst</option>
              <option value="oldest">Älteste zuerst</option>
              <option value="most_votes">Meiste Votes</option>
              <option value="most_comments">Meiste Kommentare</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
