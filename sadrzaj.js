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
   - ENGLESKI: polje sa nastavkom _en je prevod polja iznad njega
     (npr. naslov_en je engleski naslov). Ako _en polje ne postoji,
     na engleskoj verziji sajta se prikazuje srpski tekst.
   ========================================================================== */

window.SKROZ = {

  /* ---------- OSNOVNO ---------- */
  ime: "skro.z",
  logo: "slike/logo.png",
  opisPocetna: "Eksterijer i enterijer, od prve ideje do realizacije na terenu.",
  opisPocetna_en: "Exteriors and interiors, from the first idea to completion on site.",

  /* ---------- SLAJDER NA POČETNOJ ----------
     Slike se same smenjuju. "rad" je id rada na koji vodi klik (nije obavezno). */
  slajderSekundi: 5,
  slajder: [
    { slika: "slike/radovi/vikendica-bezdan/naslovna.jpg", naslov: "Vikendica", rad: "vikendica-bezdan" },
    { slika: "slike/radovi/mi-amigo/naslovna.jpg", naslov: "Mi Amigo ZR", rad: "mi-amigo" },
    { slika: "slike/radovi/porodicna-kuca-karadjordjev-park/naslovna.jpg", naslov: "Porodična kuća 1", rad: "porodicna-kuca-karadjordjev-park" },
    { slika: "slike/radovi/garden-park/naslovna.jpg", naslov: "Garden Park", rad: "garden-park" },
    { slika: "slike/radovi/tobacco-shop/naslovna.jpg", naslov: "Tobacco Shop", rad: "tobacco-shop" },
    { slika: "slike/radovi/penthaus-stutgart/naslovna.jpg", naslov: "Štutgart Penthaus 160 m²", rad: "penthaus-stutgart" },
    { slika: "slike/radovi/porodicna-kuca-zrenjanin/naslovna.jpg", naslov: "Porodična kuća 2", rad: "porodicna-kuca-zrenjanin" },
    { slika: "slike/radovi/enterijer-4s/naslovna.jpg", naslov: "Enterijer 4S", rad: "enterijer-4s" },
    { slika: "slike/radovi/bmt-lux-invest/naslovna.jpg", naslov: "BMT Lux Invest", rad: "bmt-lux-invest" },
    { slika: "slike/radovi/ekogradnja/naslovna.jpg", naslov: "Ekogradnja", rad: "ekogradnja" },
    { slika: "slike/radovi/kulturna-ofanziva/naslovna.jpg", naslov: "Kulturna ofanziva: Plato KC Zrenjanin", rad: "kulturna-ofanziva" },
  ],

  /* ---------- USLUGE ---------- */
  usluge: {
    uvod: "Od prve ideje do realizacije na terenu, vodimo Vas kroz čitav proces jasno, precizno i bez nepotrebnih komplikacija.",
    uvod_en: "From the first idea to completion on site, we guide you through the entire process clearly, precisely and without unnecessary complications.",
    stavke: [
      {
        naslov: "Eksterijer",
        naslov_en: "Exterior",
        tekst: "3D vizuelizacija sa svim potrebnim detaljima za postojeće i novoprojektovane objekte: fasade, dvorišta, letnjikovce, ograde i uređenje prostora. Jasan uvid u materijale, boje i sve ključne elemente pre početka radova.",
        tekst_en: "Detailed 3D visualization for existing and newly designed buildings: facades, yards, gazebos, fences and landscaping. A clear view of the materials, colors and every key element before work begins.",
      },
      {
        naslov: "Enterijer",
        naslov_en: "Interior",
        tekst: "3D vizuelizacija sa svim potrebnim detaljima, uključujući raspored, izbor materijala, rasvetu i radioničke crteže nameštaja po meri za stanove, kuće i poslovne prostore.",
        tekst_en: "Detailed 3D visualization, including the layout, choice of materials, lighting and workshop drawings for custom-made furniture for apartments, houses and commercial spaces.",
      },
      {
        naslov: "Terenska koordinacija i priprema",
        naslov_en: "On-site coordination and preparation",
        tekst: "Izrada preciznih dimenzija i tehničkih specifikacija za majstore, uz podršku i konsultacije na terenu kako bi se zamisao u potpunosti prenela u realnost.",
        tekst_en: "Precise dimensions and technical specifications for contractors, with on-site support and consultation so that the design is carried over into reality in full.",
      },
      {
        naslov: "Projekti za nove objekte",
        naslov_en: "Designs for new buildings",
        tekst: "Planiranje i razrada idejnih koncepata. Za potrebe dobijanja građevinske dozvole i izrade zvanične projektne dokumentacije, sarađujemo sa licenciranim partnerima i mrežom projektanata u zavisnosti od namene i lokacije objekta.",
        tekst_en: "Planning and development of concept designs. For building permits and official project documentation, we work with licensed partners and a network of designers, depending on the purpose and location of the building.",
      },
    ],
  },

  /* ---------- O MENI ---------- */
  oMeni: {
    slika: "slike/o-meni.jpg",
    istaknuto: "Verujem da dobar projekat počinje razgovorom, kroz koji zajedno definišemo Vašu viziju, želje i realne mogućnosti prostora.",
    istaknuto_en: "I believe a good project starts with a conversation, one in which we define your vision, your wishes and the real possibilities of the space together.",
    tekst: [
      "Mi spajamo 3D vizuelizaciju i izvođačku praksu u kreiranju Vašeg prostora. Svakom projektu se pristupa individualno, uz potpunu posvećenost funkcionalnosti, estetici i izvodljivosti u praksi. Projekat se vodi od prve ideje do završnih detalja, sa jasnim ciljem da dobijete rešenje koje je i lepo i ostvarivo na terenu.",
      "Prednost dajemo jednostavnim rešenjima, funkcionalnosti i kvalitetnim materijalima. Umesto prolaznih trendova, fokus je na vanvremenskom dizajnu i kreiranju prostora koji uspešno spaja estetsku vrednost, trajnost i svakodnevnu praktičnost.",
    ],
    tekst_en: [
      "We combine 3D visualization with hands-on construction experience to create your space. Every project is approached individually, with full commitment to function, aesthetics and buildability. Each project is carried from the first idea to the final details, with one clear goal: a solution that is both beautiful and achievable on site.",
      "We favor simple solutions, functionality and quality materials. Instead of passing trends, the focus is on timeless design and on creating spaces that successfully combine aesthetic value, durability and everyday practicality.",
    ],
  },

  /* ---------- KONTAKT ----------
     Ako nešto ne želite da prikažete, ostavite prazne navodnike: "" */
  kontakt: {
    naslov: "Hajde da napravimo nešto zajedno",
    naslov_en: "Let's create something together",
    tekst: "Pozovite ili pošaljite poruku.",
    tekst_en: "Call or send us a message.",
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
     ..._en     : engleska verzija (naslov_en, opis_en, lokacija_en)
     slike      : sve slike koje se vide kad se otvori rad
     panorame   : 360° slike (2:1, npr. 6144x3072 px). Može i prazno: []
     preIPosle  : (nije obavezno) dve slike za poređenje „pre“ i „posle“    */
  radovi: [
    {
      id: "vikendica-bezdan",
      naslov: "Vikendica",
      naslov_en: "Weekend House",
      lokacija: "Bezdan, Baračka",
      datum: "2026",
      naslovna: "slike/radovi/vikendica-bezdan/naslovna.jpg",
      opis: [
        "Projektovanje i vizuelizacija vikendice od 115 m² smeštene u prirodnom okruženju pored vode.",
        "Akcenat je stavljen na maksimalnu povezanost unutrašnjeg prostora sa prirodnim ambijentom reke, uz primenu funkcionalnih rešenja i materijala koji obezbeđuju dugotrajnost, udobnost i vanvremenski izgled objekta za odmor.",
      ],
      opis_en: [
        "Design and visualization of a 115 m² weekend house set in a natural environment by the water.",
        "The emphasis was on connecting the interior as closely as possible with the natural setting of the river, using functional solutions and materials that ensure durability, comfort and a timeless look for a holiday home.",
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
      naslov_en: "Mi Amigo ZR",
      lokacija: "Zrenjanin, Vojvode Petra Bojovića 17",
      datum: "2026",
      naslovna: "slike/radovi/mi-amigo/naslovna.jpg",
      opis: [
        "Idejno rešenje i vizuelna razrada enterijera ugostiteljskog prostora.",
        "Koncept spaja tradiciju domaće kuhinje sa modernim organizacionim zahtevima, pruživši topao i vizuelno upečatljiv prostor u kom se spajaju praktična izvedba, optimalna iskorišćenost kvadrature i udobnost za posetioce.",
      ],
      opis_en: [
        "Concept design and visual development of a restaurant interior.",
        "The concept combines the tradition of home-style cooking with modern operational requirements, creating a warm and visually striking space that brings together practical execution, optimal use of the floor area and comfort for guests.",
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
      naslov_en: "Family House 1",
      lokacija: "Zrenjanin, Karađorđev Park",
      datum: "2025",
      naslovna: "slike/radovi/porodicna-kuca-karadjordjev-park/naslovna.jpg",
      opis: [
        "Zadatak je obuhvatio 3D razradu objekta i ključnih elemenata fasade, unutrašnje uređenje enterijera i projektovanje spoljašnjeg prostora.",
        "Centralni element eksterijera predstavlja unikatno projektovana ograda sa vertikalnim šipkama, osmišljena da obezbedi apsolutnu privatnost doma, a da pritom zadrži vizuelnu prozračnost i savremen izgled.",
      ],
      opis_en: [
        "The assignment covered the 3D development of the building and the key facade elements, the interior design and the design of the outdoor space.",
        "The centerpiece of the exterior is a custom-designed fence with vertical bars, created to give the home complete privacy while keeping a sense of visual openness and a contemporary look.",
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
      naslov_en: "Garden Park",
      lokacija: "Zrenjanin",
      datum: "2025",
      naslovna: "slike/radovi/garden-park/naslovna.jpg",
      opis: [
        "Kreiranje 3D vizuelizacije stambeno-poslovnog kompleksa, integrisane sa snimcima iz vazduha.",
        "Cilj je bio da se na verodostojan i vizuelno upečatljiv način predstavi arhitektonsko rešenje, uklapanje u lokaciju i ukupni potencijal i izgled objekta.",
      ],
      opis_en: [
        "3D visualization of a residential and commercial complex, integrated with aerial footage.",
        "The goal was to present the architectural design, how it fits into the site, and the overall potential and appearance of the building in a credible and visually striking way.",
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
      naslov_en: "Tobacco Shop",
      lokacija: "Zrenjanin",
      datum: "2025",
      naslovna: "slike/radovi/tobacco-shop/naslovna.jpg",
      opis: [
        "Od vizije do izvođačkih detalja.",
        "Ovaj enterijer je projektovan sa naglaskom na modularnost i sistem polica i nameštaja po meri koji se savršeno uklapaju u svaki prostor.",
      ],
      opis_en: [
        "From vision to construction details.",
        "This interior was designed with an emphasis on modularity and a system of custom-made shelving and furniture that fits perfectly into any space.",
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
      id: "penthaus-stutgart",
      naslov: "Štutgart Penthaus 160 m²",
      naslov_en: "Stuttgart Penthouse 160 m²",
      lokacija: "Štutgart",
      lokacija_en: "Stuttgart",
      datum: "2024",
      naslovna: "slike/radovi/penthaus-stutgart/naslovna.jpg",
      opis: [
        "Penthaus površine 160 m², koncipiran kao spoj minimalizma, luksuza i visoke funkcionalnosti.",
        "Otvoreni koncept tlocrta i vizuelna povezanost sa panoramskim pogledom na zelene padine Štutgarta dodatno naglašavaju osećaj prostranosti i jedinstven kontakt sa prirodom.",
        "Prostor odlikuju prirodni materijali, neutralni tonovi, svedeni elegantni detalji i pažljivo planirano ambijentalno osvetljenje koje kreira atmosferu topline i udobnosti.",
      ],
      opis_en: [
        "A 160 m² penthouse conceived as a blend of minimalism, luxury and high functionality.",
        "The open-plan layout and the visual connection with panoramic views of Stuttgart's green hillsides further emphasize the sense of space and a unique contact with nature.",
        "The space is defined by natural materials, neutral tones, refined and elegant details, and carefully planned ambient lighting that creates an atmosphere of warmth and comfort.",
      ],
      slike: [
        "slike/radovi/penthaus-stutgart/01.jpg",
        "slike/radovi/penthaus-stutgart/02.jpg",
        "slike/radovi/penthaus-stutgart/03.jpg",
        "slike/radovi/penthaus-stutgart/04.jpg",
        "slike/radovi/penthaus-stutgart/05.jpg",
        "slike/radovi/penthaus-stutgart/06.jpg",
        "slike/radovi/penthaus-stutgart/07.jpg",
        "slike/radovi/penthaus-stutgart/08.jpg",
        "slike/radovi/penthaus-stutgart/09.jpg",
        "slike/radovi/penthaus-stutgart/10.jpg",
        "slike/radovi/penthaus-stutgart/11.jpg",
        "slike/radovi/penthaus-stutgart/12.jpg",
        "slike/radovi/penthaus-stutgart/13.jpg",
        "slike/radovi/penthaus-stutgart/14.jpg",
        "slike/radovi/penthaus-stutgart/15.jpg",
        "slike/radovi/penthaus-stutgart/16.jpg",
        "slike/radovi/penthaus-stutgart/17.jpg",
      ],
      panorame: [],
    },
    {
      id: "porodicna-kuca-zrenjanin",
      naslov: "Porodična kuća 2",
      naslov_en: "Family House 2",
      lokacija: "Zrenjanin",
      datum: "2024",
      naslovna: "slike/radovi/porodicna-kuca-zrenjanin/naslovna.jpg",
      opis: [
        "Projektni zadatak obuhvatio je dogradnju i kompletnu transformaciju postojećeg objekta u moderan porodični dom.",
        "Akcenat je stavljen na maksimalnu iskorišćenost postojećih kapaciteta kuće i njeno funkcionalno proširenje, pri čemu su objekat, nova fasada i spoljašnja ograda oblikovani u jednu savremeno povezanu celinu.",
      ],
      opis_en: [
        "The project brief covered the extension and complete transformation of an existing building into a modern family home.",
        "The emphasis was on making the most of the house's existing capacity and expanding it functionally, with the building, the new facade and the outdoor fence shaped into a single, contemporary whole.",
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
      id: "enterijer-4s",
      naslov: "Enterijer 4S",
      naslov_en: "Interior 4S",
      lokacija: "Zrenjanin",
      datum: "2024",
      naslovna: "slike/radovi/enterijer-4s/naslovna.jpg",
      opis: [
        "Idejno rešenje i kompletna razrada enterijera četvorosobnog stana, koncipiranog sa svetlim tonovima i elementima u kašmir boji u kombinaciji sa toplim dekorom drveta koji prostoru daje dozu suptilnog luksuza.",
        "Poseban vizuelni pečat projektu daje pažljivo birana dizajnerska rasveta brenda Maytoni, koja kroz ambijentalne slojeve svetla naglašava teksture materijala i stvara topao, sofisticiran dom.",
      ],
      opis_en: [
        "Concept design and complete interior development of a four-room apartment, designed in light tones with cashmere-colored elements combined with warm wood décor that gives the space a touch of subtle luxury.",
        "A distinctive visual signature comes from carefully selected designer lighting by Maytoni, which uses layers of ambient light to highlight the textures of the materials and create a warm, sophisticated home.",
      ],
      slike: [
        "slike/radovi/enterijer-4s/01.jpg",
        "slike/radovi/enterijer-4s/02.jpg",
        "slike/radovi/enterijer-4s/03.jpg",
        "slike/radovi/enterijer-4s/04.jpg",
        "slike/radovi/enterijer-4s/05.jpg",
        "slike/radovi/enterijer-4s/06.jpg",
        "slike/radovi/enterijer-4s/07.jpg",
        "slike/radovi/enterijer-4s/08.jpg",
        "slike/radovi/enterijer-4s/09.jpg",
        "slike/radovi/enterijer-4s/10.jpg",
        "slike/radovi/enterijer-4s/11.jpg",
        "slike/radovi/enterijer-4s/12.jpg",
        "slike/radovi/enterijer-4s/13.jpg",
        "slike/radovi/enterijer-4s/14.jpg",
        "slike/radovi/enterijer-4s/15.jpg",
        "slike/radovi/enterijer-4s/16.jpg",
      ],
      panorame: [],
    },
    {
      id: "bmt-lux-invest",
      naslov: "BMT Lux Invest",
      naslov_en: "BMT Lux Invest",
      lokacija: "Zrenjanin, Milana Stanivukovića",
      datum: "2024",
      naslovna: "slike/radovi/bmt-lux-invest/naslovna.jpg",
      opis: [
        "Učešće u projektovanju i razradi stambeno-poslovnog kompleksa ukupne površine 11.453 m².",
        "Poseban akcenat u radu bio je posvećen razradi fasadnih sklopova i detalja, sa ciljem da se postigne savremen vizuelni identitet objekta, visoka energetska efikasnost i dugotrajnost, uz usklađivanje složenih zahteva višenamenskog prostora.",
      ],
      opis_en: [
        "Participation in the design and development of a residential and commercial complex with a total floor area of 11,453 m².",
        "Particular emphasis was placed on developing the facade assemblies and details, aiming for a contemporary visual identity, high energy efficiency and durability, while reconciling the complex requirements of a mixed-use building.",
      ],
      slike: [
        "slike/radovi/bmt-lux-invest/01.jpg",
        "slike/radovi/bmt-lux-invest/02.jpg",
        "slike/radovi/bmt-lux-invest/03.jpg",
        "slike/radovi/bmt-lux-invest/04.jpg",
        "slike/radovi/bmt-lux-invest/05.jpg",
      ],
      panorame: [],
    },
    {
      id: "ekogradnja",
      naslov: "Ekogradnja",
      naslov_en: "Ekogradnja",
      lokacija: "Zrenjanin",
      datum: "2022",
      naslovna: "slike/radovi/ekogradnja/naslovna.jpg",
      opis: [
        "Projektovanje i razrada glavnog kancelarijskog prostora i ulazne ograde kompleksa.",
        "Rezultat je funkcionalan enterijer i upečatljiv eksterijer koji ostvaruju direktnu vizuelnu povezanost prostora u kojem se posluje sa materijalima sa kojima se gradi.",
      ],
      opis_en: [
        "Design and development of the main office space and the entrance fence of the complex.",
        "The result is a functional interior and a striking exterior that create a direct visual connection between the space where business is done and the materials used to build.",
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
    {
      id: "kulturna-ofanziva",
      naslov: "Kulturna ofanziva: Plato KC Zrenjanin",
      naslov_en: "Kulturna Ofanziva: Cultural Center Plaza, Zrenjanin",
      lokacija: "Zrenjanin",
      datum: "2019",
      naslovna: "slike/radovi/kulturna-ofanziva/naslovna.jpg",
      opis: [
        "Transformacija javnog prostora ispred Kulturnog centra u Zrenjaninu u višenamensku scenu na otvorenom.",
        "Koncept spaja inkluzivnost i urbani dizajn: nova rampa za osobe sa invaliditetom oblikovana je kao izdignuta bina, dok je ostatak platoa rešen kroz savremeni mobilijar za sedenje.",
        "Poseban segment predstavlja kompletna 3D rekonstrukcija eksterijera objekta, izrađena prema originalnom projektu iz 1974. godine. Projekat je realizovan u saradnji sa stručnim timom „Kulturna ofanziva“.",
      ],
      opis_en: [
        "Transformation of the public space in front of the Cultural Center in Zrenjanin into a multipurpose open-air stage.",
        "The concept combines inclusivity and urban design: a new ramp for people with disabilities is shaped as a raised stage, while the rest of the plaza is furnished with contemporary seating.",
        "A special part of the project is a complete 3D reconstruction of the building's exterior, based on the original design from 1974. The project was carried out in collaboration with the expert team of “Kulturna ofanziva”.",
      ],
      slike: [
        "slike/radovi/kulturna-ofanziva/01.jpg",
        "slike/radovi/kulturna-ofanziva/02.jpg",
        "slike/radovi/kulturna-ofanziva/03.jpg",
        "slike/radovi/kulturna-ofanziva/04.jpg",
        "slike/radovi/kulturna-ofanziva/05.jpg",
        "slike/radovi/kulturna-ofanziva/06.jpg",
        "slike/radovi/kulturna-ofanziva/07.jpg",
        "slike/radovi/kulturna-ofanziva/08.jpg",
        "slike/radovi/kulturna-ofanziva/09.jpg",
        "slike/radovi/kulturna-ofanziva/10.jpg",
        "slike/radovi/kulturna-ofanziva/11.jpg",
      ],
      panorame: [],
    },
  ],
};
