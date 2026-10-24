/* ==========================================================================
   SADRŽAJ SAJTA — skro.z
   --------------------------------------------------------------------------
   Ovo je JEDINI fajl koji treba menjati da biste promenili tekstove,
   slike i radove na sajtu. Detaljno uputstvo je u fajlu UPUTSTVO.md.

   Pravila:
   - Tekst uvek ide između navodnika: "ovako".
   - Posle svake stavke ide zarez.
   - Slike stavljate u folder  slike/  i ovde upisujete putanju,
     npr. "slike/radovi/kuca-u-sumi/01.jpg".
   - Trenutne slike su PRIMERI sa interneta (Unsplash, Poly Haven)
     i treba ih zameniti pravim fotografijama.
   ========================================================================== */

// Pomoćne funkcije za privremene slike — kad ubacite svoje slike, ne trebaju.
const foto = (id, w = 2000) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const pano = (ime) => `https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/${ime}.jpg`;
const panoSlicica = (ime) => `https://cdn.polyhaven.com/asset_img/primary/${ime}.png?height=180`;

window.SKROZ = {

  /* ---------- OSNOVNO ---------- */
  ime: "skro.z",
  opisPocetna: "Arhitektura i enterijer — od prve skice do ključa u ruci.",

  /* ---------- SLAJDER NA POČETNOJ ----------
     Slike se same smenjuju. "rad" je id rada na koji vodi klik (nije obavezno). */
  slajderSekundi: 5,
  slajder: [
    { slika: foto("1756706718604-ef4af3970e33"), naslov: "Kuća u šumi", rad: "kuca-u-sumi" },
    { slika: foto("1613977257363-707ba9348227"), naslov: "Vila sa bazenom", rad: "vila-sa-bazenom" },
    { slika: foto("1757524492552-d47a66a2b63e"), naslov: "Kuća na padini", rad: "kuca-na-padini" },
    { slika: foto("1600596542815-ffad4c1539a9"), naslov: "Stambeni objekat", rad: "stambeni-objekat" },
    { slika: foto("1580587771525-78b9dba3b914"), naslov: "Porodična kuća", rad: "porodicna-kuca" },
  ],

  /* ---------- USLUGE ---------- */
  usluge: {
    uvod: "Od prve skice do ključa u ruci — vodim vas kroz svaki korak, jasno i bez komplikacija.",
    stavke: [
      { naslov: "Idejno rešenje", tekst: "Upoznajemo se sa lokacijom i vašim željama. Pravim skice i 3D prikaze da biste odmah videli kako će prostor izgledati." },
      { naslov: "Projektna dokumentacija", tekst: "Kompletna dokumentacija za građevinsku dozvolu — od idejnog projekta do projekta za izvođenje." },
      { naslov: "Enterijer", tekst: "Raspored, materijali, rasveta i nameštaj po meri — prostor koji je i lep i praktičan za svakodnevni život." },
      { naslov: "3D prikazi i 360° ture", tekst: "Fotorealistični prikazi i virtuelna šetnja kroz prostor pre nego što počne gradnja." },
      { naslov: "Nadzor nad izvođenjem", tekst: "Pratim radove na terenu kako bi sve bilo izvedeno onako kako je projektovano." },
    ],
  },

  /* ---------- O MENI ---------- */
  oMeni: {
    istaknuto: "Verujem da dobra arhitektura počinje razgovorom — slušanjem kako ljudi žive, šta vole i šta im je zaista potrebno.",
    tekst: [
      "skro.z je arhitektonski studio koji projektuje kuće, stanove i poslovne prostore. Svaki projekat vodim lično, od prvog sastanka do završetka radova.",
      "Volim jednostavne forme, prirodno svetlo i materijale koji lepo stare. Cilj mi je da prostor bude lep, ali i da se u njemu dobro živi — bez nepotrebnih komplikacija.",
    ],
  },

  /* ---------- KONTAKT ----------
     Ako nešto ne želite da prikažete, ostavite prazne navodnike: "" */
  kontakt: {
    naslov: "Hajde da napravimo nešto zajedno",
    tekst: "Pozovite, pošaljite poruku ili svratite u studio. Prvi razgovor je uvek besplatan.",
    telefon: "+381 60 000 0000",
    email: "kontakt@skroz.rs",
    adresa: "Ulica i broj, Grad",
    instagram: "https://www.instagram.com/",
  },

  /* ---------- RADOVI ----------
     Svaki rad je jedan blok između { }. Da dodate novi rad, kopirajte ceo
     blok, promenite podatke i pazite da "id" bude jedinstven (bez razmaka
     i bez naših slova — npr. "kuca-u-sumi").

     naslovna  – slika koja se vidi na početnoj
     slike     – sve slike koje se vide kad se otvori rad
     panorame  – 360° slike (2:1, npr. 6000x3000 px). Može i prazno: []
     opis      – kratak tekst na stranici rada (nije obavezno, može "")     */
  radovi: [
    {
      id: "kuca-u-sumi",
      naslov: "Kuća u šumi",
      lokacija: "Fruška gora",
      datum: "2025",
      naslovna: foto("1756706718604-ef4af3970e33", 1400),
      opis: "",
      slike: [
        foto("1756706718604-ef4af3970e33"),
        foto("1605774337664-7a846e9cdf17"),
        foto("1772475385350-d130ebe22bf5"),
        foto("1680210849951-34d1a56eb7aa"),
        foto("1617597835919-3fdbf6efe48d"),
      ],
      panorame: [
        { naziv: "Dnevni boravak", slika: pano("wooden_lounge"), slicica: panoSlicica("wooden_lounge") },
        { naziv: "Salon sa kaminom", slika: pano("lythwood_room"), slicica: panoSlicica("lythwood_room") },
        { naziv: "Terasa", slika: pano("veranda"), slicica: panoSlicica("veranda") },
      ],
    },
    {
      id: "vila-sa-bazenom",
      naslov: "Vila sa bazenom",
      lokacija: "Vrdnik",
      datum: "2024",
      naslovna: foto("1613977257363-707ba9348227", 1400),
      opis: "",
      slike: [
        foto("1613977257363-707ba9348227"),
        foto("1512917774080-9991f1c4c750"),
        foto("1582268611958-ebfd161ef9cf"),
        foto("1664711942326-2c3351e215e6"),
        foto("1552454799-ca5cfdc612c8"),
      ],
      panorame: [
        { naziv: "Dnevna soba", slika: pano("lythwood_lounge"), slicica: panoSlicica("lythwood_lounge") },
        { naziv: "Spavaća soba", slika: pano("hotel_room"), slicica: panoSlicica("hotel_room") },
        { naziv: "Kupatilo", slika: pano("en_suite"), slicica: panoSlicica("en_suite") },
      ],
    },
    {
      id: "kuca-na-padini",
      naslov: "Kuća na padini",
      lokacija: "Sremski Karlovci",
      datum: "2024",
      naslovna: foto("1757524492552-d47a66a2b63e", 1400),
      opis: "",
      slike: [
        foto("1757524492552-d47a66a2b63e"),
        foto("1748063578185-3d68121b11ff"),
        foto("1513694203232-719a280e022f"),
        foto("1711873314952-7a2f19edb96a"),
      ],
      panorame: [],
    },
    {
      id: "stambeni-objekat",
      naslov: "Stambeni objekat",
      lokacija: "Novi Sad",
      datum: "2023",
      naslovna: foto("1600596542815-ffad4c1539a9", 1400),
      opis: "",
      slike: [
        foto("1600596542815-ffad4c1539a9"),
        foto("1483366774565-c783b9f70e2c"),
        foto("1601993957728-1e56ab70c5a8"),
        foto("1520529890308-f503006340b4"),
      ],
      panorame: [],
    },
    {
      id: "porodicna-kuca",
      naslov: "Porodična kuća",
      lokacija: "Beograd",
      datum: "2023",
      naslovna: foto("1580587771525-78b9dba3b914", 1400),
      opis: "",
      slike: [
        foto("1580587771525-78b9dba3b914"),
        foto("1627141234469-24711efb373c"),
        foto("1758801305015-d5d1bb9be1d2"),
        foto("1605774337664-7a846e9cdf17"),
      ],
      panorame: [
        { naziv: "Pre uređenja", slika: pano("small_empty_house"), slicica: panoSlicica("small_empty_house") },
        { naziv: "Dnevna soba", slika: pano("kiara_interior"), slicica: panoSlicica("kiara_interior") },
      ],
    },
    {
      id: "enterijer-stana",
      naslov: "Enterijer stana",
      lokacija: "Novi Sad",
      datum: "2022",
      naslovna: foto("1664711942326-2c3351e215e6", 1400),
      opis: "",
      slike: [
        foto("1664711942326-2c3351e215e6"),
        foto("1772475385350-d130ebe22bf5"),
        foto("1680210849951-34d1a56eb7aa"),
        foto("1552454799-ca5cfdc612c8"),
      ],
      panorame: [],
    },
  ],
};
