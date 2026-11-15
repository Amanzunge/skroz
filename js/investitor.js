/* ==========================================================================
   skro.z: investitorska stranica (investitor.html) i upravljanje (admin.html)
   Sadržaj dolazi iz Zoranovog OneDrive-a preko servera (folder server/).
   ========================================================================== */
(() => {
  // adresa servera (Cloudflare Worker)
  const API = "https://skroz-api.skroz-api.workers.dev";

  const strana = document.body.dataset.strana;
  if (strana !== "investitor" && strana !== "admin") return;
  const { $, $$, esc, IKONA, pojavi, lightbox, celeSlike, uvodnik, paralaksa, smanjenPokret } = window.SKROZ_UI;
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
  };

  const datum = (iso) =>
    iso ? new Date(iso).toLocaleDateString(en ? "en-GB" : "sr-Latn-RS", { day: "numeric", month: "long", year: "numeric" }) : "";

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

  /* ==========================================================================
     INVESTITORSKA STRANICA
     ========================================================================== */

  async function investitor() {
    const p = new URLSearchParams(location.search).get("p") || "";
    const fajl = (x) => x.url || `${API}/fajl?p=${encodeURIComponent(p)}&id=${encodeURIComponent(x.id)}&v=${x.v}`;
    const slicica = (x, mala) =>
      (mala ? x.mala : x.slicica) || x.url || `${API}/slicica?p=${encodeURIComponent(p)}&id=${encodeURIComponent(x.id)}&v=${x.v}${mala ? "&s=mala" : ""}`;

    glavni.innerHTML = stanje(T("inv.oznaka"), T("inv.ucitavanje"));
    const uvodGotov = new Promise((res) => uvodnik(res));

    let d;
    try {
      d = p === "primer" ? primer() : await zahtev(`/projekat?p=${encodeURIComponent(p)}`);
    } catch (e) {
      await uvodGotov;
      glavni.innerHTML = e.status === 404
        ? stanje(T("rad.greska"), T("inv.nevazeciTekst"), T("inv.nevazeciNaslov"))
        : stanje(T("rad.greska"), T("inv.nedostupnoTekst"), T("inv.nedostupnoNaslov"));
      document.body.classList.add("spreman");
      return;
    }

    document.title = `${d.naziv} | skro.z`;
    const sekcije = d.sekcije.filter((s) => s.stavke.length);
    const sveSlike = sekcije.filter((s) => s.vrsta !== "panorame").flatMap((s) => s.stavke.filter((x) => x.vrsta === "slika"));
    const naslovna = (sekcije.find((s) => s.vrsta === "renderi") || {}).stavke?.find((x) => x.vrsta === "slika") || sveSlike[0];

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
            ${sekcije.map((s, i) => `<div><a href="#s${i}"><span>${esc(naslovSekcije(s))}</span><b>${s.stavke.length}</b></a></div>`).join("")}
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

    const galerija = (stavke, i) => `
      <div class="galerija" data-galerija="${i}">
        ${stavke.map((x, k) => `
          <button class="galerija__stavka" type="button" data-pojavi="slika" data-indeks="${k}" style="--kasni:${k % 3 === 2 ? 0.12 : 0}s" aria-label="${T("rad.uvecaj")} ${k + 1}">
            <span class="otkrij" style="display:block;width:100%;height:100%"><img src="${esc(slicica(x))}" alt="${esc(x.naziv)}" loading="lazy"></span>
          </button>`).join("")}
      </div>`;

    const dokumenti = (stavke) => `
      <div class="dokumenti">
        ${stavke.map((x) => {
          const pdf = x.vrsta === "pdf";
          const unutra = `
            <span class="dok__slika">${pdf ? `<img src="${esc(slicica(x))}" alt="" loading="lazy" onerror="this.parentNode.classList.add('bez-slike')">` : ""}${pdf ? IKONE.pdf : IKONE.fajl}</span>
            <span class="dok__ime">${esc(x.naziv)}</span>
            <span class="dok__datum">${T("inv.azuriranoKratko")}: ${esc(datum(x.izmenjen))}</span>`;
          return pdf
            ? `<button class="dok" type="button" data-pojavi data-pdf="${esc(x.id)}">${unutra}</button>`
            : `<a class="dok" data-pojavi href="${esc(fajl(x))}" target="_blank" rel="noopener">${unutra}</a>`;
        }).join("")}
      </div>`;

    const panorame = [];
    sekcije.forEach((s, i) => {
      const slike = s.stavke.filter((x) => x.vrsta === "slika");
      const ostali = s.stavke.filter((x) => x.vrsta !== "slika");
      if (s.vrsta === "panorame") {
        const prva = !panorame.length;
        panorame.push(...slike);
        if (!prva) return;
        html += `
          <section class="sekcija pano-sekcija${pozadina()}" id="s${i}">
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
      const uvod = s.vrsta === "dokumentacija" ? T("inv.dokumentacijaUvod") : s.vrsta === "onsite" ? T("inv.onsiteUvod") : slike.length ? T("inv.slikeUvod") : "";
      html += `
        <section class="sekcija${pozadina()}" id="s${i}">
          <div class="okvir">
            ${glava(s.vrsta === "ostalo" ? T("inv.ostalo") : T("inv.oznaka"), naslov, uvod)}
            ${s.vrsta === "dokumentacija" ? dokumenti(s.stavke) : `${slike.length ? galerija(slike, i) : ""}${ostali.length ? dokumenti(ostali) : ""}`}
          </div>
        </section>`;
    });
    if (!sekcije.length) html += stanje(T("inv.oznaka"), T("inv.prazno"));

    html += `
      <section class="sekcija inv-prosledi${pozadina()}">
        <div class="okvir inv-prosledi__unutra">
          <p>${esc(d.naziv)}</p>
          <button class="dugme" type="button" data-prosledi>${IKONE.link}<span>${T("inv.prosledi")}</span></button>
        </div>
      </section>`;

    glavni.innerHTML = html;

    // galerije: sličica u pločici, cela slika kad se otvori
    sekcije.forEach((s, i) => {
      if (s.vrsta === "panorame") return;
      const kutija = $(`[data-galerija="${i}"]`);
      if (!kutija) return;
      const slike = s.stavke.filter((x) => x.vrsta === "slika");
      lightbox(slike.map(fajl), d.naziv, kutija);
      celeSlike(kutija);
    });

    // 360°: isti pregledač kao na stranici rada
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

    // dokumenti
    const svi = sekcije.flatMap((s) => s.stavke);
    $$("[data-pdf]").forEach((b) => b.addEventListener("click", () => {
      const x = svi.find((y) => y.id === b.dataset.pdf);
      if (x) otvoriPdf(x, fajl(x));
    }));

    $("[data-prosledi]").addEventListener("click", () => prosledi(d.naziv));
    paralaksa($(".rad-hero__slika"));
    pojavi();
    await uvodGotov;
    document.body.classList.add("spreman");
  }

  // primer projekta (?p=primer): javne slike sa sajta, da se vidi kako stranica izgleda
  function primer() {
    const S = window.SKROZ;
    const nadji = (id) => S.radovi.find((r) => r.id === id) || S.radovi[0];
    const danas = new Date().toISOString();
    const slika = (url, naziv, i) => ({ id: "p" + i + naziv, naziv, vrsta: "slika", url, izmenjen: danas });
    const vik = nadji("vikendica-bezdan");
    const stan = nadji("enterijer-4s");
    return {
      naziv: en ? "Example project" : "Primer projekta",
      azurirano: danas,
      sekcije: [
        { vrsta: "renderi", naziv: "Renderi", stavke: vik.slike.slice(0, 6).map((u, i) => slika(u, `Render ${i + 1}`, i)) },
        { vrsta: "panorame", naziv: "360 panorame", stavke: vik.panorame.slice(0, 4).map((x, i) => ({ ...slika(x.slika, `Pogled ${i + 1}`, i), mala: x.slicica })) },
        { vrsta: "dokumentacija", naziv: "Dokumentacija", stavke: [
          { id: "d1", naziv: en ? "Facades and sections" : "Fasade i preseci", vrsta: "pdf", url: "slike/primer/primer.pdf", slicica: "slike/primer/primer.jpg", izmenjen: danas },
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

  /* ---------- PDF pregledač ---------- */

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

  async function otvoriPdf(x, adresa) {
    const fokus = document.activeElement;
    const m = document.createElement("div");
    m.className = "pdf";
    m.setAttribute("role", "dialog");
    m.setAttribute("aria-modal", "true");
    m.setAttribute("aria-label", x.naziv);
    m.innerHTML = `
      <div class="pdf__vrh">
        <div class="pdf__naslov"><b>${esc(x.naziv)}</b><span>${T("inv.azuriranoKratko")}: ${esc(datum(x.izmenjen))}<i class="pdf__broj"></i></span></div>
        <div class="pdf__alati">
          <button type="button" data-zum="-1" aria-label="${T("pdf.umanji")}">−</button>
          <span class="pdf__zum">100%</span>
          <button type="button" data-zum="1" aria-label="${T("pdf.uvecaj")}">+</button>
          <button type="button" class="pdf__zatvori">${T("inv.zatvori")} ${IKONE.zatvori}</button>
        </div>
      </div>
      <div class="pdf__strane" tabindex="0"><p class="pdf__poruka">${T("pdf.ucitavanje")}</p></div>`;
    document.body.append(m);
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => m.classList.add("otvoren"));
    const strane = $(".pdf__strane", m);
    let zum = 1;
    let dokument = null;
    let posmatrac = null;
    const iscrtane = new Map();

    const zatvori = () => {
      posmatrac && posmatrac.disconnect();
      dokument && dokument.destroy();
      m.remove();
      document.documentElement.style.overflow = "";
      removeEventListener("keydown", tastatura);
      fokus && fokus.focus();
    };
    const tastatura = (e) => e.key === "Escape" && zatvori();
    addEventListener("keydown", tastatura);
    $(".pdf__zatvori", m).addEventListener("click", zatvori);
    $(".pdf__zatvori", m).focus();

    try {
      const lib = await ucitajPdfJs();
      dokument = await lib.getDocument({ url: adresa, disableRange: true, disableStream: true }).promise;
    } catch (e) {
      strane.innerHTML = `<p class="pdf__poruka">${T("pdf.greska")}</p>`;
      return;
    }
    $(".pdf__broj", m).textContent = ` · ${brojStrana(dokument.numPages)}`;

    const sirinaStrane = () => Math.min(strane.clientWidth - 32, 1200) * zum;
    const prikazi = async () => {
      strane.innerHTML = "";
      iscrtane.clear();
      posmatrac && posmatrac.disconnect();
      posmatrac = new IntersectionObserver((unosi) => unosi.forEach((u) => u.isIntersecting && iscrtaj(u.target)), { root: strane, rootMargin: "600px 0px" });
      for (let n = 1; n <= dokument.numPages; n++) {
        const s = await dokument.getPage(n);
        const v = s.getViewport({ scale: 1 });
        const kutija = document.createElement("div");
        kutija.className = "pdf__strana";
        kutija.dataset.n = n;
        kutija.style.width = `${sirinaStrane()}px`;
        kutija.style.aspectRatio = `${v.width} / ${v.height}`;
        kutija.setAttribute("aria-label", `${T("pdf.strana")} ${n}`);
        strane.append(kutija);
        posmatrac.observe(kutija);
      }
    };
    const iscrtaj = async (kutija) => {
      const n = Number(kutija.dataset.n);
      if (iscrtane.get(n) === zum) return;
      iscrtane.set(n, zum);
      const s = await dokument.getPage(n);
      const v1 = s.getViewport({ scale: 1 });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const skala = Math.min((kutija.clientWidth * dpr) / v1.width, 4096 / v1.width);
      const v = s.getViewport({ scale: skala });
      const platno = document.createElement("canvas");
      platno.width = Math.floor(v.width);
      platno.height = Math.floor(v.height);
      await s.render({ canvasContext: platno.getContext("2d"), viewport: v }).promise;
      kutija.replaceChildren(platno);
    };
    $$("[data-zum]", m).forEach((b) => b.addEventListener("click", () => {
      zum = Math.min(3, Math.max(0.5, Math.round((zum + Number(b.dataset.zum) * 0.25) * 100) / 100));
      $(".pdf__zum", m).textContent = `${Math.round(zum * 100)}%`;
      prikazi();
    }));
    await prikazi();
  }

  /* ---------- PROSLEDI ---------- */

  function prosledi(naziv) {
    const fokus = document.activeElement;
    const link = location.href.split("#")[0];
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
          <a class="deli__opcija" href="viber://forward?text=${encodeURIComponent(poruka)}">${IKONE.viber}<span>Viber</span></a>
          <a class="deli__opcija" href="https://wa.me/?text=${encodeURIComponent(poruka)}" target="_blank" rel="noopener">${IKONE.whatsapp}<span>WhatsApp</span></a>
          <a class="deli__opcija" href="mailto:?subject=${encodeURIComponent(naziv + " | skro.z")}&body=${encodeURIComponent(poruka)}">${IKONE.mejl}<span>${T("inv.prosledi.mejl")}</span></a>
          <button class="deli__opcija" type="button" data-kopiraj>${IKONE.link}<span>${T("inv.prosledi.kopiraj")}</span></button>
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
    const parametri = new URLSearchParams(location.search);
    let kljuc = parametri.get("k") || "";
    try {
      if (kljuc) localStorage.setItem("skroz-admin", kljuc);
      else kljuc = localStorage.getItem("skroz-admin") || "";
    } catch (e) {}
    const veza = parametri.get("veza");
    if (parametri.has("k") || parametri.has("veza")) {
      parametri.delete("k");
      parametri.delete("veza");
      history.replaceState(null, "", location.pathname + (parametri.toString() ? "?" + parametri : ""));
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
