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
