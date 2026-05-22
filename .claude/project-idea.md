# Project Idea — Photo Gallery

A single-user personal photo organizer. The owner uploads photos, groups them into **albums** (e.g. Wedding, Honeymoon), and tags the **people** who appear in each photo (e.g. Mother, Sister). The app shows a gallery view, filterable by album or person, with summary stats (photo count, total size, date range) per album and per person.

No authentication, no user accounts — this is a personal-use app, treated as a single tenant.

## Resources & relationships

- **Album** — a named group of photos (name, description, created_at).
- **Person** — a person who can appear in photos (name, created_at).
- **Photo** — uploaded image with metadata (hash filename on disk, original name, size_bytes, caption, taken_at, created_at). Optionally belongs to one album; tagged with many people via `photo_people`.

Relationships:
- One-to-many: **Album → Photos** (optional — `album_id` is nullable, photos may be "unalbumed").
- Many-to-many: Photo ↔ People via `photo_people` join table. This is the rubric-relevant complexity.

## Schema (DBML)

```dbml
Table album {
  id integer [primary key]
  name varchar [not null]
  description varchar
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
}

Table person {
  id integer [primary key]
  name varchar [not null]
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
}

Table photo {
  id integer [primary key]
  album_id integer
  hash varchar [not null]          // multer-generated filename on disk
  name varchar [not null]          // original filename from upload
  size_bytes integer [not null]
  caption varchar
  taken_at timestamp
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
}

Table photo_people {
  photo_id integer [not null]
  person_id integer [not null]
  indexes { (photo_id, person_id) [pk] }
}

Ref: photo.album_id        > album.id   [delete: set null]   // photos survive album delete
Ref: photo_people.photo_id  > photo.id  [delete: cascade]
Ref: photo_people.person_id > person.id [delete: cascade]
```

## Features per resource

### Albums (full CRUD)
- Create (name, description).
- List, filterable by `search`, `sort=name|createdAt|photoCount`.
- Get by id → album + computed summary (photo count, total size, first/last photo date, distinct people).
- Update (rename / re-describe).
- Delete (photos become unalbumed — `album_id = NULL`).

### People (full CRUD)
- Create (name).
- List, filterable by `search`, `sort=name|photoCount`.
- Get by id → person + summary (photo count, albums they appear in).
- Update / delete (cascade-deletes their `photo_people` rows).

### Photos (full CRUD)
- Upload (multipart): file + albumId (optional) + caption + peopleIds[].
- List filterable by `albumId`, `personId`, `from`, `to`, `sort=date|size|name`, `order`, `search` (caption).
- Get by id → metadata + URL + tagged people.
- Update (caption, album, tagged people).
- Delete (removes file from disk and DB row in one transaction).

### Photo ↔ People tagging
- `POST /photos/:photoId/people/:personId` — tag a person on a photo.
- `DELETE /photos/:photoId/people/:personId` — untag.

### Computed views (GET-only, no separate table)
- `GET /albums/:albumId/summary` — photo count, total MB, date range, distinct people in this album.
- `GET /people/:personId/summary` — photo count, list of albums this person appears in.
- `GET /stats` — totals: photos, albums, people, storage used.

## Frontend pages

- `index.html` — main gallery, all photos. Filter bar (album/person/date). Click a thumbnail → lightbox modal. "+ Upload" button in header → upload modal.
- `albums.html` — album list with cover thumb + summary. Click an album → `album.html?id=...`.
- `album.html` — photos in one album (`?id=` query string). Same grid as `index.html`, scoped.
- `people.html` — manage the people list (add / rename / delete). Click a person → filtered gallery view (`index.html?personId=...`).

Navigation = plain `<a href>` between standalone HTML files (no router). Page-specific context (e.g. selected album id) passes via query string. Upload and photo detail (lightbox) are **modals** mounted on the gallery pages — no dedicated `upload.html` or `photo.html`.

## Folder structure

```
Web Basics/
├── backend/
│   ├── package.json          # npm start runs the server
│   ├── server.js
│   ├── database.sqlite
│   ├── uploads/              # photo files (gitignored, app creates on startup)
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── helpers/          # database-helper module + file-helper
│       └── middleware/       # global error handler, multer config
├── frontend/
│   ├── index.html            # main gallery
│   ├── albums.html
│   ├── album.html
│   ├── people.html
│   ├── css/styles.css        # shared
│   └── js/
│       ├── api.js            # shared Fetch wrappers (async/await)
│       ├── upload.js         # shared upload modal
│       ├── lightbox.js       # shared photo-detail modal
│       └── <page>.js
├── docs/
│   └── Assignment_Description.pdf
└── .claude/
```

