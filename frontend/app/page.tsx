"use client";
import { useEffect, useState, useCallback } from "react";
import { JobCard } from "@/components/JobCard";
import type { Job } from "@/lib/types";
import { FilterBar } from "@/components/Filters";

interface ApiResponse {
  jobs: Job[];
  total: number;
  lastUpdated: string | null;
}

const DEFAULT_FILTERS = { q: "", remote: false, type: "" };

export default function Home() {
  const [data, setData]       = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const fetchJobs = useCallback(async () => {
    const params = new URLSearchParams();
    if (filters.q)      params.set("q", filters.q);
    if (filters.remote) params.set("remote", "true");
    if (filters.type)   params.set("type", filters.type);

    try {
      const res = await fetch(`/api/jobs?${params}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("[dashboard] failed to fetch jobs", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    const id = globalThis.setInterval(fetchJobs, 5 * 60 * 1000);
    return () => globalThis.clearInterval(id);
  }, [fetchJobs]);

return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Jobs Scraper
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400">
              {data ? `${data.total} listings` : ""}
            </span>
            <button
              onClick={()=>{setRefreshing(true); fetchJobs();}}
              disabled={refreshing}
              className="text-sm px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {data?.lastUpdated && (
          <p className="text-xs text-zinc-400 mb-6">
            Updated {new Date(data.lastUpdated).toLocaleTimeString()}
          </p>
        )}

        <FilterBar filters={filters} onChange={setFilters} />

        {loading || refreshing ? (
          <p className="text-zinc-400 text-center py-20">Loading jobs...</p>
        ) : data?.jobs.length === 0 ? (
          <p className="text-zinc-400 text-center py-20">No jobs match your filters.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {data?.jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}