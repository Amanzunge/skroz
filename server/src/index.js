/* ==========================================================================
   skro.z: server za investitorske stranice
   Čita projekte iz Zoranovog OneDrive-a (Microsoft Graph) i daje ih sajtu.

   Rute:
     GET  /projekat?p=TOKEN                 sadržaj jednog projekta (za investitora)
     GET  /fajl?p=TOKEN&id=ID&v=VERZIJA     fajl iz projekta (slika, panorama, PDF)
     GET  /slicica?p=TOKEN&id=ID&v=VERZIJA  mala slika (prva strana PDF-a, render…)
     POST /otpremi?p=TOKEN&ime=IME          fotografija investitora → folder ON SITE
     POST /pregled?p=TOKEN&f=1              jedno otvaranje stranice (f=1: preko prosleđenog linka)
     POST /prosledjeno?p=TOKEN&kanal=…      investitor je prosledio link
     GET  /oznake?p=TOKEN                   sve oznake (zahtevi za izmenu) projekta
     POST /oznake?p=TOKEN                   nova oznaka
     POST /oznake/status?p=TOKEN&id=&status=  rešeno / za izmenu (samo Zoran, X-Kljuc)
     POST /oznake/obrisi?p=TOKEN&id=&kljuc=   brisanje (onaj ko je napravio ili Zoran)
     GET  /admin/stanje?k=KLJUC             veza sa OneDrive-om i spisak projekata
     POST /admin/novi-link?k=KLJUC&folder=  novi tajni link za projekat (stari prestaje da važi)
     GET  /auth/pocetak?k=KLJUC             Zoranova prijava u Microsoft (jednom)
     GET  /auth/povratak                    Microsoft vraća ovde posle prijave
   ========================================================================== */

const GRAPH = "https://graph.microsoft.com/v1.0";
const OVLASCENJA = "offline_access Files.ReadWrite User.Read";

class Greska extends Error {
  constructor(status, poruka) {
    super(poruka);
    this.status = status;
  }
}

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const origin = req.headers.get("Origin") || "";
    if (req.method === "OPTIONS") return cors(new Response(null, { status: 204 }), env, origin);
    try {
      return cors(await ruta(req, url, env, ctx), env, origin);
    } catch (e) {
      const status = e instanceof Greska ? e.status : 500;
      if (!(e instanceof Greska)) console.error(e && e.stack ? e.stack : e);
      return cors(json({ greska: e instanceof Greska ? e.message : "Greška na serveru." }, status), env, origin);
    }
  },
};

async function ruta(req, url, env, ctx) {
  const put = url.pathname.replace(/\/+$/, "") || "/";
  const get = req.method === "GET" || req.method === "HEAD";

  if (put === "/") return new Response("skro.z server radi.", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  if (put === "/projekat" && get) return projekat(url, env);
  if (put === "/fajl" && get) return fajl(req, url, env, ctx, false);
  if (put === "/slicica" && get) return fajl(req, url, env, ctx, true);
  if (put === "/otpremi" && req.method === "POST") return otpremi(req, url, env);
  if (put === "/pregled" && req.method === "POST") return pregled(url, env);
  if (put === "/prosledjeno" && req.method === "POST") return prosledjeno(url, env);
  if (put === "/oznake" && get) return oznakeLista(url, env);
  if (put === "/oznake" && req.method === "POST") return oznakaNova(req, url, env);
  if (put === "/oznake/status" && req.method === "POST") return oznakaStatus(req, url, env);
  if (put === "/oznake/obrisi" && req.method === "POST") return oznakaObrisi(req, url, env);
  if (put === "/admin/stanje" && get) return adminStanje(req, url, env);
  if (put === "/admin/novi-link" && req.method === "POST") return adminNoviLink(req, url, env);
  if (put === "/auth/pocetak" && get) return authPocetak(req, url, env);
  if (put === "/auth/povratak" && get) return authPovratak(url, env);
  throw new Greska(404, "Ne postoji.");
}

/* ---------- pomoćne ---------- */

function json(podaci, status = 200, dodatno = {}) {
  return new Response(JSON.stringify(podaci), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...dodatno },
  });
}

