-- skro.z: baza za investitorske stranice (Cloudflare D1)

-- podešavanja servera: veza sa OneDrive-om (tokeni), nalog itd.
CREATE TABLE IF NOT EXISTS podesavanja (
  kljuc TEXT PRIMARY KEY,
  vrednost TEXT NOT NULL
);

-- jedan red = jedan projekat (folder na OneDrive-u) i njegov tajni link
CREATE TABLE IF NOT EXISTS projekti (
  folder_id TEXT PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  naziv TEXT,
  napravljen TEXT NOT NULL
);

-- evidencija pregleda po projektu
CREATE TABLE IF NOT EXISTS pregledi (
  folder_id TEXT PRIMARY KEY,
  otvaranja INTEGER NOT NULL DEFAULT 0,
  prosledjena_otvaranja INTEGER NOT NULL DEFAULT 0,
  prosledjivanja INTEGER NOT NULL DEFAULT 0,
  poslednje TEXT
);

-- oznake (zahtevi za izmenu) na renderima i stranama PDF-a
-- koordinate su delovi širine/visine slike ili strane (0 do 1)
CREATE TABLE IF NOT EXISTS oznake (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  folder_id TEXT NOT NULL,
  fajl_id TEXT NOT NULL,
  fajl_ime TEXT,
  strana INTEGER NOT NULL DEFAULT 0,
  x0 REAL NOT NULL,
  y0 REAL NOT NULL,
  x1 REAL NOT NULL,
  y1 REAL NOT NULL,
  tekst TEXT NOT NULL,
  verzija TEXT,
  verzija_datum TEXT,
  napravljena TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'otvoreno',
  resena TEXT,
  kljuc TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS oznake_projekat ON oznake (folder_id);
