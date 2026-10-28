/* ==========================================================================
   SADRŽAJ SAJTA: skro.z
   --------------------------------------------------------------------------
   Ovo je JEDINI fajl koji treba menjati da biste promenili tekstove,
   slike i radove na sajtu. Detaljno uputstvo je u fajlu UPUTSTVO.md.

   Pravila:
   - Tekst uvek ide između navodnika: "ovako".
   - Posle svake stavke ide zarez.
   - Slike stavljate u folder  slike/  i ovde upisujete putanju,
     npr. "slike/radovi/vikendica-bezdan/01.jpg".
   ========================================================================== */

window.SKROZ = {

  /* ---------- OSNOVNO ---------- */
  ime: "skro.z",
  logo: "slike/logo.png",
  opisPocetna: "Eksterijer i enterijer, od prve ideje do realizacije na terenu.",

  /* ---------- SLAJDER NA POČETNOJ ----------
     Slike se same smenjuju. "rad" je id rada na koji vodi klik (nije obavezno). */
  slajderSekundi: 5,
  slajder: [
    { slika: "slike/radovi/vikendica-bezdan/naslovna.jpg", naslov: "Vikendica", rad: "vikendica-bezdan" },
    { slika: "slike/radovi/mi-amigo/naslovna.jpg", naslov: "Mi Amigo ZR", rad: "mi-amigo" },
    { slika: "slike/radovi/porodicna-kuca-karadjordjev-park/naslovna.jpg", naslov: "Porodična kuća 1", rad: "porodicna-kuca-karadjordjev-park" },
    { slika: "slike/radovi/garden-park/naslovna.jpg", naslov: "Garden Park", rad: "garden-park" },
    { slika: "slike/radovi/tobacco-shop/naslovna.jpg", naslov: "Tobacco Shop", rad: "tobacco-shop" },
    { slika: "slike/radovi/porodicna-kuca-zrenjanin/naslovna.jpg", naslov: "Porodična kuća 2", rad: "porodicna-kuca-zrenjanin" },
    { slika: "slike/radovi/ekogradnja/naslovna.jpg", naslov: "Ekogradnja", rad: "ekogradnja" },
  ],

  /* ---------- USLUGE ---------- */
  usluge: {
    uvod: "Od prve ideje do realizacije na terenu, vodimo Vas kroz čitav proces jasno, precizno i bez nepotrebnih komplikacija.",
    stavke: [
      { naslov: "Eksterijer", tekst: "3D vizuelizacija sa svim potrebnim detaljima za postojeće i novoprojektovane objekte: fasade, dvorišta, letnjikovce, ograde i uređenje prostora. Jasan uvid u materijale, boje i sve ključne elemente pre početka radova." },
      { naslov: "Enterijer", tekst: "3D vizuelizacija sa svim potrebnim detaljima, uključujući raspored, izbor materijala, rasvetu i radioničke crteže nameštaja po meri za stanove, kuće i poslovne prostore." },
      { naslov: "Terenska koordinacija i priprema", tekst: "Izrada preciznih dimenzija i tehničkih specifikacija za majstore, uz podršku i konsultacije na terenu kako bi se zamisao u potpunosti prenela u realnost." },
      { naslov: "Projekti za nove objekte", tekst: "Planiranje i razrada idejnih koncepata. Za potrebe dobijanja građevinske dozvole i izrade zvanične projektne dokumentacije, sarađujemo sa licenciranim partnerima i mrežom projektanata u zavisnosti od namene i lokacije objekta." },
    ],
  },

  /* ---------- O MENI ---------- */
  oMeni: {
    slika: "slike/o-meni.jpg",
    istaknuto: "Verujem da dobar projekat počinje razgovorom, kroz koji zajedno definišemo Vašu viziju, želje i realne mogućnosti prostora.",
    tekst: [
      "Mi spajamo 3D vizuelizaciju i izvođačku praksu u kreiranju Vašeg prostora. Svakom projektu se pristupa individualno, uz potpunu posvećenost funkcionalnosti, estetici i izvodljivosti u praksi. Projekat se vodi od prve ideje do završnih detalja, sa jasnim ciljem da dobijete rešenje koje je i lepo i ostvarivo na terenu.",
      "Prednost dajemo jednostavnim rešenjima, funkcionalnosti i kvalitetnim materijalima. Umesto prolaznih trendova, fokus je na vanvremenskom dizajnu i kreiranju prostora koji uspešno spaja estetsku vrednost, trajnost i svakodnevnu praktičnost.",
    ],
  },

  /* ---------- KONTAKT ----------
     Ako nešto ne želite da prikažete, ostavite prazne navodnike: "" */
  kontakt: {
    naslov: "Hajde da napravimo nešto zajedno",
    tekst: "Pozovite ili pošaljite poruku.",
    telefon: "+381 69 365 0705",
    email: "skrofanovzoran@hotmail.com",
    adresa: "",
    instagram: "https://www.instagram.com/_skro.z/",
    instagramIme: "@_skro.z",
  },

  /* ---------- PODACI FIRME (prikazuju se u kontaktu) ---------- */
  firma: {
    naziv: "Zoran Skrofanov PR Razrada građevinskih projekata SKRO.Z Novi Bečej",
    pib: "114694441",
    mb: "67781902",
  },

  /* ---------- RADOVI ----------
     Svaki rad je jedan blok između { }. Da dodate novi rad, kopirajte ceo
     blok, promenite podatke i pazite da "id" bude jedinstven (bez razmaka
     i bez naših slova, npr. "kuca-novi-sad").

     naslovna   : slika koja se vidi na početnoj i na vrhu stranice rada
     opis       : tekst na stranici rada (svaki pasus u svojim navodnicima)
     slike      : sve slike koje se vide kad se otvori rad
     panorame   : 360° slike (2:1, npr. 6144x3072 px). Može i prazno: []
     preIPosle  : (nije obavezno) dve slike za poređenje „pre“ i „posle“    */
  radovi: [
    {
      id: "vikendica-bezdan",
      naslov: "Vikendica",
      lokacija: "Bezdan, Baračka",
      datum: "2026",
      naslovna: "slike/radovi/vikendica-bezdan/naslovna.jpg",
      opis: [
        "Projektovanje i vizuelizacija vikendice od 115 m² smeštene u prirodnom okruženju pored vode.",
        "Akcenat je stavljen na maksimalnu povezanost unutrašnjeg prostora sa prirodnim ambijentom reke, uz primenu funkcionalnih rešenja i materijala koji obezbeđuju dugotrajnost, udobnost i vanvremenski izgled objekta za odmor.",
      ],
      slike: [
        "slike/radovi/vikendica-bezdan/01.jpg",
        "slike/radovi/vikendica-bezdan/02.jpg",
        "slike/radovi/vikendica-bezdan/03.jpg",
        "slike/radovi/vikendica-bezdan/04.jpg",
        "slike/radovi/vikendica-bezdan/05.jpg",
        "slike/radovi/vikendica-bezdan/06.jpg",
        "slike/radovi/vikendica-bezdan/07.jpg",
        "slike/radovi/vikendica-bezdan/08.jpg",
        "slike/radovi/vikendica-bezdan/09.jpg",
        "slike/radovi/vikendica-bezdan/10.jpg",
      ],
      panorame: [
        { naziv: "Pogled 1", slika: "slike/radovi/vikendica-bezdan/panorame/01.jpg", slicica: "slike/radovi/vikendica-bezdan/panorame/01-mala.jpg" },
        { naziv: "Pogled 2", slika: "slike/radovi/vikendica-bezdan/panorame/02.jpg", slicica: "slike/radovi/vikendica-bezdan/panorame/02-mala.jpg" },
        { naziv: "Pogled 3", slika: "slike/radovi/vikendica-bezdan/panorame/03.jpg", slicica: "slike/radovi/vikendica-bezdan/panorame/03-mala.jpg" },
        { naziv: "Pogled 4", slika: "slike/radovi/vikendica-bezdan/panorame/04.jpg", slicica: "slike/radovi/vikendica-bezdan/panorame/04-mala.jpg" },
        { naziv: "Pogled 5", slika: "slike/radovi/vikendica-bezdan/panorame/05.jpg", slicica: "slike/radovi/vikendica-bezdan/panorame/05-mala.jpg" },
        { naziv: "Pogled 6", slika: "slike/radovi/vikendica-bezdan/panorame/06.jpg", slicica: "slike/radovi/vikendica-bezdan/panorame/06-mala.jpg" },
        { naziv: "Pogled 7", slika: "slike/radovi/vikendica-bezdan/panorame/07.jpg", slicica: "slike/radovi/vikendica-bezdan/panorame/07-mala.jpg" },
        { naziv: "Pogled 8", slika: "slike/radovi/vikendica-bezdan/panorame/08.jpg", slicica: "slike/radovi/vikendica-bezdan/panorame/08-mala.jpg" },
        { naziv: "Pogled 9", slika: "slike/radovi/vikendica-bezdan/panorame/09.jpg", slicica: "slike/radovi/vikendica-bezdan/panorame/09-mala.jpg" },
        { naziv: "Pogled 10", slika: "slike/radovi/vikendica-bezdan/panorame/10.jpg", slicica: "slike/radovi/vikendica-bezdan/panorame/10-mala.jpg" },
      ],
    },
    {
      id: "mi-amigo",
      naslov: "Mi Amigo ZR",
      lokacija: "Zrenjanin, Vojvode Petra Bojovića 17",
      datum: "2026",
      naslovna: "slike/radovi/mi-amigo/naslovna.jpg",
      opis: [
        "Idejno rešenje i vizuelna razrada enterijera ugostiteljskog prostora.",
        "Koncept spaja tradiciju domaće kuhinje sa modernim organizacionim zahtevima, pruživši topao i vizuelno upečatljiv prostor u kom se spajaju praktična izvedba, optimalna iskorišćenost kvadrature i udobnost za posetioce.",
      ],
      slike: [
        "slike/radovi/mi-amigo/01.jpg",
        "slike/radovi/mi-amigo/02.jpg",
        "slike/radovi/mi-amigo/03.jpg",
        "slike/radovi/mi-amigo/04.jpg",
      ],
      panorame: [
        { naziv: "Pogled 1", slika: "slike/radovi/mi-amigo/panorame/01.jpg", slicica: "slike/radovi/mi-amigo/panorame/01-mala.jpg" },
        { naziv: "Pogled 2", slika: "slike/radovi/mi-amigo/panorame/02.jpg", slicica: "slike/radovi/mi-amigo/panorame/02-mala.jpg" },
        { naziv: "Pogled 3", slika: "slike/radovi/mi-amigo/panorame/03.jpg", slicica: "slike/radovi/mi-amigo/panorame/03-mala.jpg" },
        { naziv: "Pogled 4", slika: "slike/radovi/mi-amigo/panorame/04.jpg", slicica: "slike/radovi/mi-amigo/panorame/04-mala.jpg" },
        { naziv: "Pogled 5", slika: "slike/radovi/mi-amigo/panorame/05.jpg", slicica: "slike/radovi/mi-amigo/panorame/05-mala.jpg" },
      ],
    },
    {
      id: "porodicna-kuca-karadjordjev-park",
      naslov: "Porodična kuća 1",
      lokacija: "Zrenjanin, Karađorđev Park",
      datum: "2025",
      naslovna: "slike/radovi/porodicna-kuca-karadjordjev-park/naslovna.jpg",
      opis: [
        "Zadatak je obuhvatio 3D razradu objekta i ključnih elemenata fasade, unutrašnje uređenje enterijera i projektovanje spoljašnjeg prostora.",
        "Centralni element eksterijera predstavlja unikatno projektovana ograda sa vertikalnim šipkama, osmišljena da obezbedi apsolutnu privatnost doma, a da pritom zadrži vizuelnu prozračnost i savremen izgled.",
      ],
      slike: [
        "slike/radovi/porodicna-kuca-karadjordjev-park/01.jpg",
        "slike/radovi/porodicna-kuca-karadjordjev-park/02.jpg",
        "slike/radovi/porodicna-kuca-karadjordjev-park/03.jpg",
        "slike/radovi/porodicna-kuca-karadjordjev-park/04.jpg",
        "slike/radovi/porodicna-kuca-karadjordjev-park/05.jpg",
        "slike/radovi/porodicna-kuca-karadjordjev-park/06.jpg",
        "slike/radovi/porodicna-kuca-karadjordjev-park/07.jpg",
        "slike/radovi/porodicna-kuca-karadjordjev-park/08.jpg",
      ],
      panorame: [],
    },
    {
      id: "garden-park",
      naslov: "Garden Park",
      lokacija: "Zrenjanin",
      datum: "2025",
      naslovna: "slike/radovi/garden-park/naslovna.jpg",
      opis: [
        "Kreiranje 3D vizuelizacije stambeno-poslovnog kompleksa, integrisane sa snimcima iz vazduha.",
        "Cilj je bio da se na verodostojan i vizuelno upečatljiv način predstavi arhitektonsko rešenje, uklapanje u lokaciju i ukupni potencijal i izgled objekta.",
      ],
      slike: [
        "slike/radovi/garden-park/01.jpg",
        "slike/radovi/garden-park/02.jpg",
        "slike/radovi/garden-park/03.jpg",
        "slike/radovi/garden-park/04.jpg",
        "slike/radovi/garden-park/05.jpg",
        "slike/radovi/garden-park/06.jpg",
      ],
      panorame: [],
    },
    {
      id: "tobacco-shop",
      naslov: "Tobacco Shop",
      lokacija: "Zrenjanin",
      datum: "2025",
      naslovna: "slike/radovi/tobacco-shop/naslovna.jpg",
      opis: [
        "Od vizije do izvođačkih detalja.",
        "Ovaj enterijer je projektovan sa naglaskom na modularnost i sistem polica i nameštaja po meri koji se savršeno uklapaju u svaki prostor.",
      ],
      slike: [
        "slike/radovi/tobacco-shop/01.jpg",
        "slike/radovi/tobacco-shop/02.jpg",
        "slike/radovi/tobacco-shop/03.jpg",
        "slike/radovi/tobacco-shop/04.jpg",
        "slike/radovi/tobacco-shop/05.jpg",
        "slike/radovi/tobacco-shop/06.jpg",
      ],
      panorame: [
        { naziv: "Pogled 1", slika: "slike/radovi/tobacco-shop/panorame/01.jpg", slicica: "slike/radovi/tobacco-shop/panorame/01-mala.jpg" },
        { naziv: "Pogled 2", slika: "slike/radovi/tobacco-shop/panorame/02.jpg", slicica: "slike/radovi/tobacco-shop/panorame/02-mala.jpg" },
      ],
    },
    {
      id: "porodicna-kuca-zrenjanin",
      naslov: "Porodična kuća 2",
      lokacija: "Zrenjanin",
      datum: "2024",
      naslovna: "slike/radovi/porodicna-kuca-zrenjanin/naslovna.jpg",
      opis: [
        "Projektni zadatak obuhvatio je dogradnju i kompletnu transformaciju postojećeg objekta u moderan porodični dom.",
        "Akcenat je stavljen na maksimalnu iskorišćenost postojećih kapaciteta kuće i njeno funkcionalno proširenje, pri čemu su objekat, nova fasada i spoljašnja ograda oblikovani u jednu savremeno povezanu celinu.",
      ],
      preIPosle: { pre: "slike/radovi/porodicna-kuca-zrenjanin/pre.jpg", posle: "slike/radovi/porodicna-kuca-zrenjanin/posle.jpg" },
      slike: [
        "slike/radovi/porodicna-kuca-zrenjanin/01.jpg",
        "slike/radovi/porodicna-kuca-zrenjanin/02.jpg",
        "slike/radovi/porodicna-kuca-zrenjanin/03.jpg",
        "slike/radovi/porodicna-kuca-zrenjanin/04.jpg",
        "slike/radovi/porodicna-kuca-zrenjanin/05.jpg",
      ],
      panorame: [],
    },
    {
      id: "ekogradnja",
      naslov: "Ekogradnja",
      lokacija: "Zrenjanin",
      datum: "2022",
      naslovna: "slike/radovi/ekogradnja/naslovna.jpg",
      opis: [
        "Projektovanje i razrada glavnog kancelarijskog prostora i ulazne ograde kompleksa.",
        "Rezultat je funkcionalan enterijer i upečatljiv eksterijer koji ostvaruju direktnu vizuelnu povezanost prostora u kojem se posluje sa materijalima sa kojima se gradi.",
      ],
      slike: [
        "slike/radovi/ekogradnja/01.jpg",
        "slike/radovi/ekogradnja/02.jpg",
        "slike/radovi/ekogradnja/03.jpg",
        "slike/radovi/ekogradnja/04.jpg",
        "slike/radovi/ekogradnja/05.jpg",
        "slike/radovi/ekogradnja/06.jpg",
      ],
      panorame: [
        { naziv: "Pogled 1", slika: "slike/radovi/ekogradnja/panorame/01.jpg", slicica: "slike/radovi/ekogradnja/panorame/01-mala.jpg" },
        { naziv: "Pogled 2", slika: "slike/radovi/ekogradnja/panorame/02.jpg", slicica: "slike/radovi/ekogradnja/panorame/02-mala.jpg" },
        { naziv: "Pogled 3", slika: "slike/radovi/ekogradnja/panorame/03.jpg", slicica: "slike/radovi/ekogradnja/panorame/03-mala.jpg" },
      ],
    },
  ],
};