function cors(odgovor, env, origin) {
  const dozvoljeni = String(env.DOZVOLJENI || "").split(",").map((s) => s.trim());
  if (!dozvoljeni.includes(origin)) return odgovor;
  const o = new Response(odgovor.body, odgovor);
  o.headers.set("Access-Control-Allow-Origin", origin);
  o.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  o.headers.set("Access-Control-Allow-Headers", "Content-Type, X-Kljuc");
  o.headers.set("Vary", "Origin");
  return o;
}

function nasumicno(duzina = 22) {
  const znaci = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bajtovi = crypto.getRandomValues(new Uint8Array(duzina));
  return [...bajtovi].map((b) => znaci[b % znaci.length]).join("");
}

function proveriAdmina(req, url, env) {
  const kljuc = req.headers.get("X-Kljuc") || url.searchParams.get("k") || "";
  if (!env.ADMIN_KLJUC || kljuc.length < 16 || kljuc !== env.ADMIN_KLJUC) throw new Greska(401, "Pogrešan ključ.");
}

function jeAdmin(req, url, env) {
  const kljuc = req.headers.get("X-Kljuc") || url.searchParams.get("k") || "";
  return !!env.ADMIN_KLJUC && kljuc.length >= 16 && kljuc === env.ADMIN_KLJUC;
}

async function procitaj(env, kljuc) {
  const red = await env.DB.prepare("SELECT vrednost FROM podesavanja WHERE kljuc = ?").bind(kljuc).first();
  return red ? red.vrednost : null;
}
async function upisi(env, kljuc, vrednost) {
  await env.DB.prepare("INSERT INTO podesavanja (kljuc, vrednost) VALUES (?, ?) ON CONFLICT(kljuc) DO UPDATE SET vrednost = excluded.vrednost")
    .bind(kljuc, vrednost).run();
}

// bez naših slova, mala slova, jedan razmak
function normalizuj(t) {
  return String(t || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "dj")
    .replace(/\s+/g, " ")
    .trim();
}

// redosled po imenu, sa brojevima kao brojevima (Pogled 2 pre Pogled 10)
const poredi = new Intl.Collator("sr", { numeric: true, sensitivity: "base" }).compare;

/* ---------- Microsoft prijava i tokeni ---------- */

function msAdresa(env, put) {
  return `https://login.microsoftonline.com/${env.MS_TENANT || "common"}/oauth2/v2.0/${put}`;
}
function povratnaAdresa(url) {
  return `${url.origin}/auth/povratak`;
}

async function authPocetak(req, url, env) {
  proveriAdmina(req, url, env);
  if (!env.MS_KLIJENT) throw new Greska(500, "Microsoft aplikacija još nije podešena.");
  const stanje = nasumicno(24);
  await upisi(env, "auth_stanje", JSON.stringify({ stanje, vreme: Date.now() }));
  const p = new URLSearchParams({
    client_id: env.MS_KLIJENT,
    response_type: "code",
    redirect_uri: povratnaAdresa(url),
    response_mode: "query",
    scope: OVLASCENJA,
    state: stanje,
    prompt: "select_account",
  });
  return Response.redirect(`${msAdresa(env, "authorize")}?${p}`, 302);
}

async function authPovratak(url, env) {
  const nazad = (status) => Response.redirect(`${env.SAJT}/admin.html?veza=${status}`, 302);
  const sacuvano = JSON.parse((await procitaj(env, "auth_stanje")) || "{}");
  const stanje = url.searchParams.get("state");
  if (!stanje || stanje !== sacuvano.stanje || Date.now() - sacuvano.vreme > 15 * 60 * 1000) return nazad("isteklo");
  if (url.searchParams.get("error")) return nazad("odbijeno");
  await upisi(env, "auth_stanje", "{}");

  const tokeni = await zatraziTokene(env, {
    grant_type: "authorization_code",
    code: url.searchParams.get("code") || "",
    redirect_uri: povratnaAdresa(url),
  });
  if (!tokeni) return nazad("greska");
  const ja = await fetch(`${GRAPH}/me?$select=displayName,userPrincipalName,mail`, {
    headers: { Authorization: `Bearer ${tokeni.access_token}` },
  }).then((r) => (r.ok ? r.json() : {}));
  await upisi(env, "ms_nalog", ja.mail || ja.userPrincipalName || ja.displayName || "");
  return nazad("ok");
}

