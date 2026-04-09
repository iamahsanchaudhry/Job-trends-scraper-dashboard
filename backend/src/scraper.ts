import { store } from "./store";
import { parseJob } from "./parser";

const HN = "https://hacker-news.firebaseio.com/v0";

async function getItem(id: number) {
  const res = await fetch(`${HN}/item/${id}.json`);
  return res.json();
}

async function findHiringThreadId(): Promise<number | null> {
  console.log("[scraper] searching for latest Who's Hiring thread...");

  // HN user 'whoishiring' posts the monthly thread
  const user = await fetch(`${HN}/user/whoishiring.json`).then((r) => r.json());

  if (!user?.submitted?.length) return null;

  // Their most recent submissions — check top 5 for the hiring thread
  const recentIds: number[] = user.submitted.slice(0, 5);
  const items = await Promise.all(recentIds.map(getItem));

  const hiringThread = items.find(
    (item) =>
      item &&
      item.type === "story" &&
      item.title?.toLowerCase().includes("who is hiring")
  );

  if (hiringThread) {
    console.log(`[scraper] found thread: "${hiringThread.title}" (id: ${hiringThread.id})`);
    return hiringThread.id;
  }

  return null;
}

export async function scrape() {
  console.log("[scraper] starting...");

  try {
    const threadId = await findHiringThreadId();
    if (!threadId) {
      console.error("[scraper] could not find hiring thread");
      return;
    }

    const thread = await getItem(threadId);
    console.log("[scraper] thread kids:", thread?.kids?.length);

    if (!thread?.kids) return;

    store.threadId = threadId;

    const commentIds: number[] = thread.kids.slice(0, 21);
    const comments = await Promise.all(commentIds.map(getItem));
    console.log("[scraper] comments fetched:", comments.length);

    const jobs = comments
      .filter((c) => c && c.text && !c.dead && !c.deleted)
      .map((c) => parseJob(c.id, decodeHtml(c.text)))
      .filter(Boolean) as typeof store.jobs;

    store.jobs = jobs;
    store.lastUpdated = new Date();
    console.log(`[scraper] parsed ${jobs.length} jobs`);

  } catch (err) {
    console.error("[scraper] error:", err);
  }
}

function decodeHtml(html: string): string {
  return html
    .replace(/<p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"');
}