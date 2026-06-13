CREATE TABLE IF NOT EXISTS album (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  color       TEXT,
  photo_id    INTEGER,
  description TEXT,
  created_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (photo_id) REFERENCES photo(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS person (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  photo_id    INTEGER,
  avatar_id   INTEGER,
  name        TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (photo_id) REFERENCES photo(id) ON DELETE SET NULL,
  FOREIGN KEY (avatar_id) REFERENCES photo(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS photo (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  album_id    INTEGER,
  hash        TEXT    NOT NULL,
  name        TEXT    NOT NULL,
  size_bytes  INTEGER NOT NULL,
  caption     TEXT,
  taken_at    TEXT,
  created_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (album_id) REFERENCES album(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS photo_people (
  photo_id   INTEGER NOT NULL,
  person_id  INTEGER NOT NULL,
  PRIMARY KEY (photo_id, person_id),
  FOREIGN KEY (photo_id)  REFERENCES photo(id)  ON DELETE CASCADE,
  FOREIGN KEY (person_id) REFERENCES person(id) ON DELETE CASCADE
);
