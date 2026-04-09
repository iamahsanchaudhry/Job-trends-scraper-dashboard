"use client";

interface Filters {
  q: string;
  remote: boolean;
  type: string;
}

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

export function FilterBar({ filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <input
        type="text"
        placeholder="Search role, company, stack..."
        value={filters.q}
        onChange={(e) => onChange({ ...filters, q: e.target.value })}
        className="flex-1 min-w-48 px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />

      <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.remote}
          onChange={(e) => onChange({ ...filters, remote: e.target.checked })}
          className="rounded"
        />
        Remote only
      </label>

      <select
        value={filters.type}
        onChange={(e) => onChange({ ...filters, type: e.target.value })}
        className="px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
      >
        <option value="">All types</option>
        <option value="fulltime">Full-time</option>
        <option value="parttime">Part-time</option>
        <option value="contract">Contract</option>
      </select>
    </div>
  );
}