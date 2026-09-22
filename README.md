# BookNest

A small bookshop's REST API: Node.js 24 and Express, backed by
PostgreSQL, with a static front end served by the API itself.

## Run it

```sh
docker compose up -d   # PostgreSQL on localhost:5432
npm install            # express, pg
npm start              # http://localhost:3000
npm test               # node --test, real PostgreSQL
```

The schema and the six-book seed catalog (`db/schema.sql`,
`db/seed.json`) are created on first start. Stop PostgreSQL with
`docker compose down` (add `-v` to delete its data volume).

## API

| Method | Path             | Description                          |
|--------|------------------|--------------------------------------|
| GET    | `/health`        | Liveness, no database check          |
| GET    | `/ready`         | Readiness, `SELECT 1` on PostgreSQL  |
| GET    | `/api/books`     | All books; `?genre=`, `?inStock=`    |
| GET    | `/api/books/:id` | One book by id, or 404               |

## Environment variables

`PORT` (default `3000`), and `PGHOST`, `PGPORT`, `PGUSER`,
`PGPASSWORD`, `PGDATABASE` (defaults match `docker-compose.yml`).
