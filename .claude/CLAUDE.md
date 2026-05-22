# Web Basics — School Project

Individual full-stack assignment at Saxion. Full assignment text lives in `docs/Assignment_Description.pdf` — re-read it when a detail here is ambiguous. Grading rubric is summarized in `.claude/rubrics.md` — consult it when making design/quality trade-offs.

## Project idea

**Photo Gallery** — a single-user personal photo organizer. The owner uploads photos, groups them into **albums** (e.g. Wedding, Honeymoon), and tags the **people** who appear in each photo (e.g. Mother, Sister). The app shows a gallery filterable by album/person, with summary stats per album and per person. No authentication and no user accounts — this is a personal-use app.

Resources: **Album**, **Person**, **Photo** (3 resources). Many-to-many `photo_people` join table is the rubric-relevant complexity; `Album → Photos` provides the one-to-many.

Frontend pages: `index.html` (main gallery), `albums.html` (album list), `album.html` (photos in one album, `?id=`), `people.html` (manage people). Photo upload + photo detail (lightbox) are modals, not dedicated pages. Plain `<a href>` navigation, no router. File upload via `multer` + `multipart/form-data`; files served from `/uploads`.

Full feature list, endpoint design, folder layout, sequence-diagram candidates, and rubric coverage are in **`.claude/project-idea.md`** — re-read it whenever working on this project.

## Stack & structure (hard constraints)

- Two separate projects in this repo: a **backend** folder and a **frontend** folder.
- Backend: **Node.js + Express**, JavaScript only. Must start with `npm start` with no extra config.
- Backend storage: **SQLite**.
- Frontend: plain **HTML + CSS + JavaScript**. Runs by opening `index.html` directly — no package manager, no build step.
- **No CSS frameworks** (write CSS by hand). **No JS frameworks** (vanilla JS only).
- Frontend talks to backend via **Fetch API** only.

## Backend requirements

- REST-compliant, with correct HTTP **status codes**.
- **At least 3 resources**, related to each other.
- **At least one one-to-many** relationship between resources.
- **Full CRUD** for **at least 2 resources**, using correct verbs (GET / POST / PUT / DELETE).
- **At least 3 endpoints** use **query parameters**.
- **At least 3 endpoints** use **path parameters**.
- Error handling + status codes everywhere.

## Frontend requirements

- **Multiple HTML pages**, all styled and interactive.
- **Responsive** — proper units (rem/em/%/vw…) and media queries.
- Pages must both **GET** data from and **POST/PUT/DELETE** data to the backend via Fetch.
- Fetch calls must include **error handling** and check status codes.
- Forms validated with **JS + built-in HTML validation**.
- Entry point: `frontend/index.html` opened directly in a browser.

## Documentation deliverables

- Full **REST API specification** (Brightspace template) — all endpoints, all status codes, example req/resp.
- **At least 2 sequence diagrams** for more complex requests.
- **Database diagram**.
- **Wireframes**.
- **Design decisions** written up.
- Document: cover page (student number + name), TOC, page numbers, **max 8 pages** (excluding cover + TOC).

## Grading (see `.claude/rubrics.md` for full breakdown)

- Total **100 pts**, pass at 55, final grade = total / 10.
- Biggest pools: **Backend code (30)** and **Frontend HTML/CSS/JS (25)**.
- Excellence signals to aim for:
  - Backend: **ES Modules**, modular layout (routers / helpers / controllers), **global error handler**, input validation, **JSDoc** on complex code, REST-conformant naming.
  - Database: queries abstracted behind a **database-helper module** (controllers never touch SQL directly).
  - Frontend: HTML5 semantics, **Flexbox/Grid**, responsive units + media queries, multi-page nav without URL hacking.
  - Fetch: **async/await**, full CRUD verbs, **user-friendly error messages** on bad status codes.
  - Docs: every endpoint with description/params/body/status codes/examples; sequence diagrams + ERD + wireframes with explanations including the complex parts.
  - Defensive: validate ownership of every referenced foreign key on writes (e.g. moving a photo into an album requires that album to exist; tagging requires the person to exist). Mismatches return 404. Single-user design — note this trade-off in the design-decisions doc.

## Entry criteria (block grading if failed)

- Backend: Node.js + Express, starts with `npm start` no config, working SQLite.
- Frontend: plain HTML/CSS/JS, runs by opening `index.html`, connected via Fetch.
- Documentation submitted.