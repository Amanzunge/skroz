/* ==========================================================================
   skro.z: logika sajta
   Sadržaj se menja u fajlu sadrzaj.js, ovde ne treba ništa dirati.
   ========================================================================== */
(() => {
  const S = window.SKROZ;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (t = "") =>
    String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const smanjenPokret = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const strana = document.body.dataset.strana;

  const IKONA = {
    strelica: '<svg viewBox="0 0 34 10" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><path d="M0 5h33M28.5.5 33 5l-4.5 4.5"/></svg>',
    nazad: '<svg viewBox="0 0 34 10" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><path d="M34 5H1M5.5.5 1 5l4.5 4.5"/></svg>',
    levo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M15 4 7 12l8 8"/></svg>',
    desno: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="m9 4 8 8-8 8"/></svg>',
    pano: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><ellipse cx="12" cy="12" rx="10" ry="4.2"/><path d="M12 2c3 2.6 3 17.4 0 20M12 2c-3 2.6-3 17.4 0 20"/></svg>',
    poredi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M9 6 3 12l6 6M15 6l6 6-6 6"/></svg>',
    ruka: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 26V11.5a3 3 0 0 1 6 0V24"/><path d="M25 22.5v-2a3 3 0 0 1 6 0V25"/><path d="M31 23a3 3 0 0 1 6 0v6.5C37 37 32 42 25.5 42h-1c-4.4 0-7.2-1.7-9.6-4.6L9.6 31a3 3 0 0 1 4.3-4.2L19 31"/><path d="M6 12h7M8.5 9.5 6 12l2.5 2.5M42 12h-7m4.5-2.5L42 12l-2.5 2.5"/></svg>',
  };

  const nadjiRad = (id) => S.radovi.find((r) => r.id === id);
  const linkRada = (id) => `rad.html?id=${encodeURIComponent(id)}`;
  const metaRada = (r) => [r.lokacija, r.datum].filter(Boolean).map(esc).join(" · ");
  const broj = (i) => String(i + 1).padStart(2, "0");

  /* ---------- Zajedničko: logo, meni, kontakt, podnožje ---------- */

  function popuniZajednicko() {
    $$("[data-ime]").forEach((el) => (el.textContent = S.ime));
    $$("[data-godina]").forEach((el) => (el.textContent = new Date().getFullYear()));

    const k = S.kontakt;
    const mob = $(".mob-meni__kontakt");
    if (mob) {
      mob.innerHTML = [
        k.telefon && `<a href="tel:${esc(k.telefon.replace(/[^\d+]/g, ""))}">${esc(k.telefon)}</a>`,
        k.email && `<a href="mailto:${esc(k.email)}">${esc(k.email)}</a>`,
      ].filter(Boolean).join("");
    }
    const linkovi = $(".podnozje__linkovi");
    if (linkovi) {
      linkovi.innerHTML = [
        k.email && `<a href="mailto:${esc(k.email)}">${esc(k.email)}</a>`,
        k.instagram && `<a href="${esc(k.instagram)}" target="_blank" rel="noopener">Instagram</a>`,
        `<a href="#vrh" data-na-vrh>Na vrh ↑</a>`,
      ].filter(Boolean).join("");
    }
  }

  function zaglavlje() {
    const z = $(".zaglavlje");
    let prosli = scrollY;
    const azuriraj = () => {
      const y = scrollY;
      z.classList.toggle("je-pune", y > 40);
      const meniOtvoren = document.body.classList.contains("meni-otvoren");
      if (!meniOtvoren) z.classList.toggle("je-skriveno", y > prosli && y > 500);
      prosli = y;
    };
    addEventListener("scroll", azuriraj, { passive: true });
    azuriraj();
  }

  function mobilniMeni() {
    const dugme = $(".meni-dugme");
    if (!dugme) return;
    const postavi = (otvoren) => {
      document.body.classList.toggle("meni-otvoren", otvoren);
      dugme.setAttribute("aria-expanded", String(otvoren));
      $(".meni-dugme__tekst").textContent = otvoren ? "Zatvori" : "Meni";
      document.documentElement.style.overflow = otvoren ? "hidden" : "";
    };
    dugme.addEventListener("click", () => postavi(!document.body.classList.contains("meni-otvoren")));
    $$(".mob-meni a").forEach((a) => a.addEventListener("click", () => postavi(false)));
    addEventListener("keydown", (e) => e.key === "Escape" && postavi(false));
    addEventListener("resize", () => innerWidth > 860 && postavi(false));
  }

  // Blagi prelaz (zatamnjenje) kada se ide na drugu stranicu
  function prelaziStranica() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      if (a.hasAttribute("data-na-vrh")) {
        e.preventDefault();
        scrollTo({ top: 0, behavior: smanjenPokret ? "auto" : "smooth" });
        return;
      }
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      const istaStrana = url.pathname === location.pathname && url.search === location.search;
      if (istaStrana) return; // samo skrol do sekcije
      e.preventDefault();
      document.body.classList.add("odlazi");
      setTimeout(() => (location.href = url.href), smanjenPokret ? 0 : 420);
    });
    addEventListener("pageshow", (e) => e.persisted && document.body.classList.remove("odlazi"));
  }

  /* ---------- Animacije pri skrolovanju ---------- */

  function podeliReci(el) {
    if (el.dataset.podeljeno) return;
    el.dataset.podeljeno = "1";
    const reci = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.innerHTML = reci
      .map((r, i) => `<span class="rec-maska" aria-hidden="true"><span style="--i:${i}">${esc(r)}</span></span>`)
      .join(" ");
  }

  let posmatrac;
  function pojavi() {
    $$("[data-reci]").forEach(podeliReci);
    const elementi = $$("[data-pojavi]:not(.vidljivo), [data-reci]:not(.vidljivo)");
    if (smanjenPokret || !("IntersectionObserver" in window)) {
      elementi.forEach((el) => el.classList.add("vidljivo"));
      return;
    }
    posmatrac ??= new IntersectionObserver(
      (unosi) => unosi.forEach((u) => {
        if (u.isIntersecting) {
          u.target.classList.add("vidljivo");
          posmatrac.unobserve(u.target);
        }
      }),
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    elementi.forEach((el) => posmatrac.observe(el));
  }

  // Kružni kursor "Pogledaj" iznad radova (samo na računaru)
  function kursor() {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches || smanjenPokret) return;
    const k = document.createElement("div");
    k.className = "kursor";
    k.textContent = "Pogledaj";
    k.setAttribute("aria-hidden", "true");
    document.body.append(k);
    let x = -200, y = -200, kx = -200, ky = -200, s = 0, ks = 0;
    addEventListener("mousemove", (e) => {
      x = e.clientX;
      y = e.clientY;
      const naRadu = !!e.target.closest?.(".rad .rad__slika, .sledeci");
      s = naRadu ? 1 : 0;
      k.classList.toggle("vidljiv", naRadu);
    }, { passive: true });
    const petlja = () => {
      kx += (x - kx) * 0.18;
      ky += (y - ky) * 0.18;
      ks += (s - ks) * 0.2;
      k.style.transform = `translate3d(${kx}px, ${ky}px, 0) scale(${ks.toFixed(3)})`;
      requestAnimationFrame(petlja);
    };
    petlja();
  }

  /* ==========================================================================
     POČETNA
     ========================================================================== */

  function slajder() {
    const hero = $(".hero");
    const kutija = $(".hero__slajdovi");
    const slajdovi = S.slajder.length ? S.slajder : S.radovi.map((r) => ({ slika: r.naslovna, naslov: r.naslov, rad: r.id }));
    const trajanje = Math.max(2, Number(S.slajderSekundi) || 5) * 1000;
    hero.style.setProperty("--trajanje", trajanje + "ms");

    kutija.innerHTML = slajdovi
      .map((s, i) => `<div class="slajd${i === 0 ? " je-aktivan" : ""}"><img src="${esc(s.slika)}" alt="${esc(s.naslov || "")}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}></div>`)
      .join("");
    const trake = $(".hero__trake");
    trake.innerHTML = slajdovi
      .map((_, i) => `<button class="traka" type="button" aria-label="Slika ${i + 1}"><i></i></button>`)
      .join("");

    const el = $$(".slajd", kutija);
    const tr = $$(".traka", trake);
    const brojac = $(".hero__brojac");
    const natpis = $(".hero__natpis");
    let trenutni = 0;
    let tajmer;

    const azurirajNatpis = (s) => {
      natpis.classList.add("menja");
      setTimeout(() => {
        const rad = s.rad && nadjiRad(s.rad);
        natpis.innerHTML = `<span>${esc(s.naslov || "")}${rad && rad.lokacija ? " · " + esc(rad.lokacija.split(",")[0]) : ""}</span>${rad ? IKONA.strelica : ""}`;
        natpis.setAttribute("href", rad ? linkRada(rad.id) : "#radovi");
        natpis.classList.remove("menja");
      }, 300);
    };

    const oznaci = () => {
      tr.forEach((t, i) => {
        t.classList.remove("je-aktivna");
        t.classList.toggle("je-prosla", i < trenutni);
      });
      void trake.offsetWidth; // restart animacije trake
      tr[trenutni].classList.add("je-aktivna");
      brojac.innerHTML = `<b>${broj(trenutni)}</b> / ${broj(slajdovi.length - 1)}`;
    };

    const idi = (n) => {
      n = (n + slajdovi.length) % slajdovi.length;
      if (n === trenutni) return;
      const stari = el[trenutni];
      const img = $("img", stari);
      // zadrži trenutni zum stare slike dok je nova prekriva
      img.style.transform = getComputedStyle(img).transform;
      img.style.transition = "none";
      el.forEach((s) => s.classList.remove("odlazi"));
      stari.classList.remove("je-aktivan");
      stari.classList.add("odlazi");
      trenutni = n;
      el[n].classList.add("je-aktivan");
      setTimeout(() => {
        if (!stari.classList.contains("je-aktivan")) {
          stari.classList.remove("odlazi");
          img.style.transform = "";
          img.style.transition = "";
        }
      }, 1600);
      oznaci();
      azurirajNatpis(slajdovi[n]);
      zakazi();
    };

    const zakazi = () => {
      clearTimeout(tajmer);
      if (slajdovi.length > 1) tajmer = setTimeout(() => idi(trenutni + 1), trajanje);
    };

    tr.forEach((t, i) => t.addEventListener("click", () => idi(i)));

    // prevlačenje prstom
    let pocetakX = null;
    hero.addEventListener("touchstart", (e) => (pocetakX = e.touches[0].clientX), { passive: true });
    hero.addEventListener("touchend", (e) => {
      if (pocetakX === null) return;
      const dx = e.changedTouches[0].clientX - pocetakX;
      if (Math.abs(dx) > 50) idi(trenutni + (dx < 0 ? 1 : -1));
      pocetakX = null;
    });

    // pauza kad kartica nije vidljiva
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        clearTimeout(tajmer);
        hero.classList.add("pauza");
      } else {
        hero.classList.remove("pauza");
        oznaci();
        zakazi();
      }
    });

    oznaci();
    azurirajNatpis(slajdovi[0]);
    return () => {
      oznaci();
      zakazi();
    };
  }

  function radovi() {
    $(".radovi").innerHTML = S.radovi
      .map((r, i) => `
        <a class="rad" href="${linkRada(r.id)}" data-pojavi="slika" style="--kasni:${(i % 2) * 0.12}s">
          <div class="rad__slika otkrij">
            <img src="${esc(r.naslovna)}" alt="${esc(r.naslov)}" loading="lazy">
            ${r.panorame && r.panorame.length ? `<span class="znacka">${IKONA.pano}360°</span>` : ""}
            <span class="rad__pogledaj">Pogledaj ${IKONA.strelica}</span>
          </div>
          <div class="rad__info">
            <span class="rad__broj">${broj(i)}</span>
            <h3 class="rad__naslov">${esc(r.naslov)}</h3>
            <p class="rad__meta">${metaRada(r)}</p>
          </div>
        </a>`)
      .join("");
  }

  function usluge() {
    $(".usluge__uvod").textContent = S.usluge.uvod;
    $(".usluge__lista").innerHTML = S.usluge.stavke
      .map((u, i) => `
        <li class="usluga" data-pojavi style="--kasni:${Math.min(i, 4) * 0.06}s">
          <span class="usluga__broj">${broj(i)}</span>
          <h3 class="usluga__naslov">${esc(u.naslov)}</h3>
          <p class="usluga__tekst">${esc(u.tekst)}</p>
        </li>`)
      .join("");
  }

  function oMeni() {
    const figura = $(".o-meni__slika");
    if (S.oMeni.slika) $("img", figura).src = S.oMeni.slika;
    else figura.remove();
    const ist = $(".o-meni__istaknuto");
    const reci = S.oMeni.istaknuto.trim().split(/\s+/);
    ist.setAttribute("aria-label", S.oMeni.istaknuto);
    ist.innerHTML = reci.map((r) => `<span class="rec" aria-hidden="true">${esc(r)}</span>`).join(" ");
    $(".o-meni__tekst").innerHTML = S.oMeni.tekst.map((p) => `<p>${esc(p)}</p>`).join("");

    // reči se "pale" jedna po jedna dok se skroluje
    const elReci = $$(".rec", ist);
    if (smanjenPokret) return elReci.forEach((r) => r.classList.add("upaljena"));
    let zakazano = false;
    const azuriraj = () => {
      zakazano = false;
      const r = ist.getBoundingClientRect();
      const vh = innerHeight;
      const napredak = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.4)));
      const n = Math.round(napredak * elReci.length);
      elReci.forEach((el, i) => el.classList.toggle("upaljena", i < n));
    };
    addEventListener("scroll", () => {
      if (!zakazano) {
        zakazano = true;
        requestAnimationFrame(azuriraj);
      }
    }, { passive: true });
    azuriraj();
  }

  function kontakt() {
    const k = S.kontakt;
    $(".kontakt__naslov").textContent = k.naslov;
    $(".kontakt__tekst").textContent = k.tekst;
    const stavke = [
      k.telefon && ["Telefon", `<a href="tel:${esc(k.telefon.replace(/[^\d+]/g, ""))}">${esc(k.telefon)}</a>`],
      k.email && ["Email", `<a href="mailto:${esc(k.email)}">${esc(k.email)}</a>`],
      k.adresa && ["Studio", `<p>${esc(k.adresa)}</p>`],
      k.instagram && ["Instagram", `<a href="${esc(k.instagram)}" target="_blank" rel="noopener">${esc(k.instagramIme || "Instagram")}</a>`],
    ].filter(Boolean);
    $(".kontakt__stavke").innerHTML = stavke
      .map(([naziv, html], i) => `<div class="kontakt__stavka" data-pojavi style="--kasni:${i * 0.08}s"><span>${naziv}</span>${html}</div>`)
      .join("");
    const f = S.firma;
    const firma = $(".kontakt__firma");
    if (f && f.naziv) {
      firma.innerHTML = [
        `<span>${esc(f.naziv)}</span>`,
        f.pib && `<span>PIB: ${esc(f.pib)}</span>`,
        f.mb && `<span>MB: ${esc(f.mb)}</span>`,
      ].filter(Boolean).join("");
    } else firma.remove();
  }

  // Označava u meniju sekciju koja je trenutno na ekranu
  function aktivniMeni() {
    const linkovi = $$(".meni a");
    const sekcije = linkovi.map((a) => $(a.hash)).filter(Boolean);
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((unosi) => {
      unosi.forEach((u) => {
        if (u.isIntersecting) linkovi.forEach((a) => a.classList.toggle("je-aktivan", a.hash === "#" + u.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sekcije.forEach((s) => io.observe(s));
    $(".hero") && new IntersectionObserver(([u]) => u.isIntersecting && linkovi.forEach((a) => a.classList.remove("je-aktivan")), { threshold: 0.6 }).observe($(".hero"));
  }

  function uvodnik(posle) {
    const u = $(".uvodnik");
    let video = false;
    try { video = sessionStorage.getItem("skroz-uvod") === "1"; } catch (e) {}
    if (!u || video || smanjenPokret) {
      u && u.remove();
      return posle();
    }
    try { sessionStorage.setItem("skroz-uvod", "1"); } catch (e) {}
    setTimeout(() => {
      u.classList.add("je-gotov");
      setTimeout(posle, 350);
      setTimeout(() => u.remove(), 1100);
    }, 1800);
  }

  function pocetna() {
    $(".hero__opis").textContent = S.opisPocetna;
    const kreniSlajder = slajder();
    radovi();
    usluge();
    oMeni();
    kontakt();
    aktivniMeni();
    pojavi();
    uvodnik(() => {
      document.body.classList.add("spreman");
      kreniSlajder();
    });
  }

  /* ==========================================================================
     STRANICA RADA
     ========================================================================== */

  function stranicaRada() {
    const id = new URLSearchParams(location.search).get("id");
    const indeks = S.radovi.findIndex((r) => r.id === id);
    const glavni = $("main");

    if (indeks < 0) {
      document.title = `Rad nije pronađen | ${S.ime}`;
      glavni.innerHTML = `
        <section class="sekcija"><div class="okvir" style="padding-top:var(--zaglavlje)">
          <span class="oznaka">Greška</span>
          <h1 class="naslov-sekcije" style="margin:26px 0 32px">Rad nije pronađen</h1>
          <a class="strelica-link" href="index.html#radovi">Pogledajte sve radove ${IKONA.strelica}</a>
        </div></section>`;
      return;
    }

    const r = S.radovi[indeks];
    const sledeci = S.radovi[(indeks + 1) % S.radovi.length];
    const slike = r.slike && r.slike.length ? r.slike : [r.naslovna];
    const panorame = r.panorame || [];
    const opis = Array.isArray(r.opis) ? r.opis : String(r.opis || "").split(/\n+/);
    const pasusi = opis.map((t) => t.trim()).filter(Boolean);
    const pp = r.preIPosle && r.preIPosle.pre && r.preIPosle.posle ? r.preIPosle : null;
    let brojSekcija = 0;
    const pozadina = () => (brojSekcija++ % 2 ? " sekcija--siva" : "");
    document.title = `${r.naslov} | ${S.ime}`;
    window.SKROZ_RAD = r;

    glavni.innerHTML = `
      <section class="rad-hero">
        <div class="rad-hero__slika"><img src="${esc(r.naslovna)}" alt="${esc(r.naslov)}" fetchpriority="high"></div>
        <div class="okvir rad-hero__sadrzaj">
          <a class="nazad" href="index.html#radovi">${IKONA.nazad} Svi radovi</a>
          <h1 class="rad-hero__naslov"><span class="maska"><span>${esc(r.naslov)}</span></span></h1>
          <div class="rad-hero__meta">
            ${r.lokacija ? `<div><span>Lokacija</span><b>${esc(r.lokacija)}</b></div>` : ""}
            ${r.datum ? `<div><span>Datum</span><b>${esc(r.datum)}</b></div>` : ""}
            ${pasusi.length ? `<div class="rad-hero__opis"><span>Opis</span>${pasusi.map((t) => `<p>${esc(t)}</p>`).join("")}</div>` : ""}
          </div>
        </div>
      </section>

      ${pp ? `
      <section class="sekcija${pozadina()}">
        <div class="okvir">
          <div class="sekcija__glava">
            <span class="oznaka" data-pojavi>Transformacija</span>
            <h2 class="naslov-sekcije" data-reci>Pre i posle</h2>
            <p class="uvod" data-pojavi>Pomerajte liniju levo-desno da uporedite.</p>
          </div>
          <div class="pre-posle" data-pojavi>
            <img src="${esc(pp.posle)}" alt="${esc(r.naslov)}, posle" loading="lazy">
            <img class="pre-posle__pre" src="${esc(pp.pre)}" alt="${esc(r.naslov)}, pre" loading="lazy">
            <span class="pre-posle__oznaka pre-posle__oznaka--pre">Pre</span>
            <span class="pre-posle__oznaka pre-posle__oznaka--posle">Posle</span>
            <span class="pre-posle__linija"></span>
            <span class="pre-posle__rucka">${IKONA.poredi}</span>
            <input type="range" min="0" max="100" step="0.1" value="50" aria-label="Poređenje: pre i posle">
          </div>
        </div>
      </section>` : ""}

      <section class="sekcija${pozadina()}">
        <div class="okvir">
          <div class="sekcija__glava">
            <span class="oznaka" data-pojavi>Galerija</span>
            <h2 class="naslov-sekcije" data-reci>Fotografije</h2>
            <p class="uvod" data-pojavi>Kliknite na sliku da je uvećate.</p>
          </div>
          <div class="galerija">
            ${slike.map((s, i) => `
              <button class="galerija__stavka" type="button" data-pojavi="slika" data-indeks="${i}" style="--kasni:${(i % 3 === 2 ? 0.12 : 0)}s" aria-label="Uvećaj sliku ${i + 1}">
                <span class="otkrij" style="display:block;width:100%;height:100%"><img src="${esc(s)}" alt="${esc(r.naslov)}, slika ${i + 1}" loading="lazy"></span>
              </button>`).join("")}
          </div>
        </div>
      </section>

      ${panorame.length ? `
      <section class="sekcija pano-sekcija${pozadina()}" id="pano">
        <div class="okvir">
          <div class="sekcija__glava">
            <span class="oznaka" data-pojavi>360° pogled</span>
            <h2 class="naslov-sekcije" data-reci>Prošetajte kroz prostor</h2>
            <p class="uvod" data-pojavi>Prevucite mišem ili prstom da se okrenete. ${panorame.length > 1 ? "Ispod izaberite prostoriju." : ""}</p>
          </div>
          <div class="pano" data-pojavi>
            <div class="pano__pregledac" id="pano-pregledac"></div>
            <div class="pano__savet">${IKONA.ruka}<span>Prevucite da pogledate okolo</span></div>
          </div>
          ${panorame.length > 1 ? `<div class="pano__sobe" role="tablist" aria-label="Prostorije">
            ${panorame.map((p, i) => `
              <button class="soba${i === 0 ? " je-aktivna" : ""}" type="button" role="tab" aria-selected="${i === 0}" data-soba="${i}">
                <span class="soba__slika"><img src="${esc(p.slicica || p.slika)}" alt="" loading="lazy"></span>
                <span class="soba__ime">${esc(p.naziv || "Prostorija " + (i + 1))}</span>
              </button>`).join("")}
          </div>` : ""}
        </div>
      </section>` : ""}

      ${sledeci && sledeci.id !== r.id ? `
      <a class="sledeci" href="${linkRada(sledeci.id)}">
        <div class="sledeci__slika"><img src="${esc(sledeci.naslovna)}" alt="" loading="lazy"></div>
        <div class="okvir sledeci__sadrzaj">
          <span class="oznaka">Sledeći rad</span>
          <div class="sledeci__naslov"><span>${esc(sledeci.naslov)}</span>${IKONA.strelica}</div>
        </div>
      </a>` : ""}
    `;

    lightbox(slike, r.naslov);
    celeSlike();
    prePosle();
    paralaksa($(".rad-hero__slika"));
    pojavi();
    requestAnimationFrame(() => setTimeout(() => document.body.classList.add("spreman"), 60));
  }

  // uspravne fotografije i dugački crteži se ne seku u pločicama galerije
  function celeSlike() {
    $$(".galerija__stavka img").forEach((img) => {
      const proveri = () => {
        const odnos = img.naturalWidth / img.naturalHeight;
        if (odnos && (odnos < 1.15 || odnos > 2.4)) img.classList.add("cela");
      };
      img.complete ? proveri() : img.addEventListener("load", proveri, { once: true });
    });
  }

  function prePosle() {
    const el = $(".pre-posle");
    if (!el) return;
    const klizac = $("input", el);
    klizac.addEventListener("input", () => {
      el.classList.remove("nagovestaj");
      el.style.setProperty("--x", klizac.value + "%");
    });
    el.addEventListener("animationend", () => el.classList.remove("nagovestaj"));
    // jednom pomeri liniju levo-desno da se vidi da može da se vuče
    if (smanjenPokret || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(([u], io) => {
      if (!u.isIntersecting) return;
      el.classList.add("nagovestaj");
      io.disconnect();
    }, { threshold: 0.6 }).observe(el);
  }

  function paralaksa(el) {
    if (!el || smanjenPokret) return;
    let zakazano = false;
    addEventListener("scroll", () => {
      if (zakazano) return;
      zakazano = true;
      requestAnimationFrame(() => {
        zakazano = false;
        const y = Math.min(scrollY, innerHeight);
        el.style.transform = `translate3d(0, ${y * 0.25}px, 0)`;
      });
    }, { passive: true });
  }

  function lightbox(slike, naslov) {
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Uvećana slika");
    lb.innerHTML = `
      <div class="lightbox__vrh"><span class="lightbox__brojac"></span>
        <button class="lightbox__zatvori" type="button">Zatvori <i></i></button></div>
      <div class="lightbox__scena">
        <img alt="">
        ${slike.length > 1 ? `<button class="lightbox__strelica lightbox__strelica--levo" type="button" aria-label="Prethodna slika">${IKONA.levo}</button>
        <button class="lightbox__strelica lightbox__strelica--desno" type="button" aria-label="Sledeća slika">${IKONA.desno}</button>` : ""}
      </div>
      <div class="lightbox__dno"></div>`;
    document.body.append(lb);

    const img = $("img", lb);
    const brojac = $(".lightbox__brojac", lb);
    let i = 0;
    let poslednjiFokus;

    const prikazi = (n, odmah) => {
      i = (n + slike.length) % slike.length;
      brojac.textContent = `${broj(i)} / ${broj(slike.length - 1)}`;
      if (odmah) {
        img.src = slike[i];
        img.alt = `${naslov}, slika ${i + 1}`;
        return;
      }
      img.classList.add("menja");
      setTimeout(() => {
        img.src = slike[i];
        img.alt = `${naslov}, slika ${i + 1}`;
        const pokazi = () => img.classList.remove("menja");
        img.complete ? pokazi() : (img.onload = pokazi);
      }, 220);
    };
    const otvori = (n) => {
      poslednjiFokus = document.activeElement;
      prikazi(n, true);
      lb.classList.add("otvoren");
      document.documentElement.style.overflow = "hidden";
      $(".lightbox__zatvori", lb).focus();
    };
    const zatvori = () => {
      lb.classList.remove("otvoren");
      document.documentElement.style.overflow = "";
      poslednjiFokus && poslednjiFokus.focus();
    };

    $$(".galerija__stavka").forEach((b) => b.addEventListener("click", () => otvori(Number(b.dataset.indeks))));
    $(".lightbox__zatvori", lb).addEventListener("click", zatvori);
    $(".lightbox__strelica--levo", lb)?.addEventListener("click", () => prikazi(i - 1));
    $(".lightbox__strelica--desno", lb)?.addEventListener("click", () => prikazi(i + 1));
    $(".lightbox__scena", lb).addEventListener("click", (e) => e.target === e.currentTarget && zatvori());
    addEventListener("keydown", (e) => {
      if (!lb.classList.contains("otvoren")) return;
      if (e.key === "Escape") zatvori();
      if (e.key === "ArrowLeft") prikazi(i - 1);
      if (e.key === "ArrowRight") prikazi(i + 1);
    });
    let x0 = null;
    lb.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    lb.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) prikazi(i + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  /* ---------- Pokretanje ---------- */

  popuniZajednicko();
  zaglavlje();
  mobilniMeni();
  prelaziStranica();
  kursor();
  if (strana === "pocetna") pocetna();
  if (strana === "rad") stranicaRada();
})();
