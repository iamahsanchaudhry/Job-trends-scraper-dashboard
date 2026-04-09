export interface Job {
  id: number;
  company: string;
  role: string;
  location: string;
  remote: boolean;
  salary: string | null;
  stack: string[];
  type: "fulltime" | "parttime" | "contract" | "unknown";
  url: string;
  rawText: string;
  postedAt: number;
}

export const store = {
  jobs: [] as Job[],
  lastUpdated: null as Date | null,
  threadId: null as number | null,
};