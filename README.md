# BookNest

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js 24](https://img.shields.io/badge/node-24-339933.svg)](.nvmrc)

**BookNest is the catalog API for a small independent bookshop.** It serves the shop's books as JSON,
with search, filtering, sorting and paging, and ships a plain HTML catalog page that uses the same API.
It is small enough to read in an afternoon and complete enough to deploy: health and readiness
endpoints, real integration tests, and one command to start its database.

```sh
curl "http://localhost:3000/api/books?genre=Cooking&sort=rating"
```

## Features

- REST API on Node.js 24 and Express 5, with PostgreSQL 18 for storage
- Title search (`?q=`), filters (`?genre=`, `?inStock=`, `?author=`), sorting and paging
- `/health` for liveness and `/ready` for readiness, ready for container platforms
- Integration tests with Node's built-in test runner against a real database

## Quick start

```sh
git clone https://github.com/binarybehemoth/booknest.git && cd booknest
docker compose up -d   # PostgreSQL on localhost:5432
npm install
npm start              # http://localhost:3000
npm test               # node --test, real PostgreSQL
```

`npm run dev` restarts the API every time you save a file. Copy `.env.example` to `.env` to
change the port or database settings.

## API

| Method | Path             | Description                                        |
|--------|------------------|----------------------------------------------------|
| GET    | `/health`        | Liveness, no database check                        |
| GET    | `/ready`         | Readiness, `SELECT 1` on PostgreSQL                |
| GET    | `/api/books`     | Books; `?genre=`, `?inStock=`, `?author=`, `?q=`, `?sort=` |
| GET    | `/api/books/:id` | One book by id, or 404                             |
| GET    | `/api/genres`    | Each genre with its number of books                |

`/api/books` returns at most 20 books at a time: `?limit=` (up to 100) and `?offset=` page
through the rest. `?sort=` accepts `price`, `rating`, `year` or `title`; any other
value is answered with 400.

## Errors

Every error is JSON with a single `error` field, for example `{"error":"book not found"}`.

| Status | When                                                       |
|--------|------------------------------------------------------------|
| 400    | `/api/books/:id` with a non-integer id, or an unknown `?sort=` |
| 404    | An unknown book id, or any other path under `/api`         |
| 500    | An unexpected server error; the details go to the log only |
| 503    | `/ready` only: PostgreSQL cannot be reached                |

## Contributing

Bug reports and pull requests are welcome. Open an issue first for anything larger than a
small fix, so we can agree on the approach before you write the code.

`main` is protected: every change arrives through a pull request, and review threads must be
resolved before it merges.

## License

BookNest is released under the [MIT License](LICENSE).