async function zatraziTokene(env, parametri) {
  const telo = new URLSearchParams({ client_id: env.MS_KLIJENT, client_secret: env.MS_TAJNA || "", scope: OVLASCENJA, ...parametri });
  const r = await fetch(msAdresa(env, "token"), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: telo,
  });
  if (!r.ok) {
    console.error("Microsoft token:", r.status, await r.text());
    return null;
  }
  const t = await r.json();
  await upisi(env, "ms_access", t.access_token);
  await upisi(env, "ms_istice", String(Date.now() + (Number(t.expires_in) || 3600) * 1000));
  if (t.refresh_token) await upisi(env, "ms_refresh", t.refresh_token);
  return t;
}

async function pristupniToken(env, osvezi = false) {
  if (!osvezi) {
    const token = await procitaj(env, "ms_access");
    const istice = Number(await procitaj(env, "ms_istice")) || 0;
    if (token && istice - 120000 > Date.now()) return token;
  }
  const refresh = await procitaj(env, "ms_refresh");
  if (!refresh) throw new Greska(503, "OneDrive još nije povezan.");
  const t = await zatraziTokene(env, { grant_type: "refresh_token", refresh_token: refresh });
  if (!t) throw new Greska(503, "Veza sa OneDrive-om je istekla. Potrebno je ponovo se prijaviti.");
  return t.access_token;
}

async function graph(env, put, opcije = {}) {
  let token = await pristupniToken(env);
  let r = await fetch(put.startsWith("http") ? put : GRAPH + put, { ...opcije, headers: { ...(opcije.headers || {}), Authorization: `Bearer ${token}` } });
  if (r.status === 401) {
    token = await pristupniToken(env, true);
    r = await fetch(put.startsWith("http") ? put : GRAPH + put, { ...opcije, headers: { ...(opcije.headers || {}), Authorization: `Bearer ${token}` } });
  }
  return r;
}

async function graphJson(env, put) {
  const r = await graph(env, put);
  if (r.status === 404) return null;
  if (!r.ok) {
    console.error("Graph:", put, r.status, await r.text());
    throw new Greska(502, "OneDrive trenutno ne odgovara. Pokušajte ponovo za minut.");
  }
  return r.json();
}

async function svaDeca(env, folderId) {
  const polja = "id,name,folder,file,size,lastModifiedDateTime,eTag,cTag,image";
  let put = `/me/drive/items/${encodeURIComponent(folderId)}/children?$select=${polja}&$top=200`;
  const sve = [];
  while (put) {
    const strana = await graphJson(env, put);
    if (!strana) break;
    sve.push(...(strana.value || []));
    put = strana["@odata.nextLink"] || null;
  }
  return sve;
}

/* ---------- projekti ---------- */

async function folderiProjekata(env) {
  const koren = await graphJson(env, `/me/drive/root:/${encodeURIComponent(env.KOREN)}?$select=id,name`);
  if (!koren) return { koren: null, folderi: [] };
  const deca = await svaDeca(env, koren.id);
  return { koren, folderi: deca.filter((d) => d.folder) };
}

async function projekatPoTokenu(env, token) {
  if (!token || token.length < 16) throw new Greska(404, "Link nije važeći.");
  const red = await env.DB.prepare("SELECT folder_id FROM projekti WHERE token = ?").bind(token).first();
  if (!red) throw new Greska(404, "Link nije važeći.");
  return red.folder_id;
}

function vrstaFoldera(ime) {
  const n = normalizuj(ime);
  if (n.includes("360") || n.includes("panoram")) return "panorame";
  if (n.includes("render")) return "renderi";
  if (n.includes("dokument")) return "dokumentacija";
  if (n.replace(/[\s_-]/g, "").includes("onsite")) return "onsite";
  return "ostalo";
}
const REDOSLED = { renderi: 1, panorame: 2, dokumentacija: 3, onsite: 4, ostalo: 5 };

