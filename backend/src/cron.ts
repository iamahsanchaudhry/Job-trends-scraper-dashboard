import { scrape } from "./scraper";

const SIX_HOURS = 6 * 60 * 60 * 1000;

export function startCron() {
  scrape();
  globalThis.setInterval(scrape, SIX_HOURS);
  console.log("[cron] scheduled every 6 hours");
}