Backend dependencies: `express`, `cors`, `better-sqlite3` (or `sqlite3`), `multer`. CORS middleware required on both JSON endpoints and the `/uploads` static route so `<img>` tags can load cross-origin.

## Design stance (no auth, single user)

The assignment does not require authentication, and this app is designed as single-user/personal. Defensive controls still apply:

- **Ownership validation on writes.** Moving a photo into an album requires the album to exist (404 if not). Tagging a person requires the person to exist (404 if not). The join table FK constraints enforce this at the DB layer too.
- **Random filenames.** Keep `multer`'s default hash names — never `originalname` — so files can't be enumerated by guessing.
- **File size + MIME validation.** 5 MB cap; accept only `image/jpeg`, `image/png`, `image/webp`.
- **Documented honestly** in the Design Decisions section: "Single-user personal app, no authentication. Anyone with access to the running app can read/write all data. Multi-user support would require session/token auth, out of scope here."

## File upload specifics

- `multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: ... })` accepts only allowed image MIME types.
- `app.use('/uploads', express.static('uploads'))` serves files back. URLs look like `http://localhost:3000/uploads/a8f3e2c91b4d.jpg`.
- **Delete must remove file + DB row together.** Wrap in try/catch; if file unlink fails on a non-existent file, log and proceed (don't crash the delete).
- `uploads/` is in `.gitignore`; backend creates the folder on startup if missing.
- Frontend uses `FormData` for upload (no `Content-Type` header — let the browser set the multipart boundary). Show a client-side thumbnail preview using `URL.createObjectURL()` before submit.

## Sequence-diagram candidates

1. **Upload photo with people tagged in one request.** Browser sends multipart (file + caption + albumId + peopleIds[]) → `multer` writes file to `/uploads` → controller verifies album + each person exist → BEGIN TRANSACTION → INSERT photo row → INSERT N rows in `photo_people` → COMMIT → return new photo metadata with URL + tagged people. Crosses filesystem + DB, transactional, validates multiple referenced FKs.
2. **Get album summary.** Aggregates `albums → photos (COUNT, SUM(size_bytes), MIN/MAX(taken_at)) → photo_people → people (DISTINCT)` to return photo count, total MB, date range, and distinct people. Real multi-table JOIN with aggregation.

## Requirement coverage

| Requirement | Coverage |
|---|---|
| 3+ related resources | 3 (Albums, People, Photos) + photo_people join |
| One-to-many | Album → Photos |
| Full CRUD on ≥2 | Photos, Albums, People (3 of them) |
| Query params on 3+ endpoints | photos list (`albumId`, `personId`, `from`, `to`, `sort`, `search`); albums list; people list |
| Path params on 3+ endpoints | every `/:id`, plus nested `/photos/:photoId/people/:personId`, `/albums/:albumId/summary`, `/people/:personId/summary` |
| Multiple frontend pages | 4 (index, albums, album, people) |
| Two complex sequence diagrams | covered above |

## Why this hits 10/10 signals

- **DB depth (10/10):** Photo↔People many-to-many with summary endpoints forces real JOIN + COUNT/SUM/MIN/MAX/DISTINCT queries, abstracted behind a `database-helper` module.
- **Backend (30/30):** transactional upload (file + DB rows), ownership validation, cascade-delete-with-filesystem, global error handler covering multer errors (`LIMIT_FILE_SIZE`, invalid MIME) + validation + 404s. Plenty of complex code to justify JSDoc.
- **Docs (10/10):** sequence diagrams have real substance (transactions, filesystem + DB), ERD shows the meaningful many-to-many, design-decisions section addresses the no-auth/single-user trade-off honestly.
- **Frontend (25/25):** photo grid is a natural fit for CSS Grid with responsive `minmax()` columns; upload preview uses `URL.createObjectURL()` for client-side thumbnail before submit — real DOM dynamism. Upload + lightbox modals add meaningful interactivity.
- **Fetch (15/15):** all four verbs naturally used; `FormData` for multipart upload alongside JSON for everything else; descriptive error messages for 400 (bad MIME), 413 (too large), 404, 500.

## Bonus polish (optional, end-of-project)

- Cover photo per album (`albums.cover_photo_id` FK) — show as thumbnail on the album list.
- Free-text search across captions and people names.
- Favorite flag on photos for an extra filter (`?favorite=true`).
- Tag table (4th resource) for free-form themes — parallels Person but for topics, not who's in the photo.
