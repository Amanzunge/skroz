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
