/* ==========================================================================
   skro.z: jezik sajta (srpski / engleski)
   Natpisi sajta (meni, dugmad, naslovi sekcija) su ovde.
   Tekstovi projekata, usluga itd. su u sadrzaj.js (polja sa nastavkom _en).
   ========================================================================== */
(() => {
  const RECNIK = {
    "meni.radovi": ["Radovi", "Projects"],
    "meni.usluge": ["Usluge", "Services"],
    "meni.oMeni": ["O meni", "About"],
    "meni.kontakt": ["Kontakt", "Contact"],
    "meni.dugme": ["Meni", "Menu"],
    "meni.zatvori": ["Zatvori", "Close"],
    "meni.glavni": ["Glavni meni", "Main menu"],
    "meni.mob": ["Meni", "Menu"],
    "logo.pocetna": ["skro.z, početna", "skro.z, home"],
    "jezik.izbor": ["Jezik", "Language"],
    "hero.aria": ["Izdvojeni radovi", "Featured projects"],
    "hero.skroluj": ["Skroluj", "Scroll"],
    "hero.slika": ["Slika", "Image"],
    "radovi.oznaka": ["Izabrani projekti", "Selected projects"],
    "radovi.naslov": ["Radovi", "Projects"],
    "radovi.uvod": ["Kliknite na projekat da vidite sve fotografije i 360° pogled.", "Click a project to see all photos and the 360° view."],
    "radovi.pogledaj": ["Pogledaj", "View"],
    "usluge.oznaka": ["Šta radimo", "What we do"],
    "usluge.naslov": ["Usluge", "Services"],
    "oMeni.oznaka": ["O meni", "About"],
    "kontakt.oznaka": ["Kontakt", "Contact"],
    "kontakt.telefon": ["Telefon", "Phone"],
    "kontakt.email": ["Email", "Email"],
    "kontakt.studio": ["Studio", "Studio"],
    "firma.pib": ["PIB", "Tax ID"],
    "firma.mb": ["MB", "Company ID"],
    "podnozje.naVrh": ["Na vrh ↑", "Back to top ↑"],
    "rad.sviRadovi": ["Svi radovi", "All projects"],
    "rad.lokacija": ["Lokacija", "Location"],
    "rad.datum": ["Datum", "Year"],
    "rad.opis": ["Opis", "Description"],
    "rad.transformacija": ["Transformacija", "Transformation"],
    "rad.preIPosle": ["Pre i posle", "Before and after"],
    "rad.preIPosleUvod": ["Pomerajte liniju levo-desno da uporedite.", "Drag the line left and right to compare."],
    "rad.pre": ["Pre", "Before"],
    "rad.posle": ["Posle", "After"],
    "rad.poredjenje": ["Poređenje: pre i posle", "Comparison: before and after"],
    "rad.galerija": ["Galerija", "Gallery"],
    "rad.fotografije": ["Fotografije", "Photos"],
    "rad.galerijaUvod": ["Kliknite na sliku da je uvećate.", "Click an image to enlarge it."],
    "rad.uvecaj": ["Uvećaj sliku", "Enlarge image"],
    "rad.slika": ["slika", "image"],
    "rad.panoOznaka": ["360° pogled", "360° view"],
    "rad.panoNaslov": ["Prošetajte kroz prostor", "Walk through the space"],
    "rad.panoUvod": ["Prevucite mišem ili prstom da se okrenete.", "Drag with your mouse or finger to look around."],
    "rad.panoSobe": ["Ispod izaberite pogled.", "Choose a view below."],
    "rad.panoSavet": ["Prevucite da pogledate okolo", "Drag to look around"],
    "rad.prostorije": ["Pogledi", "Views"],
    "rad.pogled": ["Pogled", "View"],
    "rad.sledeci": ["Sledeći rad", "Next project"],
    "rad.nijePronadjen": ["Rad nije pronađen", "Project not found"],
    "rad.greska": ["Greška", "Error"],
    "rad.sviRadoviLink": ["Pogledajte sve radove", "See all projects"],
    "lightbox.aria": ["Uvećana slika", "Enlarged image"],
    "lightbox.zatvori": ["Zatvori", "Close"],
    "lightbox.prethodna": ["Prethodna slika", "Previous image"],
    "lightbox.sledeca": ["Sledeća slika", "Next image"],
    "meta.opisPocetna": [
      "skro.z: 3D vizuelizacija eksterijera i enterijera, terenska koordinacija i projekti za nove objekte. Novi Bečej, Zrenjanin.",
      "skro.z: 3D visualization of exteriors and interiors, on-site coordination and designs for new buildings. Novi Bečej, Zrenjanin, Serbia.",
    ],
    "meta.opisRada": ["skro.z: opis, fotografije i 360° pogled projekta.", "skro.z: project description, photos and 360° view."],
  };

  // izbor jezika: ?lang=en u adresi, zatim zapamćen izbor, inače srpski
  let jezik = "sr";
  try {
    const izAdrese = new URLSearchParams(location.search).get("lang");
    if (izAdrese === "en" || izAdrese === "sr") {
      jezik = izAdrese;
      localStorage.setItem("skroz-jezik", jezik);
    } else if (localStorage.getItem("skroz-jezik") === "en") {
      jezik = "en";
    }
  } catch (e) {}
  const en = jezik === "en";
  document.documentElement.lang = en ? "en" : "sr-Latn";

  // natpis iz rečnika
  const T = (kljuc) => {
    const par = RECNIK[kljuc];
    return par ? par[en ? 1 : 0] : kljuc;
  };
  // polje iz sadrzaj.js: na engleskom koristi "polje_en" ako postoji
  const TP = (obj, polje) => {
    if (!obj) return "";
    if (en && obj[polje + "_en"] != null && obj[polje + "_en"] !== "") return obj[polje + "_en"];
    return obj[polje];
  };
  // link ka drugoj stranici sajta zadržava izabrani jezik
  const saJezikom = (href) => {
    if (!en || !href || /^(https?:|mailto:|tel:|#)/.test(href) || /[?&]lang=/.test(href)) return href;
    if (!/\.html(\?|#|$)/.test(href) && href !== "./") return href;
    const [bezHasha, hash] = href.split("#");
    return bezHasha + (bezHasha.includes("?") ? "&" : "?") + "lang=en" + (hash !== undefined ? "#" + hash : "");
  };
  // adresa iste stranice na drugom jeziku
  const adresaZa = (j) => {
    const p = new URLSearchParams(location.search);
    p.set("lang", j);
    return location.pathname + "?" + p.toString() + location.hash;
  };

  // statični natpisi u HTML-u: data-t (tekst), data-t-aria (aria-label)
  const prevediStranicu = (koren = document) => {
    koren.querySelectorAll("[data-t]").forEach((el) => (el.textContent = T(el.dataset.t)));
    koren.querySelectorAll("[data-t-aria]").forEach((el) => el.setAttribute("aria-label", T(el.dataset.tAria)));
    koren.querySelectorAll("a[href]").forEach((a) => {
      const h = a.getAttribute("href");
      const novi = saJezikom(h);
      if (novi !== h) a.setAttribute("href", novi);
    });
    koren.querySelectorAll("[data-jezik]").forEach((a) => {
      a.setAttribute("href", adresaZa(a.dataset.jezik));
      a.classList.toggle("je-aktivan", a.dataset.jezik === jezik);
      a.setAttribute("aria-current", a.dataset.jezik === jezik ? "true" : "false");
    });
    const opis = document.querySelector('meta[name="description"]');
    if (opis && opis.dataset.t) opis.setAttribute("content", T(opis.dataset.t));
  };

  window.SKROZ_JEZIK = { jezik, en, T, TP, saJezikom, prevediStranicu };
})();
