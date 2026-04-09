export interface Job {
  id: number;
  company: string;
  role: string;
  location: string;
  remote: boolean;
  salary: string | null;
  stack: string[];
  type: string;
  url: string;
  postedAt: number;
}