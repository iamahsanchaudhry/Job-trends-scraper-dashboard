# Job Scraper Dashboard

A full-stack job scraper that pulls real engineering jobs from the [Hacker News "Who's Hiring?"](https://news.ycombinator.com/submitted?id=whoishiring) thread, parses them into structured data, and displays them in a clean filterable dashboard.

## Live Demo

- **Frontend (Vercel):** [https://job-trends-scraper-dashboard.vercel.app/](https://job-trends-scraper-dashboard.vercel.app/)
- **Backend API (Railway):** [https://job-trends-scraper-dashboard-production.up.railway.app/](https://job-trends-scraper-dashboard-production.up.railway.app/)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, Tailwind CSS |
| Backend | Bun, Elysia |
| Scraping | HN Firebase API |
| Deployment | Vercel (frontend), Railway (backend) |

## Features

- Scrapes the latest HN "Who's Hiring?" thread automatically
- Parses raw comments into structured job listings (role, company, location, stack, salary)
- Filter by keyword, remote only, and job type (full-time, part-time, contract)
- Cron job runs every 6 hours to keep listings fresh
- Manual refresh button on the dashboard
- Dark mode support

## Project Structure

```
job-scraper/
├── backend/
│   ├── src/
│   │   ├── scraper.ts      ← Fetches HN hiring thread comments
│   │   ├── parser.ts       ← Parses raw text → structured Job
│   │   ├── store.ts        ← In-memory job store
│   │   ├── cron.ts         ← Runs every 6 hours
│   │   └── index.ts        ← Elysia server + routes
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── page.tsx
    │   └── layout.tsx
    ├── components/
    │   ├── JobCard.tsx
    │   └── FilterBar.tsx
    ├── lib/
    │   └── types.ts
    └── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/jobs` | Returns all parsed job listings |
| GET | `/jobs?q=react` | Search by keyword |
| GET | `/jobs?remote=true` | Filter remote jobs only |
| GET | `/jobs?type=fulltime` | Filter by job type |
| GET | `/jobs/:id` | Get a single job by ID |
| GET | `/health` | Health check |

## Running Locally

### Prerequisites

- [Bun](https://bun.sh) installed
- [Node.js](https://nodejs.org) 18+ installed

### Backend

```bash
cd backend
bun install
bun run dev
# runs on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# runs on http://localhost:3000
```

## Environment Variables

Create a `.env.local` file in the `frontend/` folder:

```env
NEXT_PUBLIC_API_URL=https://job-scraper-api.up.railway.app
```

For local development this is handled via the Next.js rewrite proxy pointing to `localhost:3001`.

## License

MIT
