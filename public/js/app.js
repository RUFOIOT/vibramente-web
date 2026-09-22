import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig, WHATSAPP_NUMBER, LEADS_COLLECTION } from "./firebase-config.js";

/* ------------------------------------------------------------------ *
 * 1. Datos de la página
 * ------------------------------------------------------------------ */

const AUDIENCES = {
  persona: {
    label: "Profesionales y founders",
    kicker: "Vibramente School",
    kickerColor: "#b98cff",
    title: "Aprende construyendo tu propio agente",
    lead: "Cohortes pequeñas donde llevas un problema real de tu trabajo y sales con un sistema funcionando.",
    cta: "Quiero la próxima cohorte",
    accent: "#9431fa",
    ctaText: "#ffffff",
    img: "assets/cohorte-checkpoint.jpg",
    imgPos: "center 45%",
    imgAlt: "Participante trabajando en el lab frente al checkpoint de la semana 1 de la cohorte",
    points: [
      "8 sesiones en vivo durante 4 semanas",
      "Un agente para una tarea real que repites cada semana",
      "Demo funcionando en la sesión final"
    ],
    wa: "Hola Felipe, quiero información de la próxima cohorte de Vibramente (6 de octubre)."
  },
  empresa: {
    label: "Empresas",
    kicker: "ORION by Vibramente",
    kickerColor: "#2cdade",
    title: "Agentes que trabajan dentro de tu operación",
    lead: "Detectamos el proceso con más fricción, diseñamos la solución, la construimos y la dejamos operando con tu equipo.",
    cta: "Agendar un diagnóstico",
    accent: "#2c6eea",
    ctaText: "#ffffff",
    img: "assets/orion-sesion-trabajo.jpg",
    imgPos: "center 50%",
    imgAlt: "Sesión de trabajo en el lab con varios equipos abiertos implementando un agente",
    points: [
      "Agentes de ventas, marketing e inteligencia comercial",
      "Implementación con medición del tiempo liberado",
      "Traspaso y capacitación a tu equipo"
    ],
    wa: "Hola Felipe, quiero agendar un diagnóstico de IA para mi empresa."
  },
  colegio: {
    label: "Colegios",
    kicker: "Vibramente Labs",
    kickerColor: "#2cdade",
    title: "Aulas donde los estudiantes crean con IA",
    lead: "Hoy no vamos a usar la IA para copiar. La vamos a usar para crear algo que no existía.",
    cta: "Agendar una visita",
    accent: "#2cdade",
    ctaText: "#070b14",
    img: "assets/colegio-docentes.jpg",
    imgPos: "center 55%",
    imgAlt: "Grupo de docentes al cierre de un taller de IA en un colegio",
    points: [
      "Aulas de innovación y hackathons",
      "Currículo de emprendimiento y tecnología",
      "Acompañamiento a docentes y planificación académica"
    ],
    wa: "Hola Felipe, quiero información sobre un laboratorio de IA para mi colegio."
  }
};

const FAQS = [
  ["¿Necesito saber programar?", "No. Trabajamos con asistentes de IA y conectores listos para usar. Si ya usas ChatGPT o Claude para tareas sueltas, tienes lo necesario para empezar."],
  ["¿Cuánto tiempo necesito por semana?", "En cohorte: dos sesiones en vivo de 2 horas por semana, más el tiempo que dediques a construir tu agente entre sesiones."],
  ["¿Qué herramientas usamos?", "Principalmente Claude y sus conectores. Te ayudamos a dejar todo configurado antes de la primera sesión para no perder tiempo de clase."],
  ["¿Qué me llevo al final?", "Un agente funcionando para una tarea real, su especificación documentada y la experiencia de presentarlo en vivo."],
  ["¿Cuánto cuesta?", "Cohortes: 950 USD de precio de lanzamiento (precio normal 1.900 USD) para la cohorte del 6 de octubre de 2026, con 10 cupos. Empresas y colegios reciben una propuesta según el alcance después de una llamada de 20 minutos."]
];

const waLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

/* ------------------------------------------------------------------ *
 * 2. Selector de público
 * ------------------------------------------------------------------ */

let current = "persona";

const tabsBox = document.getElementById("aud-tabs");
const els = {
  kicker: document.getElementById("aud-kicker"),
  title: document.getElementById("aud-title"),
  lead: document.getElementById("aud-lead"),
  cta: document.getElementById("aud-cta"),
  img: document.getElementById("aud-img"),
  points: document.getElementById("aud-points"),
  perfil: document.getElementById("c-perfil")
};

function renderTabs() {
  tabsBox.innerHTML = "";
  Object.entries(AUDIENCES).forEach(([key, a]) => {
    const on = key === current;
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = a.label;
    b.setAttribute("aria-pressed", String(on));
    b.style.cssText =
      "min-height:48px;padding:0 22px;border-radius:999px;font-size:16px;font-weight:600;cursor:pointer;" +
      (on
        ? "background:#f4f1ea;color:#070b14;border:1px solid #f4f1ea;"
        : "background:transparent;color:#c9d2e3;border:1px solid rgba(255,255,255,0.22);");
    b.addEventListener("click", () => {
      current = key;
      if (els.perfil) els.perfil.value = key;
      render();
    });
    tabsBox.appendChild(b);
  });
}

