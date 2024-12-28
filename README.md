# Blog Social Automation Platform

A web application that automatically fetches content from multiple blog platforms and shares summaries on social media.

## Features

- Integration with multiple blog platforms (Webflow, WordPress, Medium)
- AI-powered content summarization
- Automated social media posting (LinkedIn, Twitter)
- OAuth authentication for all platforms
- User-friendly dashboard for managing connections and settings

## Tech Stack

### Frontend

- Next.js (React)
- Tailwind CSS
- TypeScript

### Backend

- Node.js
- Express
- PostgreSQL
- Redis (caching)

### External Services

- OpenAI GPT API for summarization
- Blog Platform APIs (Webflow, WordPress, Medium)
- Social Media APIs (LinkedIn, Twitter)

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- Redis >= 6

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/blog-social.git
cd blog-social
```

2. Install dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables

```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env
```

4. Start development servers

```bash
# Frontend
cd frontend
npm run dev

# Backend
cd ../backend
npm run dev
```

## Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_OAUTH_CALLBACK_URL=http://localhost:3000/auth/callback
```

### Backend (.env)

```
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/blog_social
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_api_key

# OAuth Credentials
WEBFLOW_CLIENT_ID=
WEBFLOW_CLIENT_SECRET=
WORDPRESS_CLIENT_ID=
WORDPRESS_CLIENT_SECRET=
MEDIUM_CLIENT_ID=
MEDIUM_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
```

## Project Structure

```
blog-social/
├── frontend/           # Next.js frontend application
├── backend/           # Express backend application
└── docs/             # Additional documentation
```

## License

MIT
