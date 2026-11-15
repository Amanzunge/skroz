/* ==========================================================================
   skro.z: investitorska stranica (investitor.html) i upravljanje (admin.html)
   Sadržaj dolazi iz Zoranovog OneDrive-a preko servera (folder server/).
   ========================================================================== */
(() => {
  // adresa servera (Cloudflare Worker)
  const API = "https://skroz-api.skroz-api.workers.dev";

  const strana = document.body.dataset.strana;
  if (strana !== "investitor" && strana !== "admin") return;
  const { $, $$, esc, IKONA, pojavi, lightbox, celeSlike, uvodnik, paralaksa } = window.SKROZ_UI;
  const { T, en } = window.SKROZ_JEZIK;
  const glavni = $("main");

  const IKONE = {
    pdf: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M12 4h17l9 9v31H12z"/><path d="M29 4v9h9"/><path d="M18 26h14M18 32h14M18 38h9"/></svg>',
    fajl: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M12 4h17l9 9v31H12z"/><path d="M29 4v9h9"/></svg>',
    viber: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M12 3c-5 0-8 2.6-8 7.4 0 2.7 1 4.6 2.6 5.8V21l3-2.6c.8.2 1.6.3 2.4.3 5 0 8-2.6 8-7.3S17 3 12 3Z"/><path d="M9.5 8.5c.5 2.5 2.4 4.6 5 5.4"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M4 20l1.2-4A8 8 0 1 1 8 18.8Z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 1a4 4 0 0 1-2.5-2.5l1-1-1-2Z"/></svg>',
    mejl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="3" y="5" width="18" height="14"/><path d="m3 6 9 7 9-7"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    zatvori: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    olovka: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><ellipse cx="12" cy="12" rx="9" ry="6.5"/></svg>',
    slojevi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="m12 4 9 5-9 5-9-5 9-5Z"/><path d="m3 14 9 5 9-5"/></svg>',
  };

  const datum = (iso) =>
    iso ? new Date(iso).toLocaleDateString(en ? "en-GB" : "sr-Latn-RS", { day: "numeric", month: "long", year: "numeric" }) : "";
  const datumVreme = (iso) =>
    iso
      ? new Date(iso).toLocaleString(en ? "en-GB" : "sr-Latn-RS", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
      : "";

  const parametri = new URLSearchParams(location.search);
  const P = parametri.get("p") || "";
  const PRIMER = P === "primer";
  let ADMIN = "";
  try { ADMIN = localStorage.getItem("skroz-admin") || ""; } catch (e) {}

  const citaj = (kljuc, podrazumevano) => {
    try { return JSON.parse(localStorage.getItem(kljuc)) ?? podrazumevano; } catch (e) { return podrazumevano; }
  };
  const pisi = (kljuc, vrednost) => {
    try { localStorage.setItem(kljuc, JSON.stringify(vrednost)); } catch (e) {}
  };

  async function zahtev(put, opcije = {}) {
    let r;
    try {
      r = await fetch(API + put, opcije);
    } catch (e) {
      const g = new Error("mreza");
      g.status = 0;
      throw g;
    }
    let podaci = null;
    try { podaci = await r.json(); } catch (e) {}
    if (!r.ok) {
      const g = new Error((podaci && podaci.greska) || "greska");
      g.status = r.status;
      throw g;
    }
    return podaci;
  }
  const javi = (put) => !PRIMER && fetch(API + put, { method: "POST", keepalive: true }).catch(() => {});

  const fajl = (x) => x.url || `${API}/fajl?p=${encodeURIComponent(P)}&id=${encodeURIComponent(x.id)}&v=${x.v}`;
  const slicica = (x, mala) =>
    (mala ? x.mala : x.slicica) || x.url || `${API}/slicica?p=${encodeURIComponent(P)}&id=${encodeURIComponent(x.id)}&v=${x.v}${mala ? "&s=mala" : ""}`;

  /* ==========================================================================
     INVESTITORSKA STRANICA
     ========================================================================== */

  let projekat = null;
  let oznake = [];

  async function investitor() {
    glavni.innerHTML = stanje(T("inv.oznaka"), T("inv.ucitavanje"));
    const uvodGotov = new Promise((res) => uvodnik(res));

    let d;
    try {
      d = PRIMER ? primer() : await zahtev(`/projekat?p=${encodeURIComponent(P)}`);
    } catch (e) {
      await uvodGotov;
      glavni.innerHTML = e.status === 404
        ? stanje(T("rad.greska"), T("inv.nevazeciTekst"), T("inv.nevazeciNaslov"))
        : stanje(T("rad.greska"), T("inv.nedostupnoTekst"), T("inv.nedostupnoNaslov"));
      document.body.classList.add("spreman");
      return;
    }
    projekat = d;
    if (!PRIMER) {
      try { oznake = (await zahtev(`/oznake?p=${encodeURIComponent(P)}`)).oznake || []; } catch (e) { oznake = []; }
    }

    document.title = `${d.naziv} | skro.z`;
    // ON SITE je uvek tu, zbog dugmeta "Dodaj fotografije"
    const sekcije = d.sekcije.filter((s) => s.stavke.length || s.vrsta === "onsite");
    if (!sekcije.some((s) => s.vrsta === "onsite")) sekcije.push({ vrsta: "onsite", naziv: "ON SITE", stavke: [] });
    const sveSlike = sekcije.filter((s) => s.vrsta !== "panorame").flatMap((s) => s.stavke.filter((x) => x.vrsta === "slika"));
    const naslovna = (sekcije.find((s) => s.vrsta === "renderi") || {}).stavke?.find((x) => x.vrsta === "slika") || sveSlike[0];

    const idSekcije = (s, i) => (s.vrsta === "ostalo" ? `s-ostalo-${i}` : `s-${s.vrsta}`);
    const naslovSekcije = (s) =>
      ({ renderi: T("inv.renderi"), panorame: T("rad.panoOznaka"), dokumentacija: T("inv.dokumentacija"), onsite: T("inv.onsite") })[s.vrsta] || s.naziv;

    let html = `
      <section class="rad-hero inv-hero${naslovna ? "" : " inv-hero--bez-slike"}">
        ${naslovna ? `<div class="rad-hero__slika"><img src="${esc(fajl(naslovna))}" alt="" fetchpriority="high"></div>` : ""}
        <div class="okvir rad-hero__sadrzaj">
          <span class="oznaka inv-hero__oznaka">${T("inv.oznaka")}</span>
          <h1 class="rad-hero__naslov"><span class="maska"><span>${esc(d.naziv)}</span></span></h1>
          <div class="rad-hero__meta">
            <div><span>${T("inv.azurirano")}</span><b>${esc(datum(d.azurirano))}</b></div>
            ${sekcije.map((s, i) => (s.stavke.length ? `<div><a href="#${idSekcije(s, i)}"><span>${esc(naslovSekcije(s))}</span><b>${s.stavke.length}</b></a></div>` : "")).join("")}
          </div>
        </div>
      </section>`;

    let brojac = 0;
    const pozadina = () => (brojac++ % 2 ? " sekcija--siva" : "");
    const glava = (oznaka, naslov, uvod) => `
      <div class="sekcija__glava">
        <span class="oznaka" data-pojavi>${esc(oznaka)}</span>
        <h2 class="naslov-sekcije" data-reci>${esc(naslov)}</h2>
        ${uvod ? `<p class="uvod" data-pojavi>${esc(uvod)}</p>` : ""}
      </div>`;

    const panorame = [];
    let prvaPano = true;
    sekcije.forEach((s, i) => {
      const slike = s.stavke.filter((x) => x.vrsta === "slika");
      const ostali = s.stavke.filter((x) => x.vrsta !== "slika");
      if (s.vrsta === "panorame") {
        panorame.push(...slike);
        if (!prvaPano) return;
        prvaPano = false;
        html += `
          <section class="sekcija pano-sekcija${pozadina()}" id="s-panorame">
            <div class="okvir">
              ${glava(T("rad.panoOznaka"), T("rad.panoNaslov"), T("rad.panoUvod"))}
              <div class="pano" data-pojavi>
                <div class="pano__pregledac" id="pano-pregledac"></div>
                <div class="pano__savet">${IKONA.ruka}<span>${T("rad.panoSavet")}</span></div>
              </div>
              <div class="pano__sobe" role="tablist" aria-label="${T("rad.prostorije")}"></div>
            </div>
          </section>`;
        return;
      }
      const naslov = naslovSekcije(s);
      const uvod = {
        renderi: T("oz.uvodRenderi"),
        dokumentacija: T("oz.uvodDokumenti"),
        onsite: T("otp.uvod"),
      }[s.vrsta] || (slike.length ? T("inv.slikeUvod") : "");
      html += `
        <section class="sekcija${pozadina()}" id="${idSekcije(s, i)}" data-sekcija="${i}">
          <div class="okvir">
            ${glava(s.vrsta === "ostalo" ? T("inv.ostalo") : T("inv.oznaka"), naslov, uvod)}
            ${s.vrsta === "onsite" ? otpremanjeHtml() : ""}
            <div class="sekcija__sadrzaj">${sadrzajSekcije(s)}</div>
          </div>
        </section>`;
    });

    html += `
      <section class="sekcija inv-prosledi${pozadina()}">
        <div class="okvir inv-prosledi__unutra">
          <p>${esc(d.naziv)}</p>
          <button class="dugme" type="button" data-prosledi>${IKONE.link}<span>${T("inv.prosledi")}</span></button>
        </div>
      </section>`;

    glavni.innerHTML = html;
    sekcije.forEach((s, i) => s.vrsta !== "panorame" && poveziSekciju(s, $(`[data-sekcija="${i}"]`)));
    osveziBrojace();

    if (panorame.length) {
      $(".pano__sobe").innerHTML = panorame.length > 1
        ? panorame.map((x, k) => `
            <button class="soba${k === 0 ? " je-aktivna" : ""}" type="button" role="tab" aria-selected="${k === 0}" data-soba="${k}">
              <span class="soba__slika"><img src="${esc(slicica(x, true))}" alt="" loading="lazy"></span>
              <span class="soba__ime">${esc(x.naziv)}</span>
            </button>`).join("")
        : "";
      window.SKROZ_RAD = { panorame: panorame.map((x) => ({ naziv: x.naziv, slika: fajl(x), slicica: slicica(x, true) })) };
      window.SKROZ_NAZIV_POGLEDA = (x) => x.naziv;
      import("./panorama.js");
    }

    $("[data-prosledi]").addEventListener("click", () => prosledi(d.naziv));
    paralaksa($(".rad-hero__slika"));
    pojavi();
    zabeleziPregled();
    await uvodGotov;
    document.body.classList.add("spreman");
  }

  // sadržaj jedne sekcije (galerija i/ili dokumenti)
  function sadrzajSekcije(s) {
    const slike = s.stavke.filter((x) => x.vrsta === "slika");
    const ostali = s.stavke.filter((x) => x.vrsta !== "slika");
    if (s.vrsta === "dokumentacija") return dokumentiHtml(s.stavke);
    if (!s.stavke.length) return s.vrsta === "onsite" ? `<p class="inv-prazno">${T("inv.prazno")}</p>` : "";
    return `${slike.length ? galerijaHtml(slike, s.vrsta === "renderi") : ""}${ostali.length ? dokumentiHtml(ostali) : ""}`;
  }

  function galerijaHtml(stavke, saOznakama) {
    return `
      <div class="galerija">
        ${stavke.map((x, k) => `
          <button class="galerija__stavka" type="button" data-pojavi="slika" data-indeks="${k}" style="--kasni:${k % 3 === 2 ? 0.12 : 0}s" aria-label="${T("rad.uvecaj")} ${k + 1}">
            <span class="otkrij" style="display:block;width:100%;height:100%"><img src="${esc(slicica(x))}" alt="${esc(x.naziv)}" loading="lazy"></span>
            ${saOznakama ? `<span class="zahtevi-broj" data-zahtevi="${esc(x.id)}" hidden></span>` : ""}
          </button>`).join("")}
      </div>`;
  }

  function dokumentiHtml(stavke) {
    return `
      <div class="dokumenti">
        ${stavke.map((x) => {
          const pdf = x.vrsta === "pdf";
          const unutra = `
            <span class="dok__slika">${pdf ? `<img src="${esc(slicica(x))}" alt="" loading="lazy" onerror="this.parentNode.classList.add('bez-slike')">` : ""}${pdf ? IKONE.pdf : IKONE.fajl}
              ${pdf ? `<span class="zahtevi-broj" data-zahtevi="${esc(x.id)}" hidden></span>` : ""}</span>
            <span class="dok__ime">${esc(x.naziv)}</span>
            <span class="dok__datum">${T("inv.azuriranoKratko")}: ${esc(datum(x.izmenjen))}</span>`;
          return pdf
            ? `<button class="dok" type="button" data-pojavi data-pdf="${esc(x.id)}">${unutra}</button>`
            : `<a class="dok" data-pojavi href="${esc(fajl(x))}" target="_blank" rel="noopener">${unutra}</a>`;
        }).join("")}
      </div>`;
  }

  // klikovi u sekciji: renderi i PDF-ovi idu u pregledač sa oznakama, ostale slike u običnu galeriju
  function poveziSekciju(s, el) {
    if (!el) return;
    const slike = s.stavke.filter((x) => x.vrsta === "slika");
    const galerija = $(".galerija", el);
    if (galerija) {
      celeSlike(galerija);
      if (s.vrsta === "renderi") {
        $$(".galerija__stavka", galerija).forEach((b) =>
          b.addEventListener("click", () => otvoriPregled(slike, Number(b.dataset.indeks))));
      } else {
        lightbox(slike.map(fajl), projekat.naziv, galerija);
      }
    }
    $$("[data-pdf]", el).forEach((b) => b.addEventListener("click", () => {
      const x = s.stavke.find((y) => y.id === b.dataset.pdf);
      if (x) otvoriPregled([x], 0);
    }));
    if (s.vrsta === "onsite") poveziOtpremanje(el, s);
  }

  function zabeleziPregled() {
    if (PRIMER || ADMIN) return; // Zoranova otvaranja se ne broje
    const kljuc = "skroz-pregled-" + P;
    try {
      if (sessionStorage.getItem(kljuc)) return;
      sessionStorage.setItem(kljuc, "1");
    } catch (e) {}
    javi(`/pregled?p=${encodeURIComponent(P)}${parametri.get("f") === "1" ? "&f=1" : ""}`);
  }

  // primer projekta (?p=primer): javne slike sa sajta, da se vidi kako stranica izgleda
  function primer() {
    const S = window.SKROZ;
    const nadji = (id) => S.radovi.find((r) => r.id === id) || S.radovi[0];
    const danas = new Date().toISOString();
    const slika = (url, naziv, i) => ({ id: "p" + i + naziv.replace(/\s/g, ""), naziv, vrsta: "slika", url, v: "1", izmenjen: danas, sirina: 2000, visina: 1125 });
    const vik = nadji("vikendica-bezdan");
    const stan = nadji("enterijer-4s");
    return {
      naziv: en ? "Example project" : "Primer projekta",
      azurirano: danas,
      sekcije: [
        { vrsta: "renderi", naziv: "Renderi", stavke: vik.slike.slice(0, 6).map((u, i) => slika(u, `Render ${i + 1}`, i)) },
        { vrsta: "panorame", naziv: "360 panorame", stavke: vik.panorame.slice(0, 4).map((x, i) => ({ ...slika(x.slika, `Pogled ${i + 1}`, i), mala: x.slicica })) },
        { vrsta: "dokumentacija", naziv: "Dokumentacija", stavke: [
          { id: "d1", naziv: en ? "Facades and sections" : "Fasade i preseci", vrsta: "pdf", url: "slike/primer/primer.pdf", slicica: "slike/primer/primer.jpg", v: "1", izmenjen: danas },
        ] },
        { vrsta: "onsite", naziv: "ON SITE", stavke: stan.slike.slice(7, 13).map((u, i) => slika(u, `On site ${i + 1}`, i)) },
      ],
    };
  }

  function stanje(oznaka, tekst, naslov) {
    return `
      <section class="sekcija inv-stanje">
        <div class="okvir">
          <span class="oznaka">${esc(oznaka)}</span>
          ${naslov ? `<h1 class="naslov-sekcije">${esc(naslov)}</h1>` : ""}
          <p class="uvod">${esc(tekst)}</p>
        </div>
      </section>`;
  }

  /* ---------- Dodaj fotografije (ON SITE) ---------- */

  const NAJVISE_MB = 40;

  function otpremanjeHtml() {
    return `
      <div class="otpremi">
        <button class="dugme" type="button" data-dodaj>${IKONE.plus}<span>${T("otp.dodaj")}</span></button>
        <input type="file" accept="image/*" multiple hidden data-ulaz>
        <p class="otpremi__status" aria-live="polite"></p>
      </div>`;
  }

  function poveziOtpremanje(el, s) {
    const dugme = $("[data-dodaj]", el);
    const ulaz = $("[data-ulaz]", el);
    const status = $(".otpremi__status", el);
    if (!dugme || dugme.dataset.povezano) return;
    dugme.dataset.povezano = "1";
    dugme.addEventListener("click", () => ulaz.click());
    ulaz.addEventListener("change", async () => {
      const fajlovi = [...ulaz.files];
      ulaz.value = "";
      if (!fajlovi.length) return;
      if (PRIMER) {
        status.textContent = T("otp.primer");
        return;
      }
      dugme.disabled = true;
      el.classList.add("salje");
      let uspelo = 0;
      const nisu = [];
      for (let k = 0; k < fajlovi.length; k++) {
        const f = fajlovi[k];
        status.textContent = `${T("otp.saljem")} ${k + 1} / ${fajlovi.length}…`;
        if (!/^image\//.test(f.type) || f.size > NAJVISE_MB * 1024 * 1024) {
          nisu.push(f.name);
          continue;
        }
        try {
          await zahtev(`/otpremi?p=${encodeURIComponent(P)}&ime=${encodeURIComponent(f.name)}`, {
            method: "POST",
            headers: { "Content-Type": f.type },
            body: f,
          });
          uspelo++;
        } catch (e) {
          nisu.push(f.name);
        }
      }
      status.textContent = [
        uspelo ? `${T("otp.poslato")} ${uspelo}. ${T("otp.hvala")}` : "",
        nisu.length ? `${T("otp.nije")} ${nisu.join(", ")} (${T("otp.pravila")})` : "",
      ].filter(Boolean).join(" ");
      dugme.disabled = false;
      el.classList.remove("salje");
      if (uspelo) osveziOnsite(el);
    });
  }

  async function osveziOnsite(el) {
    try {
      const d = await zahtev(`/projekat?p=${encodeURIComponent(P)}`);
      const s = d.sekcije.find((x) => x.vrsta === "onsite");
      if (!s) return;
      const sadrzaj = $(".sekcija__sadrzaj", el);
      sadrzaj.innerHTML = sadrzajSekcije(s);
      $$("[data-pojavi]", sadrzaj).forEach((x) => x.classList.add("vidljivo"));
      poveziSekciju(s, el);
    } catch (e) {}
  }

  /* ---------- oznake (zahtevi za izmenu) ---------- */

  const mojeOznake = () => citaj("skroz-oznake", {});
  const oznakeFajla = (id) => oznake.filter((o) => o.fajl === id).sort((a, b) => a.id - b.id);

  function osveziBrojace() {
    $$("[data-zahtevi]").forEach((el) => {
      const sve = oznakeFajla(el.dataset.zahtevi);
      const otvorene = sve.filter((o) => o.status === "otvoreno").length;
      const resene = sve.length - otvorene;
      el.hidden = !sve.length;
      el.classList.toggle("zahtevi-broj--reseno", !otvorene && !!resene);
      el.textContent = otvorene ? String(otvorene) : resene ? "✓" : "";
      el.title = otvorene ? `${T("oz.zahtevi")}: ${otvorene}` : `${T("oz.resene")}: ${resene}`;
    });
  }

  let sledeciPrimerId = 1;
  const sacuvajOznaku = async (podaci) => {
    if (PRIMER) return { oznaka: { ...podaci, id: sledeciPrimerId++, status: "otvoreno", napravljena: new Date().toISOString(), verzija: podaci.v }, kljuc: "primer" };
    return zahtev(`/oznake?p=${encodeURIComponent(P)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(podaci),
    });
  };
  const promeniStatus = async (o, status) => {
    if (PRIMER) return { oznaka: { ...o, status, resena: status === "reseno" ? new Date().toISOString() : null } };
    return zahtev(`/oznake/status?p=${encodeURIComponent(P)}&id=${o.id}&status=${status}`, { method: "POST", headers: { "X-Kljuc": ADMIN } });
  };
  const obrisiOznaku = async (o) => {
    if (PRIMER) return { ok: true };
    const kljuc = mojeOznake()[o.id] || "";
    return zahtev(`/oznake/obrisi?p=${encodeURIComponent(P)}&id=${o.id}&kljuc=${encodeURIComponent(kljuc)}`, {
      method: "POST",
      headers: ADMIN ? { "X-Kljuc": ADMIN } : {},
    });
  };

  /* ---------- pregledač: render ili PDF, sa oznakama i slojevima ---------- */

  let pdfjs;
  function ucitajPdfJs() {
    pdfjs ??= new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      s.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        res(window.pdfjsLib);
      };
      s.onerror = () => { pdfjs = null; rej(new Error("pdf.js")); };
      document.head.append(s);
    });
    return pdfjs;
  }

  // 1 strana, 2-4 strane, 5+ strana (21 strana, 22 strane…); engleski: 1 page, 2 pages
  function brojStrana(n) {
    if (en) return `${n} ${n === 1 ? "page" : "pages"}`;
    const d = n % 10, s = n % 100;
    return `${n} ${d >= 2 && d <= 4 && (s < 12 || s > 14) ? "strane" : "strana"}`;
  }

  const SVG = "http://www.w3.org/2000/svg";

  function otvoriPregled(stavke, pocetak) {
    const fokus = document.activeElement;
    const slojevi = citaj("skroz-slojevi", { zahtevi: true, resene: true });
    let i = pocetak;
    let zum = 1;
    let crtanje = false;
    let dokument = null;
    let posmatrac = null;
    let otkazi = null;
    const visePuta = stavke.length > 1;

    const m = document.createElement("div");
    m.className = "pdf pregled";
    m.setAttribute("role", "dialog");
    m.setAttribute("aria-modal", "true");
    m.innerHTML = `
      <div class="pdf__vrh">
        <div class="pdf__naslov"><b></b><span></span></div>
        <div class="pdf__alati">
          ${visePuta ? `<button type="button" data-ide="-1" aria-label="${T("lightbox.prethodna")}">‹</button><button type="button" data-ide="1" aria-label="${T("lightbox.sledeca")}">›</button>` : ""}
          <div class="slojevi">
            <button type="button" class="pregled__alat" data-slojevi aria-expanded="false">${IKONE.slojevi}<span>${T("oz.slojevi")}</span></button>
            <div class="slojevi__meni" hidden>
              <label><input type="checkbox" data-sloj="zahtevi" ${slojevi.zahtevi ? "checked" : ""}><i class="tacka tacka--crvena"></i>${T("oz.zahtevi")}</label>
              <label><input type="checkbox" data-sloj="resene" ${slojevi.resene ? "checked" : ""}><i class="tacka tacka--zelena"></i>${T("oz.resene")}</label>
            </div>
          </div>
          <button type="button" class="pregled__alat pregled__oznaci" data-oznaci aria-pressed="false">${IKONE.olovka}<span>${T("oz.oznaci")}</span></button>
          <button type="button" data-zum="-1" aria-label="${T("pdf.umanji")}">−</button>
          <span class="pdf__zum">100%</span>
          <button type="button" data-zum="1" aria-label="${T("pdf.uvecaj")}">+</button>
          <button type="button" class="pdf__zatvori">${T("inv.zatvori")} ${IKONE.zatvori}</button>
        </div>
        <p class="pregled__savet" hidden>${T("oz.savet")}</p>
      </div>
      <div class="pdf__strane" tabindex="0"></div>
      <div class="pregled__panel" hidden></div>`;
    document.body.append(m);
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => m.classList.add("otvoren"));
    const strane = $(".pdf__strane", m);
    const panel = $(".pregled__panel", m);
    const savet = $(".pregled__savet", m);

    const primeniSlojeve = () => {
      m.classList.toggle("bez-zahteva", !slojevi.zahtevi);
      m.classList.toggle("bez-resenih", !slojevi.resene);
    };
    primeniSlojeve();

    const zatvori = () => {
      otkazi && otkazi();
      posmatrac && posmatrac.disconnect();
      dokument && dokument.destroy();
      m.remove();
      document.documentElement.style.overflow = "";
      removeEventListener("keydown", tastatura);
      removeEventListener("resize", naVelicinu);
      fokus && fokus.focus();
    };
    const tastatura = (e) => {
      if (e.target.closest && e.target.closest("textarea, input")) return;
      if (e.key === "Escape") return panel.hidden ? zatvori() : zatvoriPanel();
      if (visePuta && e.key === "ArrowLeft") idi(-1);
      if (visePuta && e.key === "ArrowRight") idi(1);
    };
    let tajmerVelicine;
    const naVelicinu = () => {
      clearTimeout(tajmerVelicine);
      tajmerVelicine = setTimeout(() => rasporedi(), 150);
    };
    addEventListener("keydown", tastatura);
    addEventListener("resize", naVelicinu);
    $(".pdf__zatvori", m).addEventListener("click", zatvori);
    $(".pdf__zatvori", m).focus();

    // slojevi
    const dugmeSlojeva = $("[data-slojevi]", m);
    const meni = $(".slojevi__meni", m);
    dugmeSlojeva.addEventListener("click", () => {
      meni.hidden = !meni.hidden;
      dugmeSlojeva.setAttribute("aria-expanded", String(!meni.hidden));
    });
    $$("[data-sloj]", m).forEach((c) => c.addEventListener("change", () => {
      slojevi[c.dataset.sloj] = c.checked;
      pisi("skroz-slojevi", slojevi);
      primeniSlojeve();
    }));
    m.addEventListener("click", (e) => {
      if (!meni.hidden && !e.target.closest(".slojevi")) {
        meni.hidden = true;
        dugmeSlojeva.setAttribute("aria-expanded", "false");
      }
    });

    // označavanje
    const dugmeOznaci = $("[data-oznaci]", m);
    const postaviCrtanje = (da) => {
      crtanje = da;
      m.classList.toggle("crtanje", da);
      dugmeOznaci.setAttribute("aria-pressed", String(da));
      $("span", dugmeOznaci).textContent = da ? T("oz.oznaciGotovo") : T("oz.oznaci");
      savet.hidden = !da;
      if (da && !slojevi.zahtevi) {
        slojevi.zahtevi = true;
        $('[data-sloj="zahtevi"]', m).checked = true;
        primeniSlojeve();
      }
    };
    dugmeOznaci.addEventListener("click", () => postaviCrtanje(!crtanje));

    $$("[data-zum]", m).forEach((b) => b.addEventListener("click", () => {
      zum = Math.min(3, Math.max(0.5, Math.round((zum + Number(b.dataset.zum) * 0.25) * 100) / 100));
      $(".pdf__zum", m).textContent = `${Math.round(zum * 100)}%`;
      rasporedi();
    }));
    $$("[data-ide]", m).forEach((b) => b.addEventListener("click", () => idi(Number(b.dataset.ide))));
    const idi = (smer) => {
      zatvoriPanel();
      i = (i + smer + stavke.length) % stavke.length;
      prikazi();
    };

    // širina strane: slika staje u ekran, PDF ide po širini (najviše 1200 px)
    const sirinaStrane = (kutija) => {
      const W = strane.clientWidth - 32;
      const H = strane.clientHeight - 48;
      const odnos = Number(kutija.dataset.odnos) || 1.5;
      const osnovna = kutija.dataset.vrsta === "slika" ? Math.min(W, H * odnos) : Math.min(W, 1200);
      return Math.max(200, osnovna * zum);
    };
    const rasporedi = () => {
      $$(".pdf__strana", strane).forEach((k) => {
        k.style.width = `${sirinaStrane(k)}px`;
        delete k.dataset.iscrtano;
      });
      $$(".pdf__strana", strane).forEach((k) => k.dataset.vrsta === "pdf" && posmatrac && (posmatrac.unobserve(k), posmatrac.observe(k)));
    };

    const napraviStranu = (x, n, odnos, vrsta) => {
      const k = document.createElement("div");
      k.className = "pdf__strana";
      k.dataset.n = n;
      k.dataset.vrsta = vrsta;
      k.dataset.odnos = odnos;
      k.style.aspectRatio = String(odnos);
      if (vrsta === "pdf") k.setAttribute("aria-label", `${T("pdf.strana")} ${n}`);
      k.innerHTML = `<div class="pdf__platno"></div><div class="oz-sloj"><svg viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true"></svg></div>`;
      strane.append(k);
      k.style.width = `${sirinaStrane(k)}px`;
      poveziCrtanje(k, x, n);
      nacrtajOznake(k, x, n);
      return k;
    };

    async function prikazi() {
      const x = stavke[i];
      otkazi && otkazi();
      posmatrac && posmatrac.disconnect();
      dokument && (dokument.destroy(), (dokument = null));
      strane.innerHTML = "";
      m.setAttribute("aria-label", x.naziv);
      $(".pdf__naslov b", m).textContent = x.naziv;
      $(".pdf__naslov span", m).textContent = `${T("inv.azuriranoKratko")}: ${datum(x.izmenjen)}${visePuta ? ` · ${i + 1} / ${stavke.length}` : ""}`;

      if (x.vrsta === "slika") {
        const odnos = x.sirina && x.visina ? x.sirina / x.visina : 1.5;
        const k = napraviStranu(x, 0, odnos, "slika");
        const img = new Image();
        img.alt = x.naziv;
        img.onload = () => {
          const pravi = img.naturalWidth / img.naturalHeight;
          if (Math.abs(pravi - odnos) > 0.01) {
            k.dataset.odnos = pravi;
            k.style.aspectRatio = String(pravi);
            k.style.width = `${sirinaStrane(k)}px`;
          }
        };
        img.src = fajl(x);
        $(".pdf__platno", k).append(img);
        return;
      }

      strane.insertAdjacentHTML("afterbegin", `<p class="pdf__poruka">${T("pdf.ucitavanje")}</p>`);
      let otkazano = false;
      otkazi = () => (otkazano = true);
      try {
        const lib = await ucitajPdfJs();
        const doc = await lib.getDocument({ url: fajl(x), disableRange: true, disableStream: true }).promise;
        if (otkazano) return doc.destroy();
        dokument = doc;
      } catch (e) {
        strane.innerHTML = `<p class="pdf__poruka">${T("pdf.greska")}</p>`;
        return;
      }
      strane.innerHTML = "";
      $(".pdf__naslov span", m).textContent += ` · ${brojStrana(dokument.numPages)}`;
      posmatrac = new IntersectionObserver((unosi) => unosi.forEach((u) => u.isIntersecting && iscrtajPdf(u.target)), { root: strane, rootMargin: "600px 0px" });
      for (let n = 1; n <= dokument.numPages; n++) {
        const s = await dokument.getPage(n);
        if (otkazano) return;
        const v = s.getViewport({ scale: 1 });
        posmatrac.observe(napraviStranu(x, n, v.width / v.height, "pdf"));
      }
    }

    async function iscrtajPdf(k) {
      if (!dokument || k.dataset.iscrtano) return;
      k.dataset.iscrtano = "1";
      const s = await dokument.getPage(Number(k.dataset.n));
      const v1 = s.getViewport({ scale: 1 });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const skala = Math.min((k.clientWidth * dpr) / v1.width, 4096 / v1.width);
      const v = s.getViewport({ scale: skala });
      const platno = document.createElement("canvas");
      platno.width = Math.floor(v.width);
      platno.height = Math.floor(v.height);
      await s.render({ canvasContext: platno.getContext("2d"), viewport: v }).promise;
      $(".pdf__platno", k).replaceChildren(platno);
    }

    // crtanje elipse prevlačenjem (ili dodirom)
    function poveziCrtanje(k, x, n) {
      const sloj = $(".oz-sloj", k);
      const svg = $("svg", sloj);
      sloj.addEventListener("pointerdown", (e) => {
        if (!crtanje || e.button > 0 || e.target.closest(".oz-marker") || !panel.hidden) return;
        e.preventDefault();
        const r = sloj.getBoundingClientRect();
        const tacka = (ev) => [
          Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width)),
          Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height)),
        ];
        const [x0, y0] = tacka(e);
        let [x1, y1] = [x0, y0];
        const nacrt = elipsa(svg, "oz-nacrt", x0, y0, x1, y1);
        try { sloj.setPointerCapture(e.pointerId); } catch (greska) {}
        const pomeri = (ev) => {
          [x1, y1] = tacka(ev);
          postaviElipsu(nacrt, x0, y0, x1, y1);
        };
        const kraj = () => {
          sloj.removeEventListener("pointermove", pomeri);
          sloj.removeEventListener("pointerup", kraj);
          sloj.removeEventListener("pointercancel", kraj);
          let okvir = [Math.min(x0, x1), Math.min(y0, y1), Math.max(x0, x1), Math.max(y0, y1)];
          // dodir ili mali potez: krug od oko 28 px oko tačke
          if ((okvir[2] - okvir[0]) * r.width < 12 && (okvir[3] - okvir[1]) * r.height < 12) {
            const rx = 28 / r.width, ry = 28 / r.height;
            okvir = [x0 - rx, y0 - ry, x0 + rx, y0 + ry].map((v) => Math.min(1, Math.max(0, v)));
          }
          postaviElipsu(nacrt, ...okvir);
          noviZahtev(k, x, n, okvir, nacrt);
        };
        sloj.addEventListener("pointermove", pomeri);
        sloj.addEventListener("pointerup", kraj);
        sloj.addEventListener("pointercancel", kraj);
      });
    }

    function noviZahtev(k, x, n, okvir, nacrt) {
      panel.hidden = false;
      panel.innerHTML = `
        <p class="pregled__panel-naslov"><i class="tacka tacka--crvena"></i>${T("oz.novi")}</p>
        <textarea rows="3" maxlength="1500" placeholder="${T("oz.polje")}" aria-label="${T("oz.polje")}"></textarea>
        <p class="pregled__greska" aria-live="polite"></p>
        <div class="pregled__dugmad">
          <button class="dugme dugme--malo" type="button" data-sacuvaj>${T("oz.sacuvaj")}</button>
          <button class="dugme dugme--malo dugme--tiho" type="button" data-otkazi>${T("oz.otkazi")}</button>
        </div>`;
      const polje = $("textarea", panel);
      polje.focus();
      $("[data-otkazi]", panel).addEventListener("click", () => {
        nacrt.remove();
        zatvoriPanel();
      });
      const dugmeSacuvaj = $("[data-sacuvaj]", panel);
      dugmeSacuvaj.addEventListener("click", async () => {
        const tekst = polje.value.trim();
        if (!tekst) return polje.focus();
        dugmeSacuvaj.disabled = true;
        try {
          const r = await sacuvajOznaku({ fajl: x.id, ime: x.ime || x.naziv, strana: n, x0: okvir[0], y0: okvir[1], x1: okvir[2], y1: okvir[3], tekst, v: x.v, izmenjen: x.izmenjen });
          oznake.push(r.oznaka);
          const moje = mojeOznake();
          moje[r.oznaka.id] = r.kljuc;
          pisi("skroz-oznake", moje);
          nacrt.remove();
          zatvoriPanel();
          postaviCrtanje(false);
          osveziStrane(x);
          osveziBrojace();
        } catch (greska) {
          $(".pregled__greska", panel).textContent = T("oz.greska");
          dugmeSacuvaj.disabled = false;
        }
      });
    }

    function zatvoriPanel() {
      panel.hidden = true;
      panel.innerHTML = "";
      $$(".oz-nacrt", m).forEach((n) => n.remove());
      $$(".oz-marker.je-izabran", m).forEach((n) => n.classList.remove("je-izabran"));
    }

    function osveziStrane(x) {
      $$(".pdf__strana", strane).forEach((k) => nacrtajOznake(k, x, Number(k.dataset.n)));
    }

    // elipse i brojevi za jednu stranu
    function nacrtajOznake(k, x, n) {
      const sloj = $(".oz-sloj", k);
      const svg = $("svg", sloj);
      $$(".oz-elipsa", svg).forEach((e) => e.remove());
      $$(".oz-marker", sloj).forEach((e) => e.remove());
      oznakeFajla(x.id).forEach((o, redni) => {
        if (o.strana !== n) return;
        const klasa = o.status === "reseno" ? "oz--reseno" : "oz--otvoreno";
        elipsa(svg, `oz-elipsa ${klasa}`, o.x0, o.y0, o.x1, o.y1);
        const b = document.createElement("button");
        b.type = "button";
        b.className = `oz-marker ${klasa}`;
        b.textContent = String(redni + 1);
        b.style.left = `${o.x1 * 100}%`;
        b.style.top = `${o.y0 * 100}%`;
        b.setAttribute("aria-label", `${T("oz.zahtev")} ${redni + 1}`);
        b.addEventListener("click", (e) => {
          e.stopPropagation();
          detalji(o, redni + 1, x, b);
        });
        sloj.append(b);
      });
    }

    function detalji(o, redni, x, marker) {
      zatvoriPanel();
      marker.classList.add("je-izabran");
      const reseno = o.status === "reseno";
      const moja = !!mojeOznake()[o.id];
      const ranija = o.verzija && x.v && o.verzija !== x.v;
      panel.hidden = false;
      panel.innerHTML = `
        <p class="pregled__panel-naslov"><i class="tacka ${reseno ? "tacka--zelena" : "tacka--crvena"}"></i>${T("oz.zahtev")} ${redni} · ${reseno ? T("oz.reseno") : T("oz.zaIzmenu")}</p>
        <p class="pregled__tekst"></p>
        <p class="pregled__meta">${T("oz.postavljeno")}: ${esc(datumVreme(o.napravljena))}${reseno && o.resena ? `<br>${T("oz.resenoDana")}: ${esc(datumVreme(o.resena))}` : ""}${ranija ? `<br>${T("oz.ranijaVerzija")}${o.verzijaDatum ? ` (${esc(datum(o.verzijaDatum))})` : ""}` : ""}</p>
        <p class="pregled__greska" aria-live="polite"></p>
        <div class="pregled__dugmad">
          ${ADMIN || PRIMER ? `<button class="dugme dugme--malo" type="button" data-status>${reseno ? T("oz.vratiNaIzmenu") : T("oz.oznaciResenim")}</button>` : ""}
          ${ADMIN || PRIMER || (moja && !reseno) ? `<button class="dugme dugme--malo dugme--tiho" type="button" data-brisi>${T("oz.obrisi")}</button>` : ""}
          <button class="dugme dugme--malo dugme--tiho" type="button" data-zatvori>${T("inv.zatvori")}</button>
        </div>`;
      $(".pregled__tekst", panel).textContent = o.tekst;
      $("[data-zatvori]", panel).addEventListener("click", zatvoriPanel);
      $("[data-status]", panel)?.addEventListener("click", async () => {
        try {
          const r = await promeniStatus(o, reseno ? "otvoreno" : "reseno");
          Object.assign(o, r.oznaka);
          zatvoriPanel();
          osveziStrane(x);
          osveziBrojace();
        } catch (e) {
          $(".pregled__greska", panel).textContent = T("oz.greska");
        }
      });
      $("[data-brisi]", panel)?.addEventListener("click", async () => {
        try {
          await obrisiOznaku(o);
          oznake = oznake.filter((y) => y.id !== o.id);
          zatvoriPanel();
          osveziStrane(x);
          osveziBrojace();
        } catch (e) {
          $(".pregled__greska", panel).textContent = T("oz.greska");
        }
      });
    }

    prikazi();
  }

  function elipsa(svg, klasa, x0, y0, x1, y1) {
    const e = document.createElementNS(SVG, "ellipse");
    e.setAttribute("class", klasa);
    svg.append(e);
    postaviElipsu(e, x0, y0, x1, y1);
    return e;
  }
  function postaviElipsu(e, x0, y0, x1, y1) {
    e.setAttribute("cx", (x0 + x1) / 2);
    e.setAttribute("cy", (y0 + y1) / 2);
    e.setAttribute("rx", Math.abs(x1 - x0) / 2);
    e.setAttribute("ry", Math.abs(y1 - y0) / 2);
  }

  /* ---------- PROSLEDI ---------- */

  function prosledi(naziv) {
    const fokus = document.activeElement;
    const link = `${location.origin}${location.pathname}?p=${encodeURIComponent(P)}&f=1${en ? "&lang=en" : ""}`;
    const poruka = `${T("inv.prosledi.poruka")} ${naziv}: ${link}`;
    const m = document.createElement("div");
    m.className = "deli";
    m.setAttribute("role", "dialog");
    m.setAttribute("aria-modal", "true");
    m.setAttribute("aria-labelledby", "deli-naslov");
    m.innerHTML = `
      <div class="deli__kutija">
        <button class="deli__zatvori" type="button" aria-label="${T("inv.zatvori")}">${IKONE.zatvori}</button>
        <span class="oznaka">skro.z</span>
        <h2 id="deli-naslov">${T("inv.prosledi.naslov")}</h2>
        <p class="deli__tekst">${T("inv.prosledi.tekst")}</p>
        <div class="deli__opcije">
          <a class="deli__opcija" data-kanal="viber" href="viber://forward?text=${encodeURIComponent(poruka)}">${IKONE.viber}<span>Viber</span></a>
          <a class="deli__opcija" data-kanal="whatsapp" href="https://wa.me/?text=${encodeURIComponent(poruka)}" target="_blank" rel="noopener">${IKONE.whatsapp}<span>WhatsApp</span></a>
          <a class="deli__opcija" data-kanal="mejl" href="mailto:?subject=${encodeURIComponent(naziv + " | skro.z")}&body=${encodeURIComponent(poruka)}">${IKONE.mejl}<span>${T("inv.prosledi.mejl")}</span></a>
          <button class="deli__opcija" type="button" data-kanal="kopiraj" data-kopiraj>${IKONE.link}<span>${T("inv.prosledi.kopiraj")}</span></button>
        </div>
        <input class="deli__link" type="text" readonly value="${esc(link)}" aria-label="Link">
        <p class="deli__potvrda" aria-live="polite"></p>
      </div>`;
    document.body.append(m);
    requestAnimationFrame(() => m.classList.add("otvoren"));
    const potvrda = $(".deli__potvrda", m);
    const zatvori = () => {
      m.classList.remove("otvoren");
      removeEventListener("keydown", tastatura);
      setTimeout(() => m.remove(), 400);
      fokus && fokus.focus();
    };
    const tastatura = (e) => e.key === "Escape" && zatvori();
    addEventListener("keydown", tastatura);
    $(".deli__zatvori", m).addEventListener("click", zatvori);
    m.addEventListener("click", (e) => e.target === m && zatvori());
    let zabelezeno = false;
    $$("[data-kanal]", m).forEach((el) => el.addEventListener("click", () => {
      if (zabelezeno || ADMIN) return;
      zabelezeno = true;
      javi(`/prosledjeno?p=${encodeURIComponent(P)}&kanal=${el.dataset.kanal}`);
    }));
    $("[data-kopiraj]", m).addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(link);
        potvrda.textContent = T("inv.prosledi.potvrda");
        potvrda.classList.add("vidljiva");
      } catch (e) {
        const polje = $(".deli__link", m);
        polje.focus();
        polje.select();
        potvrda.textContent = T("inv.prosledi.rucno");
        potvrda.classList.add("vidljiva");
      }
    });
    $(".deli__zatvori", m).focus();
  }

  /* ==========================================================================
     UPRAVLJANJE (samo Zoran, preko ličnog linka sa ključem)
     ========================================================================== */

  async function admin() {
    let kljuc = parametri.get("k") || "";
    try {
      if (kljuc) localStorage.setItem("skroz-admin", kljuc);
      else kljuc = localStorage.getItem("skroz-admin") || "";
    } catch (e) {}
    const veza = parametri.get("veza");
    if (parametri.has("k") || parametri.has("veza")) {
      const ostali = new URLSearchParams(parametri);
      ostali.delete("k");
      ostali.delete("veza");
      history.replaceState(null, "", location.pathname + (ostali.toString() ? "?" + ostali : ""));
    }
    document.body.classList.add("spreman");
    if (!kljuc) return (glavni.innerHTML = stanje(T("adm.naslov"), T("adm.bezKljuca")));

    glavni.innerHTML = stanje(T("adm.naslov"), T("inv.ucitavanje"));
    let d;
    try {
      d = await zahtev("/admin/stanje", { headers: { "X-Kljuc": kljuc } });
    } catch (e) {
      glavni.innerHTML = stanje(T("adm.naslov"), e.status === 401 ? T("adm.pogresanKljuc") : T("inv.nedostupnoNaslov"));
      return;
    }

    const linkZa = (token) => `${location.origin}/investitor.html?p=${token}`;
    const poruka = veza ? `<p class="adm-poruka adm-poruka--${veza === "ok" ? "ok" : "greska"}">${T("adm.veza." + veza)}</p>` : "";
    const povezi = `${API}/auth/pocetak?k=${encodeURIComponent(kljuc)}`;
    const statistika = (x) => `
      <div class="adm-projekat__statistika">
        <span>${T("adm.otvaranja")}: <b>${x.otvaranja}</b></span>
        <span>${T("adm.poslednje")}: <b>${x.poslednje ? esc(datumVreme(x.poslednje)) : T("adm.nikad")}</b></span>
        <span>${T("adm.prosledjenaOtv")}: <b>${x.prosledjenaOtvaranja}</b></span>
        <span>${T("adm.prosledjeno")}: <b>${x.prosledjivanja}</b></span>
        <span class="${x.zahteviOtvoreni ? "adm-crveno" : ""}">${T("oz.zahtevi")}: <b>${x.zahteviOtvoreni}</b> · ${T("adm.reseno")}: <b>${x.zahteviReseni}</b></span>
      </div>`;

    glavni.innerHTML = `
      <section class="sekcija adm">
        <div class="okvir">
          <span class="oznaka">${T("adm.oznaka")}</span>
          <h1 class="naslov-sekcije">${T("adm.naslov")}</h1>
          ${poruka}
          <div class="adm-veza">
            <div>
              <span class="adm-labela">${T("adm.onedrive")}</span>
              <b class="adm-status ${d.povezan ? "adm-status--da" : ""}">${d.povezan ? T("adm.povezan") : T("adm.nijePovezan")}</b>
              ${d.nalog ? `<span class="adm-nalog">${esc(d.nalog)}</span>` : ""}
            </div>
            ${d.podeseno
              ? `<a class="dugme ${d.povezan ? "dugme--tiho" : ""}" href="${esc(povezi)}">${d.povezan ? T("adm.poveziPonovo") : T("adm.povezi")}</a>`
              : `<p class="adm-napomena">${T("adm.nijePodeseno")}</p>`}
          </div>
          ${d.povezan && !d.korenPostoji
            ? `<p class="adm-napomena">${T("adm.korenNema")} <b>${esc(d.koren)}</b> ${T("adm.korenNema2")}</p>`
            : ""}
          ${d.povezan && d.korenPostoji ? `
            <h2 class="adm-podnaslov">${T("adm.projekti")}</h2>
            ${d.projekti.length ? `<ul class="adm-projekti">
              ${d.projekti.map((x) => `
                <li class="adm-projekat" data-folder="${esc(x.folder)}">
                  <div class="adm-projekat__ime"><b>${esc(x.naziv)}</b><span>${T("adm.izmenjeno")}: ${esc(datum(x.izmenjen))}</span></div>
                  <input class="adm-projekat__link" type="text" readonly value="${esc(linkZa(x.token))}" aria-label="Link">
                  <div class="adm-projekat__dugmad">
                    <button class="dugme dugme--malo" type="button" data-kopiraj>${T("adm.kopiraj")}</button>
                    <a class="dugme dugme--malo dugme--tiho" href="${esc(linkZa(x.token))}" target="_blank" rel="noopener">${T("adm.otvori")}</a>
                    <button class="dugme dugme--malo dugme--tiho" type="button" data-novi>${T("adm.noviLink")}</button>
                  </div>
                  ${statistika(x)}
                  <div class="adm-pitanje" hidden>
                    <span>${T("adm.noviLinkPitanje")}</span>
                    <button class="dugme dugme--malo" type="button" data-da>${T("adm.da")}</button>
                    <button class="dugme dugme--malo dugme--tiho" type="button" data-ne>${T("adm.ne")}</button>
                  </div>
                </li>`).join("")}
            </ul>` : `<p class="adm-napomena">${T("adm.nemaProjekata")}</p>`}` : ""}
        </div>
      </section>`;

    $$(".adm-projekat").forEach((li) => {
      const polje = $(".adm-projekat__link", li);
      const pitanje = $(".adm-pitanje", li);
      $("[data-kopiraj]", li).addEventListener("click", async (e) => {
        const b = e.currentTarget;
        try {
          await navigator.clipboard.writeText(polje.value);
        } catch (greska) {
          polje.select();
        }
        b.textContent = T("adm.kopirano");
        setTimeout(() => (b.textContent = T("adm.kopiraj")), 1800);
      });
      $("[data-novi]", li).addEventListener("click", () => (pitanje.hidden = false));
      $("[data-ne]", li).addEventListener("click", () => (pitanje.hidden = true));
      $("[data-da]", li).addEventListener("click", async () => {
        try {
          const r = await zahtev(`/admin/novi-link?folder=${encodeURIComponent(li.dataset.folder)}`, { method: "POST", headers: { "X-Kljuc": kljuc } });
          polje.value = linkZa(r.token);
          $("a.dugme", li).href = linkZa(r.token);
        } catch (e) {}
        pitanje.hidden = true;
      });
    });
  }

  if (strana === "investitor") investitor();
  if (strana === "admin") admin();
})();
