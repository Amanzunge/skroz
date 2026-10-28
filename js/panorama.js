/* ==========================================================================
   skro.z: 360° panorama (Photo Sphere Viewer)
   Uvodna animacija "mala planeta", automatsko okretanje, izbor prostorija.
   ========================================================================== */
import { Viewer, utils } from "@photo-sphere-viewer/core";
import { AutorotatePlugin } from "@photo-sphere-viewer/autorotate-plugin";
import { GyroscopePlugin } from "@photo-sphere-viewer/gyroscope-plugin";

const rad = window.SKROZ_RAD;
const kutija = document.getElementById("pano-pregledac");

if (rad && kutija && rad.panorame && rad.panorame.length) pokreni(rad.panorame);

function pokreni(panorame) {
  const okvir = kutija.closest(".pano");
  const savet = okvir.querySelector(".pano__savet");
  const sobe = [...document.querySelectorAll(".soba")];
  const smanjenPokret = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const naTelefonu = matchMedia("(pointer: coarse)").matches;
  const KRAJ = { pitch: 0, yaw: 0, zoom: naTelefonu ? 0 : 15, maxFov: 90, fisheye: 0 };
  const POCETAK = { pitch: -Math.PI / 2, yaw: Math.PI / 2, zoom: 0, maxFov: 130, fisheye: 2 };
  const pocetak = smanjenPokret ? KRAJ : POCETAK;

  let viewer = null;
  let okretanje = null;
  let trenutna = 0;
  let spreman = false;
  let vidljiv = false;
  let uvodPusten = false;
  let savetTajmer;

  function napravi() {
    viewer = new Viewer({
      container: kutija,
      panorama: panorame[trenutna].slika,
      caption: panorame[trenutna].naziv || "",
      loadingTxt: "Učitavanje 360°",
      defaultPitch: pocetak.pitch,
      defaultYaw: pocetak.yaw,
      defaultZoomLvl: pocetak.zoom,
      maxFov: pocetak.maxFov,
      fisheye: pocetak.fisheye,
      mousemove: smanjenPokret,
      mousewheel: true,
      mousewheelCtrlKey: true,
      touchmoveTwoFingers: false,
      moveInertia: true,
      navbar: naTelefonu
        ? ["autorotate", "caption", "gyroscope", "fullscreen"]
        : ["zoom", "autorotate", "caption", "fullscreen"],
      lang: {
        zoom: "Zum",
        zoomOut: "Udalji",
        zoomIn: "Približi",
        fullscreen: "Ceo ekran",
        autorotate: "Automatsko okretanje",
        gyroscope: "Pomeraj telefon",
        loading: "Učitavanje…",
        close: "Zatvori",
        twoFingers: "Koristite dva prsta za pomeranje",
        ctrlZoom: "Držite Ctrl i skrolujte za zum",
        loadError: "Panorama ne može da se učita",
        webglError: "Vaš pregledač ne podržava 360° prikaz",
      },
      plugins: [
        [AutorotatePlugin, {
          autostartDelay: null,
          autostartOnIdle: false,
          autorotatePitch: KRAJ.pitch,
          autorotateSpeed: "1.2rpm",
        }],
        ...(naTelefonu ? [[GyroscopePlugin, {}]] : []),
      ],
    });
    okretanje = viewer.getPlugin(AutorotatePlugin);

    viewer.addEventListener("ready", () => {
      spreman = true;
      if (smanjenPokret) {
        uvodPusten = true;
        okvir.classList.add("uvod-gotov");
        pokaziSavet();
      } else if (vidljiv) {
        uvod();
      }
    }, { once: true });

    // čim korisnik sam pomeri sliku, sakrij savet
    kutija.addEventListener("pointerdown", sakrijSavet, { passive: true });
  }

  // "Mala planeta": slika se razmota iz kugle u normalan pogled
  function uvod() {
    if (uvodPusten || !spreman) return;
    uvodPusten = true;
    okretanje.stop();
    new utils.Animation({
      properties: {
        pitch: { start: POCETAK.pitch, end: KRAJ.pitch },
        yaw: { start: POCETAK.yaw, end: KRAJ.yaw },
        zoom: { start: POCETAK.zoom, end: KRAJ.zoom },
        maxFov: { start: POCETAK.maxFov, end: KRAJ.maxFov },
        fisheye: { start: POCETAK.fisheye, end: KRAJ.fisheye },
      },
      duration: 2600,
      easing: "inOutQuad",
      onTick: (p) => {
        viewer.setOptions({ fisheye: p.fisheye, maxFov: p.maxFov });
        viewer.rotate({ yaw: p.yaw, pitch: p.pitch });
        viewer.zoom(p.zoom);
      },
    }).then(() => {
      viewer.setOptions({ mousemove: true });
      okvir.classList.add("uvod-gotov");
      okretanje.start();
      pokaziSavet();
    });
  }

  function pokaziSavet() {
    if (!savet) return;
    savet.classList.add("vidljiv");
    clearTimeout(savetTajmer);
    savetTajmer = setTimeout(sakrijSavet, 6000);
  }
  function sakrijSavet() {
    savet && savet.classList.remove("vidljiv");
    clearTimeout(savetTajmer);
  }

  function promeniSobu(i) {
    if (i === trenutna) return;
    trenutna = i;
    sobe.forEach((s, n) => {
      s.classList.toggle("je-aktivna", n === i);
      s.setAttribute("aria-selected", String(n === i));
    });
    if (!viewer) return napravi();
    if (!uvodPusten) {
      // korisnik je kliknuo pre uvoda, preskoči uvod
      uvodPusten = true;
      viewer.setOptions({ mousemove: true, fisheye: 0, maxFov: KRAJ.maxFov });
      okvir.classList.add("uvod-gotov");
    }
    const okrece = okretanje.isEnabled();
    viewer
      .setPanorama(panorame[i].slika, {
        caption: panorame[i].naziv || "",
        position: { yaw: KRAJ.yaw, pitch: KRAJ.pitch },
        zoom: KRAJ.zoom,
        transition: { speed: 1500, rotation: true, effect: "fade" },
        showLoader: true,
      })
      .then((uspeh) => uspeh && okrece && okretanje.start());
  }

  sobe.forEach((s) => s.addEventListener("click", () => promeniSobu(Number(s.dataset.soba))));

  // učitaj panoramu tek kad se približi ekranu, a uvod pusti kad je vidljiva
  if (!("IntersectionObserver" in window)) {
    vidljiv = true;
    return napravi();
  }
  new IntersectionObserver((unosi, io) => {
    if (unosi.some((u) => u.isIntersecting)) {
      io.disconnect();
      napravi();
    }
  }, { rootMargin: "400px 0px" }).observe(okvir);

  new IntersectionObserver((unosi) => {
    vidljiv = unosi.some((u) => u.isIntersecting);
    if (vidljiv) uvod();
  }, { threshold: 0.55 }).observe(okvir);
}
