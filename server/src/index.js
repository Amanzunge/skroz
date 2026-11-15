/* ==========================================================================
   skro.z: server za investitorske stranice
   Čita projekte iz Zoranovog OneDrive-a (Microsoft Graph) i daje ih sajtu.

   Rute:
     GET  /projekat?p=TOKEN                 sadržaj jednog projekta (za investitora)
     GET  /fajl?p=TOKEN&id=ID&v=VERZIJA     fajl iz projekta (slika, panorama, PDF)
     GET  /slicica?p=TOKEN&id=ID&v=VERZIJA  mala slika (prva strana PDF-a, render…)
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