function renderPanel() {
  const a = AUDIENCES[current];
  els.kicker.textContent = a.kicker;
  els.kicker.style.color = a.kickerColor;
  els.title.textContent = a.title;
  els.lead.textContent = a.lead;
  els.cta.textContent = a.cta;
  els.cta.href = waLink(a.wa);
  els.cta.target = "_blank";
  els.cta.rel = "noopener";
  els.cta.style.background = a.accent;
  els.cta.style.color = a.ctaText;
  els.img.src = a.img;
  els.img.alt = a.imgAlt;
  els.img.style.objectPosition = a.imgPos;
  els.points.innerHTML = "";
  a.points.forEach((t) => {
    const li = document.createElement("li");
    li.style.cssText =
      "display:flex;gap:14px;align-items:flex-start;padding:16px 18px;border-radius:16px;background:#070b14;border:1px solid rgba(255,255,255,0.08);font-size:16px;line-height:1.5;";
    li.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2cdade" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink:0;margin-top:1px"><path d="M20 6L9 17l-5-5"></path></svg><span></span>';
    li.querySelector("span").textContent = t;
    els.points.appendChild(li);
  });
}

function render() {
  renderTabs();
  renderPanel();
}

/* ------------------------------------------------------------------ *
 * 3. Preguntas frecuentes
 * ------------------------------------------------------------------ */

function renderFaq() {
  const box = document.getElementById("faq-list");
  box.innerHTML = "";
  FAQS.forEach(([q, a], i) => {
    const wrap = document.createElement("div");
    wrap.style.borderBottom = "1px solid rgba(255,255,255,0.10)";
    const h = document.createElement("h3");
    h.style.margin = "0";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-expanded", i === 0 ? "true" : "false");
    btn.setAttribute("aria-controls", `faq-a-${i}`);
    btn.style.cssText =
      "width:100%;min-height:64px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 0;background:transparent;border:none;color:#f4f1ea;font-size:18px;font-weight:600;text-align:left;cursor:pointer;";
    btn.innerHTML = '<span></span><span aria-hidden="true" style="font-size:24px;color:#2cdade"></span>';
    btn.firstChild.textContent = q;
    const p = document.createElement("p");
    p.id = `faq-a-${i}`;
    p.textContent = a;
    p.style.cssText = "margin:0;padding:0 0 20px;font-size:16px;line-height:1.65;color:#c9d2e3;";
    const sync = () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      p.hidden = !open;
      btn.lastChild.textContent = open ? "−" : "+";
    };
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      box.querySelectorAll("button[aria-expanded]").forEach((b) => b.setAttribute("aria-expanded", "false"));
      box.querySelectorAll("p[id^='faq-a-']").forEach((x) => (x.hidden = true));
      box.querySelectorAll("button[aria-expanded] span:last-child").forEach((s) => (s.textContent = "+"));
      btn.setAttribute("aria-expanded", String(!open));
      sync();
    });
    h.appendChild(btn);
    wrap.appendChild(h);
    wrap.appendChild(p);
    box.appendChild(wrap);
    sync();
  });
}

/* ------------------------------------------------------------------ *
 * 4. Formulario → Firestore
 * ------------------------------------------------------------------ */

let db = null;
try {
  db = getFirestore(initializeApp(firebaseConfig));
} catch (err) {
  console.error("Firebase no se pudo iniciar:", err);
}

function setupForm() {
  const form = document.getElementById("lead-form");
  const ok = document.getElementById("lead-ok");
  const okLink = document.getElementById("lead-wa");
  const errBox = document.getElementById("lead-error");
  const submit = document.getElementById("lead-submit");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errBox.hidden = true;

    const lead = {
      nombre: form.nombre.value.trim().slice(0, 120),
      contacto: form.contacto.value.trim().slice(0, 160),
      perfil: form.perfil.value,
      tarea: form.tarea.value.trim().slice(0, 1000),
      origen: location.hostname || "local",
      creadoEn: serverTimestamp()
    };
    if (!lead.nombre || !lead.contacto) {
      errBox.textContent = "Necesitamos tu nombre y un contacto.";
      errBox.hidden = false;
      return;
    }

    submit.disabled = true;
    submit.textContent = "Enviando…";

    const mensaje =
      `Hola Felipe, soy ${lead.nombre}. ${AUDIENCES[lead.perfil]?.wa || ""}` +
      (lead.tarea ? ` Mi tarea más pesada: ${lead.tarea}` : "");
    okLink.href = waLink(mensaje);

    try {
      if (!db) throw new Error("Firestore no disponible");
      await addDoc(collection(db, LEADS_COLLECTION), lead);
      form.hidden = true;
      ok.hidden = false;
      if (document.getElementById("c-wa")?.checked) {
        window.open(okLink.href, "_blank", "noopener");
      }
    } catch (err) {
      console.error(err);
      // Si Firestore falla, el lead no se pierde: se va por WhatsApp.
      errBox.innerHTML =
        'No pudimos guardar el formulario. Escríbenos directo por <a href="' +
        waLink(mensaje) +
        '" target="_blank" rel="noopener">WhatsApp</a>.';
      errBox.hidden = false;
      submit.disabled = false;
      submit.textContent = "Reintentar";
    }
  });

  els.perfil?.addEventListener("change", () => {
    current = els.perfil.value;
    render();
  });
}

/* ------------------------------------------------------------------ *
 * 5. Arranque
 * ------------------------------------------------------------------ */

render();
renderFaq();
setupForm();