function vrstaFajla(f) {
  const ime = f.name.toLowerCase();
  if (/\.(jpe?g|png|webp|heic)$/.test(ime) || (f.file && /^image\//.test(f.file.mimeType || ""))) return "slika";
  if (/\.pdf$/.test(ime)) return "pdf";
  return "ostalo";
}

function verzija(f) {
  // kratka oznaka verzije: menja se kad se fajl zameni
  const izvor = String(f.cTag || f.eTag || f.lastModifiedDateTime || "");
  let h = 0;
  for (let i = 0; i < izvor.length; i++) h = (h * 31 + izvor.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

function stavka(f) {
  return {
    id: f.id,
    ime: f.name,
    naziv: f.name.replace(/\.[^.]+$/, ""),
    vrsta: vrstaFajla(f),
    velicina: f.size || 0,
    izmenjen: f.lastModifiedDateTime,
    v: verzija(f),
    sirina: f.image ? f.image.width : undefined,
    visina: f.image ? f.image.height : undefined,
  };
}

async function projekat(url, env) {
  const folderId = await projekatPoTokenu(env, url.searchParams.get("p"));
  const folder = await graphJson(env, `/me/drive/items/${encodeURIComponent(folderId)}?$select=id,name,lastModifiedDateTime`);
  if (!folder) throw new Greska(404, "Projekat više ne postoji.");

  const deca = await svaDeca(env, folderId);
  const sekcije = [];
  const fajloviUKorenu = deca.filter((d) => d.file);
  for (const pod of deca.filter((d) => d.folder).sort((a, b) => poredi(a.name, b.name))) {
    const fajlovi = (await svaDeca(env, pod.id)).filter((d) => d.file).sort((a, b) => poredi(a.name, b.name));
    sekcije.push({ vrsta: vrstaFoldera(pod.name), naziv: pod.name, stavke: fajlovi.map(stavka) });
  }
  if (fajloviUKorenu.length) sekcije.push({ vrsta: "ostalo", naziv: folder.name, stavke: fajloviUKorenu.sort((a, b) => poredi(a.name, b.name)).map(stavka) });
  sekcije.sort((a, b) => (REDOSLED[a.vrsta] || 9) - (REDOSLED[b.vrsta] || 9));

  const datumi = sekcije.flatMap((s) => s.stavke.map((x) => x.izmenjen)).concat(folder.lastModifiedDateTime).filter(Boolean).sort();
  return json({ naziv: folder.name, azurirano: datumi[datumi.length - 1] || null, sekcije });
}

// fajl ili sličica: proverava da fajl pripada projektu, pa ga prosleđuje (uz keš)
async function fajl(req, url, env, ctx, slicica) {
  const token = url.searchParams.get("p");
  const id = url.searchParams.get("id") || "";
  const v = url.searchParams.get("v") || "0";
  if (!/^[A-Za-z0-9!._-]+$/.test(id)) throw new Greska(400, "Neispravan zahtev.");

  // link se proverava uvek, i pre keša: posle "Novog linka" stari ne daje ni fajlove iz keša
  const folderId = await projekatPoTokenu(env, token);
  const kes = caches.default;
  const kljucKesa = new Request(`https://kes.skroz/${slicica ? "s" : "f"}/${encodeURIComponent(folderId)}/${id}/${v}`);
  const izKesa = await kes.match(kljucKesa);
  if (izKesa) return izKesa;

  const item = await graphJson(env, `/me/drive/items/${encodeURIComponent(id)}?$select=id,name,file,parentReference`);
  if (!item || !item.file) throw new Greska(404, "Fajl ne postoji.");
  // fajl mora biti u folderu projekta ili u nekom od njegovih podfoldera
  let roditelj = item.parentReference && item.parentReference.id;
  let pripada = roditelj === folderId;
  if (!pripada && roditelj) {
    const r = await graphJson(env, `/me/drive/items/${encodeURIComponent(roditelj)}?$select=parentReference`);
    pripada = !!(r && r.parentReference && r.parentReference.id === folderId);
  }
  if (!pripada) throw new Greska(404, "Fajl ne postoji.");

  let izvor;
  let tip = item.file.mimeType || "application/octet-stream";
  if (slicica) {
    const velicina = url.searchParams.get("s") === "mala" ? "medium" : "large";
    const t = await graphJson(env, `/me/drive/items/${encodeURIComponent(id)}/thumbnails/0/${velicina}`);
    if (!t || !t.url) throw new Greska(404, "Nema sličice.");
    izvor = await fetch(t.url);
    tip = izvor.headers.get("Content-Type") || "image/jpeg";
  } else {
    const r = await graph(env, `/me/drive/items/${encodeURIComponent(id)}/content`, { redirect: "manual" });
    const adresa = r.headers.get("Location");
    izvor = adresa ? await fetch(adresa) : r;
  }
  if (!izvor.ok) throw new Greska(502, "Fajl trenutno nije dostupan.");

  const odgovor = new Response(izvor.body, {
    headers: {
      "Content-Type": tip,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(item.name)}`,
    },
  });
  ctx.waitUntil(kes.put(kljucKesa, odgovor.clone()));
  return odgovor;
}

/* ---------- Zoranova stranica za upravljanje ---------- */

async function adminStanje(req, url, env) {
  proveriAdmina(req, url, env);
  const podeseno = !!(env.MS_KLIJENT && env.MS_TAJNA);
  const povezan = !!(await procitaj(env, "ms_refresh"));
  const odgovor = { podeseno, povezan, nalog: (await procitaj(env, "ms_nalog")) || "", koren: env.KOREN, korenPostoji: false, projekti: [] };
  if (!povezan) return json(odgovor);

  const { koren, folderi } = await folderiProjekata(env);
  odgovor.korenPostoji = !!koren;
  const postojeci = await env.DB.prepare("SELECT folder_id, token FROM projekti").all();
  const tokeni = new Map((postojeci.results || []).map((r) => [r.folder_id, r.token]));
  for (const f of folderi) {
    let token = tokeni.get(f.id);
    if (!token) {
      token = nasumicno(22);
      await env.DB.prepare("INSERT INTO projekti (folder_id, token, naziv, napravljen) VALUES (?, ?, ?, ?)")
        .bind(f.id, token, f.name, new Date().toISOString()).run();
    } else {
      await env.DB.prepare("UPDATE projekti SET naziv = ? WHERE folder_id = ?").bind(f.name, f.id).run();
    }
    odgovor.projekti.push({ folder: f.id, naziv: f.name, token, izmenjen: f.lastModifiedDateTime });
  }
  const pregledi = await env.DB.prepare("SELECT * FROM pregledi").all();
  const mapaPregleda = new Map((pregledi.results || []).map((r) => [r.folder_id, r]));
  const zahtevi = await env.DB.prepare(
    "SELECT folder_id, SUM(status = 'otvoreno') AS otvoreni, SUM(status = 'reseno') AS reseni FROM oznake GROUP BY folder_id"
  ).all();
  const mapaZahteva = new Map((zahtevi.results || []).map((r) => [r.folder_id, r]));
  for (const pr of odgovor.projekti) {
    const pg = mapaPregleda.get(pr.folder) || {};
    const zh = mapaZahteva.get(pr.folder) || {};
    pr.otvaranja = pg.otvaranja || 0;
    pr.prosledjenaOtvaranja = pg.prosledjena_otvaranja || 0;
    pr.prosledjivanja = pg.prosledjivanja || 0;
    pr.poslednje = pg.poslednje || null;
    pr.zahteviOtvoreni = zh.otvoreni || 0;
    pr.zahteviReseni = zh.reseni || 0;
  }
  odgovor.projekti.sort((a, b) => poredi(a.naziv, b.naziv));
  return json(odgovor);
}

async function adminNoviLink(req, url, env) {
  proveriAdmina(req, url, env);
  const folder = url.searchParams.get("folder") || "";
  const token = nasumicno(22);
  const r = await env.DB.prepare("UPDATE projekti SET token = ? WHERE folder_id = ?").bind(token, folder).run();
  if (!r.meta || !r.meta.changes) throw new Greska(404, "Projekat ne postoji.");
  return json({ token });
}

/* ---------- fotografije investitora (ON SITE) ---------- */

const NAJVISE_MB = 40;

async function onsiteFolder(env, folderId) {
  const deca = await svaDeca(env, folderId);
  const postojeci = deca.find((d) => d.folder && vrstaFoldera(d.name) === "onsite");
  if (postojeci) return postojeci.id;
  const r = await graph(env, `/me/drive/items/${encodeURIComponent(folderId)}/children`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "ON SITE", folder: {}, "@microsoft.graph.conflictBehavior": "replace" }),
  });
  if (!r.ok) {
    console.error("ON SITE folder:", r.status, await r.text());
    throw new Greska(502, "Slanje trenutno nije moguće.");
  }
  return (await r.json()).id;
}

function imeFajla(original, tip) {
  const vreme = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Belgrade", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  }).format(new Date()).replace(":", "-");
  let ime = String(original || "").split(/[\\/]/).pop().replace(/[\\/:*?"<>|#%&{}~]/g, " ").replace(/\s+/g, " ").trim();
  if (!ime) ime = "fotografija";
  ime = ime.slice(-80);
  if (!/\.[a-z0-9]{2,5}$/i.test(ime)) ime += "." + ((tip.split("/")[1] || "jpg").replace("jpeg", "jpg"));
  return `${vreme} investitor - ${ime}`;
}

async function otpremi(req, url, env) {
  const folderId = await projekatPoTokenu(env, url.searchParams.get("p"));
  const tip = (req.headers.get("Content-Type") || "").toLowerCase();
  if (!/^image\//.test(tip)) throw new Greska(400, "Dozvoljene su samo fotografije.");
  const podaci = await req.arrayBuffer();
  const velicina = podaci.byteLength;
  if (!velicina) throw new Greska(400, "Fotografija je prazna.");
  if (velicina > NAJVISE_MB * 1024 * 1024) throw new Greska(413, `Fotografija je prevelika (najviše ${NAJVISE_MB} MB).`);

  const roditelj = await onsiteFolder(env, folderId);
  const ime = imeFajla(url.searchParams.get("ime"), tip);
  const putanja = `/me/drive/items/${encodeURIComponent(roditelj)}:/${encodeURIComponent(ime)}:`;

  if (velicina <= 4 * 1024 * 1024) {
    const r = await graph(env, `${putanja}/content?@microsoft.graph.conflictBehavior=rename`, {
      method: "PUT",
      headers: { "Content-Type": tip },
      body: podaci,
    });
    if (!r.ok) {
      console.error("Otpremanje:", r.status, await r.text());
      throw new Greska(502, "Slanje nije uspelo. Pokušajte ponovo.");
    }
  } else {
    const r = await graph(env, `${putanja}/createUploadSession`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: { "@microsoft.graph.conflictBehavior": "rename" } }),
    });
    if (!r.ok) {
      console.error("Sesija za slanje:", r.status, await r.text());
      throw new Greska(502, "Slanje nije uspelo. Pokušajte ponovo.");
    }
    const { uploadUrl } = await r.json();
    const DEO = 327680 * 30; // delovi od ~9,4 MB (Microsoft traži umnožak od 320 KB)
    for (let od = 0; od < velicina; od += DEO) {
      const doo = Math.min(od + DEO, velicina);
      const d = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Range": `bytes ${od}-${doo - 1}/${velicina}` },
        body: podaci.slice(od, doo),
      });
      if (!d.ok) {
        console.error("Deo slanja:", d.status, await d.text());
        throw new Greska(502, "Slanje nije uspelo. Pokušajte ponovo.");
      }
    }
  }
  return json({ ok: true, ime });
}

/* ---------- evidencija pregleda ---------- */

async function pregled(url, env) {
  const folderId = await projekatPoTokenu(env, url.searchParams.get("p"));
  const prosledjen = url.searchParams.get("f") === "1" ? 1 : 0;
  await env.DB.prepare(
    `INSERT INTO pregledi (folder_id, otvaranja, prosledjena_otvaranja, prosledjivanja, poslednje) VALUES (?, 1, ?, 0, ?)
     ON CONFLICT(folder_id) DO UPDATE SET otvaranja = otvaranja + 1,
       prosledjena_otvaranja = prosledjena_otvaranja + excluded.prosledjena_otvaranja, poslednje = excluded.poslednje`
  ).bind(folderId, prosledjen, new Date().toISOString()).run();
  return json({ ok: true });
}

async function prosledjeno(url, env) {
  const folderId = await projekatPoTokenu(env, url.searchParams.get("p"));
  await env.DB.prepare(
    `INSERT INTO pregledi (folder_id, otvaranja, prosledjena_otvaranja, prosledjivanja) VALUES (?, 0, 0, 1)
     ON CONFLICT(folder_id) DO UPDATE SET prosledjivanja = prosledjivanja + 1`
  ).bind(folderId).run();
  return json({ ok: true });
}

/* ---------- oznake (zahtevi za izmenu) ---------- */

function oznakaZaSajt(r) {
  return {
    id: r.id,
    fajl: r.fajl_id,
    strana: r.strana,
    x0: r.x0, y0: r.y0, x1: r.x1, y1: r.y1,
    tekst: r.tekst,
    verzija: r.verzija,
    verzijaDatum: r.verzija_datum,
    napravljena: r.napravljena,
    status: r.status,
    resena: r.resena,
  };
}

async function oznakeLista(url, env) {
  const folderId = await projekatPoTokenu(env, url.searchParams.get("p"));
  const r = await env.DB.prepare("SELECT * FROM oznake WHERE folder_id = ? ORDER BY id").bind(folderId).all();
  return json({ oznake: (r.results || []).map(oznakaZaSajt) });
}

const broj01 = (v) => Math.min(1, Math.max(0, Number(v) || 0));

async function oznakaNova(req, url, env) {
  const folderId = await projekatPoTokenu(env, url.searchParams.get("p"));
  let d;
  try { d = await req.json(); } catch (e) { throw new Greska(400, "Neispravan zahtev."); }
  const tekst = String(d.tekst || "").trim().slice(0, 1500);
  if (!tekst) throw new Greska(400, "Upišite šta treba promeniti.");
  if (!/^[A-Za-z0-9!._-]+$/.test(String(d.fajl || ""))) throw new Greska(400, "Neispravan zahtev.");
  const [x0, x1] = [broj01(d.x0), broj01(d.x1)].sort((a, b) => a - b);
  const [y0, y1] = [broj01(d.y0), broj01(d.y1)].sort((a, b) => a - b);
  const kljuc = nasumicno(24);
  const sada = new Date().toISOString();
  const r = await env.DB.prepare(
    `INSERT INTO oznake (folder_id, fajl_id, fajl_ime, strana, x0, y0, x1, y1, tekst, verzija, verzija_datum, napravljena, status, kljuc)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'otvoreno', ?)`
  ).bind(folderId, d.fajl, String(d.ime || "").slice(0, 200), Math.max(0, parseInt(d.strana, 10) || 0), x0, y0, x1, y1,
    tekst, String(d.v || "").slice(0, 40), String(d.izmenjen || "").slice(0, 40), sada, kljuc).run();
  const id = r.meta && r.meta.last_row_id;
  const red = await env.DB.prepare("SELECT * FROM oznake WHERE id = ?").bind(id).first();
  return json({ oznaka: oznakaZaSajt(red), kljuc });
}

async function oznakaStatus(req, url, env) {
  proveriAdmina(req, url, env);
  const folderId = await projekatPoTokenu(env, url.searchParams.get("p"));
  const id = parseInt(url.searchParams.get("id"), 10);
  const status = url.searchParams.get("status") === "reseno" ? "reseno" : "otvoreno";
  const resena = status === "reseno" ? new Date().toISOString() : null;
  const r = await env.DB.prepare("UPDATE oznake SET status = ?, resena = ? WHERE id = ? AND folder_id = ?")
    .bind(status, resena, id, folderId).run();
  if (!r.meta || !r.meta.changes) throw new Greska(404, "Oznaka ne postoji.");
  const red = await env.DB.prepare("SELECT * FROM oznake WHERE id = ?").bind(id).first();
  return json({ oznaka: oznakaZaSajt(red) });
}

async function oznakaObrisi(req, url, env) {
  const folderId = await projekatPoTokenu(env, url.searchParams.get("p"));
  const id = parseInt(url.searchParams.get("id"), 10);
  const red = await env.DB.prepare("SELECT kljuc, status FROM oznake WHERE id = ? AND folder_id = ?").bind(id, folderId).first();
  if (!red) throw new Greska(404, "Oznaka ne postoji.");
  const admin = jeAdmin(req, url, env);
  const autor = (url.searchParams.get("kljuc") || "") === red.kljuc && red.status === "otvoreno";
  if (!admin && !autor) throw new Greska(403, "Ovu oznaku ne možete da obrišete.");
  await env.DB.prepare("DELETE FROM oznake WHERE id = ?").bind(id).run();
  return json({ ok: true });
}
