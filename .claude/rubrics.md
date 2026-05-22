# Web Basics — Grading Rubrics

Total: **100 points**. Pass at **55**. Final grade = total / 10, rounded.

---

## Entry requirements (0 pts — pass/fail gate)

**Fail (0)** if any of:
- Documentation missing.
- Backend missing or not Node.js + Express.
- Backend does not use SQLite.
- Frontend missing.
- No Fetch connection between frontend and backend.

**Pass** when all four are submitted and frontend ↔ backend is wired via Fetch.

---

## Documentation: REST API design — /10

| Pts | Level | Criteria |
|---|---|---|
| 0 | Insufficient | No REST API specification. |
| 3 | Mediocre | Only a few endpoints specified, OR many inconsistencies/errors. |
| 6 | Sufficient | Most endpoints specified, but with inconsistencies/mistakes. |
| 8 | Good | All endpoints documented, with a few inconsistencies/errors. |
| 10 | Excellent | All endpoints documented with description, params, body, status codes, and explanations. |

---

## Documentation: Wireframes, diagrams and explanation — /10

| Pts | Level | Criteria |
|---|---|---|
| 0 | Insufficient | No explanations OR diagrams missing. |
| 3 | Mediocre | Only one diagram type, no further explanation, wireframe missing. |
| 6 | Sufficient | Sequence diagram + ERD present, but explanation unclear/errors, OR wireframe missing. |
| 8 | Good | Complete: all diagrams, wireframes, explanations of case + design choices — but missing for the more complex parts. |
| 10 | Excellent | Complete and high quality. |

---

## Backend: RESTful Node.js + Express app — /30

| Pts | Level | Criteria |
|---|---|---|
| 0 | Insufficient | Messy/unreadable code, coding standards not followed, OR REST standards not followed / too many errors, OR backend doesn't match API spec. |
| 8 | Mediocre | Heavy code repetition with no attempt to remove it, OR REST standards followed but with many inconsistencies. |
| 16 | Sufficient | Well-written but unclear separation of concerns; long files, little modular organization. OR occasional crashes on bad input. OR REST mostly good but error handling not watertight. |
| 23 | Good | NodeJS + Express with **ES Modules**; well-divided submodules (routers, helpers) with separation of concerns. AND consistent, self-explanatory naming. AND proper input validation + global error handler. AND little/no code documentation. AND complies with REST spec but with some consistent errors. |
| 30 | Excellent | All of "Good" PLUS proper **JSDoc** on harder/complex code. AND all endpoints follow REST standards including naming. AND all relevant resources accessible, customisable, deletable. |

---

## Backend: Database and queries — /10

| Pts | Level | Criteria |
|---|---|---|
| 0 | Insufficient | Not connected to SQLite. |
| 3 | Mediocre | Connected to SQLite but data is hardcoded (not actually pulled from DB). |
| 6 | Sufficient | Connected, but lacks complexity (e.g. no one-to-many relationship). |
| 8 | Good | Connected, but queries are inefficient or return incorrect/incomplete data. |
| 10 | Excellent | Connected; queries are efficient and correct. AND routers/controllers don't use queries directly — they go through a **database-helper module** that abstracts the queries away. |

---

## Frontend: HTML, CSS, JS — /25

| Pts | Level | Criteria |
|---|---|---|
| 0 | Insufficient | Doesn't run by opening `index.html`, OR everything in one file, OR one of HTML/CSS/JS missing. |
| 6 | Mediocre | No semantic HTML, OR not responsive, OR very basic JS not connected to events, OR no error handling. |
| 13 | Sufficient | Uses required techniques but with mistakes or superficially. AND pages match the simple wireframes. |
| 19 | Good | HTML/CSS/JS in separate files; multiple pages navigable without manual URL editing — but mistakes in how HTML/CSS/JS are used. AND pages match wireframes. |
| 25 | Excellent | Separated files, multi-page nav. AND **HTML5 semantics + Flexbox/Grid**. AND fully styled, responsive, proper units + media queries. AND JS handles events (click etc.) and makes page dynamic. AND pages match wireframes. |

---

## Frontend: Fetch API — /15

| Pts | Level | Criteria |
|---|---|---|
| 0 | Insufficient | Connected but not using Fetch API. |
| 4 | Mediocre | Only GET requests; responses not used to fill the frontend. |
| 8 | Sufficient | Only GET requests, but responses used for DOM manipulation. |
| 11 | Good | All verbs (GET/POST/PUT/DELETE), but error handling forgotten OR `.then`/async-await used inconsistently. AND user is informed about status code errors. |
| 15 | Excellent | Fetch used correctly with **async/await**. AND result used for DOM manipulation. AND all verbs supported and response data processed. AND **descriptive, non-technical error messages** for status code errors. |

---

## Score allocation summary

| Section | Max |
|---|---|
| Entry requirements | gate |
| Documentation: REST API design | 10 |
| Documentation: Wireframes, diagrams, explanation | 10 |
| Backend: RESTful Node.js + Express app | 30 |
| Backend: Database and queries | 10 |
| Frontend: HTML, CSS, JS | 25 |
| Frontend: Fetch API | 15 |
| **Total** | **100** |

The biggest point pools are **Backend code quality (30)** and **Frontend HTML/CSS/JS (25)** — prioritize ES Modules, modular structure, global error handler, JSDoc on complex code, semantic HTML5, Flexbox/Grid, responsive design, and a database-helper abstraction layer.
