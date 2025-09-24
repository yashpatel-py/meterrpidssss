# Meteorroids Backend Utilities

This directory contains lightweight tooling for managing the PostgreSQL schema that powers the Meteorroids blog.

## Prerequisites

1. Node.js 18+
2. PostgreSQL instance (local development can use the one you created in pgAdmin: database `meteorroids`, password `yash2121`).

## Setup

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file by copying `.env.example` and adjusting credentials as needed:

   ```bash
   cp .env.example .env
   # edit the file to set PGUSER (for example: postgres)
   ```

   If you prefer a single connection string, you may set `DATABASE_URL` instead of individual PG* variables (the script supports both).
   Ensure `JWT_SECRET` is a long random string in production.

## Apply the schema

Run the migration script to create the blog tables inside your `meteorroids` database:

```bash
npm run migrate
```

The script is idempotent. It will create tables if they do not exist and log success or failure in the terminal.

## Run the API locally

With the schema in place you can start the Express API:

```bash
npm run dev
```

This boots a server (default `http://localhost:4000`) exposing:

- `GET /health` – connection check
- `GET /api/posts` – list posts (query params: `status`, `limit`, `page`)
- `GET /api/posts/:slug` – fetch a single post with author, category, tags, and media
- `GET /api/categories` – categories + published counts
- `GET /api/tags` – tags + usage counts

If you prefer a production-style start, use `npm run start`.

### Create or update an admin user

Use the helper script to seed a secure admin account (passwords stored as bcrypt hashes):

```bash
npm run create:admin
```

You’ll be prompted for email and password; rerunning the script with the same email rotates the password safely.

## Schema overview

- `authors`, `categories`, `tags` for organizing content.
- `posts` holds the main blog article data with SEO fields.
- `post_tags` joins posts and tags (many-to-many).
- `post_media` stores optional galleries/assets.

Indexes are added to common lookup fields to keep queries fast.

You can now hook your backend API or CMS tooling to the same database schema.
