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
    // investitorska stranica
    "inv.oznaka": ["Investitorska stranica", "Investor page"],
    "inv.ucitavanje": ["Učitavanje projekta…", "Loading project…"],
    "inv.azurirano": ["Poslednje ažuriranje", "Last updated"],
    "inv.azuriranoKratko": ["Ažurirano", "Updated"],
    "inv.renderi": ["Renderi", "Renders"],
    "inv.slikeUvod": ["Kliknite na sliku da je uvećate.", "Click an image to enlarge it."],
    "inv.dokumentacija": ["Dokumentacija", "Documents"],
    "inv.dokumentacijaUvod": ["Kliknite na dokument da ga otvorite.", "Click a document to open it."],
    "inv.onsite": ["Sa terena", "On site"],
    "inv.onsiteUvod": ["Fotografije sa gradilišta.", "Photos from the site."],
    "inv.ostalo": ["Ostalo", "Other"],
    "inv.prazno": ["Ovde još nema fajlova.", "No files here yet."],
    "inv.nevazeciNaslov": ["Link nije važeći", "This link is not valid"],
    "inv.nevazeciTekst": ["Proverite da li ste otvorili ceo link koji ste dobili, ili se javite studiju.", "Check that you opened the full link you received, or contact the studio."],
    "inv.nedostupnoNaslov": ["Stranica trenutno nije dostupna", "This page is temporarily unavailable"],
    "inv.nedostupnoTekst": ["Pokušajte ponovo za nekoliko minuta.", "Please try again in a few minutes."],
    "inv.prosledi": ["Prosledi", "Forward"],
    "inv.prosledi.naslov": ["Prosledi projekat", "Forward this project"],
    "inv.prosledi.tekst": ["Izaberite kako želite da pošaljete link.", "Choose how to send the link."],
    "inv.prosledi.mejl": ["Mejl", "Email"],
    "inv.prosledi.kopiraj": ["Kopiraj link", "Copy link"],
    "inv.prosledi.potvrda": ["Projekat je prosleđen", "Project forwarded"],
    "inv.prosledi.rucno": ["Označite link iznad i kopirajte ga.", "Select the link above and copy it."],
    "inv.prosledi.poruka": ["Projekat", "Project"],
    "inv.zatvori": ["Zatvori", "Close"],
    "pdf.ucitavanje": ["Učitavanje dokumenta…", "Loading document…"],
    "pdf.greska": ["Dokument ne može da se otvori.", "The document could not be opened."],
    "pdf.uvecaj": ["Uvećaj", "Zoom in"],
    "pdf.umanji": ["Umanji", "Zoom out"],
    "pdf.strana": ["Strana", "Page"],
    // stranica za upravljanje (Zoran)
    "adm.naslov": ["Upravljanje", "Management"],
    "adm.oznaka": ["Investitorske stranice", "Investor pages"],
    "adm.bezKljuca": ["Otvorite ovu stranicu preko svog ličnog linka za upravljanje.", "Open this page using your personal management link."],
    "adm.pogresanKljuc": ["Link za upravljanje nije ispravan.", "The management link is not valid."],
    "adm.onedrive": ["OneDrive", "OneDrive"],
    "adm.povezan": ["Povezan", "Connected"],
    "adm.nijePovezan": ["Nije povezan", "Not connected"],
    "adm.nijePodeseno": ["Čeka se podešavanje Microsoft aplikacije.", "Waiting for the Microsoft app to be set up."],
    "adm.povezi": ["Poveži OneDrive", "Connect OneDrive"],
    "adm.poveziPonovo": ["Poveži ponovo", "Reconnect"],
    "adm.korenNema": ["Na OneDrive-u napravite folder", "Create this folder on OneDrive:"],
    "adm.korenNema2": ["i u njemu po jedan folder za svaki projekat.", "and inside it one folder per project."],
    "adm.projekti": ["Projekti", "Projects"],
    "adm.nemaProjekata": ["U folderu još nema projekata.", "There are no projects in the folder yet."],
    "adm.otvori": ["Otvori", "Open"],
    "adm.kopiraj": ["Kopiraj link", "Copy link"],
    "adm.kopirano": ["Kopirano", "Copied"],
    "adm.noviLink": ["Novi link", "New link"],
    "adm.noviLinkPitanje": ["Stari link prestaje da radi. Sigurno?", "The old link will stop working. Are you sure?"],
    "adm.da": ["Da, napravi novi", "Yes, create a new one"],
    "adm.ne": ["Odustani", "Cancel"],
    "adm.veza.ok": ["OneDrive je povezan.", "OneDrive is connected."],
    "adm.veza.odbijeno": ["Prijava je otkazana.", "Sign-in was cancelled."],
    "adm.veza.isteklo": ["Prijava je istekla. Pokušajte ponovo.", "Sign-in expired. Please try again."],
    "adm.veza.greska": ["Povezivanje nije uspelo. Pokušajte ponovo.", "Connection failed. Please try again."],
    "adm.izmenjeno": ["Izmenjeno", "Changed"],
    "meta.opisPocetna": [
      "skro.z: 3D vizuelizacija eksterijera i enterijera, terenska koordinacija i projekti za nove objekte. Novi Bečej, Zrenjanin.",
      "skro.z: 3D visualization of exteriors and interiors, on-site coordination and designs for new buildings. Novi Bečej, Zrenjanin, Serbia.",
    ],
    "meta.opisRada": ["skro.z: opis, fotografije i 360° pogled projekta.", "skro.z: project description, photos and 360° view."],
    "meta.investitor": ["skro.z: investitorska stranica projekta.", "skro.z: project investor page."],
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
