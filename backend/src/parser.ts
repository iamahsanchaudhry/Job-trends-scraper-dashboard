import type { Job } from "./store";

const REMOTE_HINTS = /\b(remote|wfh|work from home|distributed)\b/i;
const FULLTIME     = /\bfull.?time\b/i;
const PARTTIME     = /\bpart.?time\b/i;
const CONTRACT     = /\bcontract(or)?\b/i;
const SALARY_RE    = /\$[\d,]+k?(?:\s*[-–]\s*\$?[\d,]+k?)?/i;

const COMMON_STACK = [
  "TypeScript", "JavaScript", "Python", "Rust", "Go", "Elixir", "Ruby",
  "React", "Next.js", "Vue", "Svelte", "Node.js", "Bun", "Deno",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite",
  "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform",
  "GraphQL", "REST", "gRPC", "Kafka", "RabbitMQ",
];

export function parseJob(commentId: number, text: string): Job | null {
  const firstLine = text.split("\n")[0]?.trim() ?? "";
  if (!firstLine) return null;

  const [company = "Unknown", role = "Unknown", location = "Unknown"] =
    firstLine.split("|").map((s) => s.trim());

  if (role === "Unknown") return null;

  const remote = REMOTE_HINTS.test(text);

  const type = FULLTIME.test(text) ? "fulltime"
             : PARTTIME.test(text) ? "parttime"
             : CONTRACT.test(text) ? "contract"
             : "unknown";

  const salaryMatch = text.match(SALARY_RE);
  const salary = salaryMatch?.[0] ?? null;

  const stack = COMMON_STACK.filter((tech) =>
    new RegExp(`\\b${tech.replace(".", "\\.")}\\b`, "i").test(text)
  );

  return {
    id: commentId,
    company,
    role,
    location,
    remote,
    salary,
    stack,
    type,
    url: `https://news.ycombinator.com/item?id=${commentId}`,
    rawText: text,
    postedAt: Date.now(),
  };
}