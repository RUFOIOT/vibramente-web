// Configuración de Firebase (Web App).
// Cómo obtenerla: consola de Firebase → ⚙ Configuración del proyecto →
// "Tus apps" → app web → "Configuración del SDK" → Config.
// Estos valores son públicos por diseño: quien protege los datos son las
// reglas de Firestore (ver firestore.rules), no esta config.
export const firebaseConfig = {
  apiKey: "AIzaSyAjBevGQqoGLNTzkghbvXGszoAksgaDMRo",
  authDomain: "vibramente-web-app.firebaseapp.com",
  projectId: "vibramente-web-app",
  storageBucket: "vibramente-web-app.firebasestorage.app",
  messagingSenderId: "1022199838741",
  appId: "1:1022199838741:web:9d1a2041378f3b49f1761c"
};

// Número de WhatsApp al que van todos los CTA (formato internacional, sin +).
export const WHATSAPP_NUMBER = "593999793094";

// Colección de Firestore donde se guardan los formularios.
export const LEADS_COLLECTION = "leads";

// Colección de métricas del embudo (visitas, clics a WhatsApp, perfiles,
// leads). Sin datos personales: solo tipo de evento, dispositivo y origen.
export const EVENTS_COLLECTION = "eventos";

// EmailJS: envía un correo de aviso a bksegurosec@gmail.com cada vez que
// se guarda un lead. Claves públicas por diseño (como firebaseConfig);
// el envío solo funciona con la plantilla configurada en el dashboard de
// EmailJS para el destinatario fijo.
export const EMAILJS_SERVICE_ID = "service_3gfe0sd";
export const EMAILJS_TEMPLATE_ID = "template_b6vnxyb";
export const EMAILJS_PUBLIC_KEY = "qc3flq5TTsTogVD11";
