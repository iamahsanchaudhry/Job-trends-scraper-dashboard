import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { store } from "./store";
import { startCron } from "./cron";

startCron();

new Elysia()
  .use(cors())

  .get("/jobs", ({ query }) => {
  try {
    let jobs = store.jobs;

    if (query.remote === "true")
      jobs = jobs.filter((j) => j.remote);

    if (query.type)
      jobs = jobs.filter((j) => j.type === query.type);

    if (query.q) {
      const q = query.q.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.role.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.stack.some((s) => s.toLowerCase().includes(q))
      );
    }

    return {
      jobs,
      total: jobs.length,
      lastUpdated: store.lastUpdated,
    };
  } catch (err) {
    console.error("[api] /jobs error:", err);
    return { jobs: [], total: 0, lastUpdated: null, error: String(err) };
  }
})

  .get("/jobs/:id", ({ params }) => {
    const job = store.jobs.find((j) => j.id === Number(params.id));
    if (!job) throw new Error("Not found");
    return job;
  })

  .get("/health", () => ({ status: "ok", jobCount: store.jobs.length }))

  .listen(3001);

console.log("[api] running on http://localhost:3001");