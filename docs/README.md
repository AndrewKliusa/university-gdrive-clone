# Photo Drive Website
A personal photo organizer. The owner uploads photos, groups them into **albums** (e.g. Wedding, Honeymoon), and tags the **people** who appear in each photo (e.g. Mother, Sister). The app shows a list of photos, filterable by album or person, with summary stats (photo count, total size, date range) per album and per person.

> Project can be run by starting the server using `npm start` and opening any of the html files in the browser.

Pages:
* [photos.html](../frontend/photos.html): List of all photos. Displays information about photo album, people in the photo and date of the photo. Filterable by album, person and date range.
* [albums.html](../frontend/albums.html): List of all albums. Displays information about the album and the photos in the album. Filterable by name.
* [people.html](../frontend/people.html): List of all people. Displays information about the person and the photos of the person. Filterable by name.

<br>*Note: To delete/edit `photo` or `album`, press corresponding button and click on a card you want to affect.*
<br>*Note: To delete/edit a `person` you need to hover over the person's avatar and click the corresponding button.*

### Frontend
Each page has its own html, css and js files. All three pages use the same shared.css and shared.js files.
HTML uses semantic elements and dialogs for taking input from the user. CSS uses flexbox/grid for layout and has proper units and media queries for responsiveness. JS loads information about photos, albums, people and displays it on the pages. It also caches the data for filtering and displaying current values in modals. It also handles clicks for every button and event listeners for every input field.

Codebase Navigation:
- HTML for navigation: [photos.html (14-21)](../frontend/photos.html#L14-L21)
- HTML for buttons/filters: [photos.html (25-42)](../frontend/photos.html#L25-L42)
- HTML for dialogs: [photos.html (43-92)](../frontend/photos.html#L43-L92)
- CSS for media queries: [shared.css (208-242)](../frontend/css/shared.css#L208-L242)
- CSS for album hover animation: [albums.css (5-37)](../frontend/css/albums.css#L5-L37)
- CSS for person buttons appearing on hover: [people.css (16-57)](../frontend/css/people.css#L16-L57)
- CSS for navigation/cards/buttons/layout: [shared.css (1-206)](../frontend/css/shared.css#L1-L206)
- JS for fetching photos and rendering them: [photos.js (61-174)](../frontend/scripts/photos.js#L61-174)
- JS for 


### Project structure
```
photo-drive/
├── backend/
│   ├── server.js                 # Express entry point
│   ├── vitest.config.js
│   ├── database/
│   │   ├── database.js           # SQLite connection and Database facade
│   │   ├── schema.sql            # Table definitions
│   │   ├── seed.js               # Demo data (Cats, Dogs, Vegetables albums)
│   │   ├── database.sqlite
│   │   └── crud/
│   │       ├── album.js
│   │       ├── person.js
│   │       └── photos.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── multer.js             # File upload handling
│   │   └── zod.js                # Request validation
│   ├── routes/
│   │   ├── albums.route.js
│   │   ├── people.route.js
│   │   └── photos.route.js
│   ├── schemas/
│   │   ├── album.schema.js
│   │   ├── common.js
│   │   ├── person.schema.js
│   │   └── photo.schema.js
│   ├── tests/
│   │   ├── setup.js
│   │   ├── integration/
│   │   │   ├── albums.test.js
│   │   │   ├── people.test.js
│   │   │   └── photos.test.js
│   │   └── unit/
│   │       ├── albums.test.js
│   │       ├── people.test.js
│   │       └── photos.test.js
│   └── uploads/                  # Stored photo files (seed images + user uploads)
│       ├── cat1.jpg … cat5.jpg
│       ├── dog1.jpg … dog5.jpg
│       ├── brocoli.jpg, carrot.jpg, corn.jpg, pepper.jpg, …
│       └── …                     # UUID-named files created on upload
├── frontend/
│   ├── photos.html
│   ├── albums.html
│   ├── people.html
│   ├── css/
│   │   ├── shared.css
│   │   ├── photos.css
│   │   ├── albums.css
│   │   └── people.css
│   ├── scripts/
│   │   ├── shared.js             # API helpers, navigation, seed trigger
│   │   ├── photos.js
│   │   ├── albums.js
│   │   └── people.js
│   └── resources/                # Static assets used by the frontend
│       ├── cat.png
│       └── cat_cropped.png
├── docs/
│   ├── README.md
│   ├── ERD.dbml
│   ├── ERD.png
│   ├── API-specification.docx
│   └── wireframes/
│       ├── photos.png
│       ├── albums.png
│       └── people.png
├── .env                          # Production environment config (uses sqlite db)
├── .env.test                     # Test environment config (uses in-memory sqlite db)
├── .gitignore
└── package.json
```

