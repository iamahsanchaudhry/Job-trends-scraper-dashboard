import type { Job } from "@/lib/types";

const TYPE_COLORS: Record<string, string> = {
  fulltime: "bg-green-100 text-green-800",
  parttime: "bg-blue-100 text-blue-800",
  contract: "bg-amber-100 text-amber-800",
  unknown:  "bg-zinc-100 text-zinc-600",
};

export function JobCard({ job }: { job: Job }) {
  return (
    <a
      href={job.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {job.company}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
            {job.role}
          </p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full shrink-0 font-medium ${TYPE_COLORS[job.type]}`}>
          {job.type}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mt-3 text-xs text-zinc-500 dark:text-zinc-400">
        <span>{job.location}</span>
        {job.remote && (
          <span className="text-teal-600 dark:text-teal-400 font-medium">Remote</span>
        )}
        {job.salary && <span className="text-green-600 dark:text-green-400">{job.salary}</span>}
      </div>

      {job.stack.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {job.stack.slice(0, 6).map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}