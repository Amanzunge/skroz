# skro.z — uputstvo za sajt

Sajt čine obični fajlovi (HTML, CSS, JS), bez baze i bez instalacije.
**Sve što se menja nalazi se u jednom fajlu: `sadrzaj.js`.**

```
skroz/
├── index.html        početna (slajder, radovi, usluge, o meni, kontakt)
├── rad.html          stranica jednog rada (galerija + 360°)
├── sadrzaj.js        ← SVI TEKSTOVI, SLIKE I RADOVI
├── css/stil.css      izgled
├── js/sajt.js        animacije, slajder, galerija
├── js/panorama.js    360° pregledač
└── slike/            ovde idu vaše fotografije
```

> Trenutne slike i tekstovi su **primeri**. Slike su sa Unsplash-a i Poly Haven-a
> (besplatne) i treba ih zameniti pravim fotografijama projekata.

---

## 1. Dodavanje novog rada

1. Napravite folder za slike, npr. `slike/radovi/kuca-novi-sad/`
2. Ubacite fotografije: `01.jpg`, `02.jpg`, `03.jpg`…
3. Otvorite `sadrzaj.js`, nađite deo `radovi: [` i kopirajte jedan ceo blok `{ … },`
4. Promenite podatke:

```js
{
  id: "kuca-novi-sad",                 // bez razmaka i bez č ć š ž đ
  naslov: "Kuća u Novom Sadu",
  lokacija: "Novi Sad",
  datum: "2026",                       // može i "mart 2026"
  naslovna: "slike/radovi/kuca-novi-sad/01.jpg",
  opis: "",                            // kratak tekst, nije obavezno
  slike: [
    "slike/radovi/kuca-novi-sad/01.jpg",
    "slike/radovi/kuca-novi-sad/02.jpg",
    "slike/radovi/kuca-novi-sad/03.jpg",
  ],
  panorame: [
    { naziv: "Dnevna soba", slika: "slike/radovi/kuca-novi-sad/360-dnevna.jpg" },
    { naziv: "Kuhinja",     slika: "slike/radovi/kuca-novi-sad/360-kuhinja.jpg" },
  ],
},
```

- Redosled u fajlu = redosled na sajtu (prvi blok je prvi rad).
- Ako rad nema 360° slike, ostavite `panorame: [],`
- Rad se otvara na adresi `rad.html?id=kuca-novi-sad`.

## 2. Slajder na početnoj

U `sadrzaj.js` deo `slajder: [ … ]` — svaka stavka je jedna slika:

```js
{ slika: "slike/radovi/kuca-novi-sad/01.jpg", naslov: "Kuća u Novom Sadu", rad: "kuca-novi-sad" },
```

`rad` je `id` rada na koji vodi klik (može se izostaviti).
Brzina: `slajderSekundi: 5` (broj sekundi po slici).

## 3. 360° panorame

- Format: **2:1 „equirectangular“** JPG (npr. 6000 × 3000 px).
- Takve slike daju svi programi za render: **Lumion, Enscape, Twinmotion, V-Ray, Corona, D5 Render**
  (opcija „360° panorama“ / „Panorama“ / „Spherical“), kao i 360° kamere (Insta360, Ricoh Theta).
- Preporuka: do ~5 MB po panorami (šira od 8000 px nije potrebna).
- Opciono, za brže sličice prostorija: `slicica: "slike/.../360-dnevna-mala.jpg"` (manja slika, npr. 640 × 320).

Šta posetilac vidi: panorama se „razmota“ iz male planete, polako se sama okreće,
može da se vuče mišem/prstom, zumira (Ctrl + točkić), otvara preko celog ekrana,
a ispod su sličice prostorija za prelazak iz sobe u sobu.

## 4. Veličina fotografija

- Široke ~2000 px, JPG kvalitet ~80% → oko 300–600 KB po slici.
- Za smanjivanje: besplatno na <https://squoosh.app> ili <https://tinypng.com>.

## 5. Tekstovi

U `sadrzaj.js`: delovi `usluge`, `oMeni` i `kontakt`.
Ako nešto u kontaktu ne treba da se prikaže, ostavite prazne navodnike: `instagram: ""`.

## 6. Pregled na svom računaru

Panorame ne rade kada se `index.html` otvori dvoklikom (pregledač to blokira).
Pokrenite mali lokalni server u folderu sajta:

```bash
python -m http.server 8000
```

pa otvorite <http://localhost:8000>.

## 7. Sajt je na GitHub Pages (besplatno)

Sajt se nalazi u GitHub repozitorijumu i GitHub ga sam objavljuje na domenu.

### Izmene posle objavljivanja (sve iz pregledača, bez instalacije)

- **Tekst ili novi rad:** na github.com otvorite repozitorijum → `sadrzaj.js` → ikonica olovke
  (Edit) → izmenite → zeleno dugme **Commit changes**.
- **Nove slike:** uđite u folder `slike/radovi/` → **Add file → Upload files** → prevucite
  ceo folder rada sa slikama (npr. `kuca-novi-sad`) → **Commit changes**.
- Sajt se osveži za 1–2 minuta (napredak se vidi u kartici **Actions**).
  Ako se izmena ne vidi, osvežite stranicu sa Ctrl + F5.

### Prvo podešavanje (radi se jednom)

1. **Nalog:** <https://github.com/signup>
2. **Repozitorijum:** gore desno **+ → New repository** → ime `skroz` → **Public** →
   ne štiklirati ništa ispod → **Create repository**.
3. **Fajlovi:** u praznom repozitorijumu kliknite **uploading an existing file** i prevucite
   *sadržaj* foldera `skroz` (fajlove i foldere `css`, `js`, `slike` — ne sam folder `skroz`
   i ne folder `.claude`) → **Commit changes**.
4. **Uključivanje sajta:** **Settings → Pages** → *Source*: **Deploy from a branch** →
   *Branch*: **main**, folder **/(root)** → **Save**.
   Za 1–2 minuta sajt radi na `https://KORISNIK.github.io/skroz/`.
5. **Domen na GitHub-u:** **Settings → Pages → Custom domain** → upišite `domen.rs` → **Save**.

### Domen na Loopiji

Loopia korisnička zona → kliknite domen → **DNS editor**.

1. Kod **@** obrišite (crveno dugme **Delete**) sve postojeće **A** i **AAAA** zapise.
2. Za **@** dodajte četiri **A** zapisa (**Add a new record**, Type **A**, TTL **3600**):
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Kod **www** obrišite postojeći zapis i dodajte **CNAME** sa vrednošću `KORISNIK.github.io`
4. Ako postoji poddomen **\*** (zvezdica), obrišite ga.

Posle 15 minuta do nekoliko sati, u **Settings → Pages** piše *DNS check successful*.
Tada štiklirajte **Enforce HTTPS** (sertifikat može da kasni do sat vremena).
