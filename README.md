# Vibramente — sitio web

Sitio estático (HTML + CSS + JS, sin build) para **Vibramente** (AI &
Hacking School, Quito). Tiene un formulario que guarda leads en **Firestore**
y todos los CTA conectados a **WhatsApp +593 99 979 3094**. Se despliega en
**Firebase Hosting**.

```
vibramente-web/
├── firebase.json            hosting + firestore
├── .firebaserc              id del proyecto de Firebase (ya configurado: vibramente-web-app)
├── firestore.rules          quién puede escribir leads
├── firestore.indexes.json
└── public/
    ├── index.html           la página completa
    ├── assets/              logos, fotos y el video del hero
    └── js/
        ├── firebase-config.js  config de la app web (ya configurada)
        └── app.js              lógica: selector de público, FAQ, formulario, WhatsApp
```

## Estado actual

- ✅ Proyecto de Firebase creado: **`vibramente-web-app`**.
- ✅ `public/js/firebase-config.js` y `.firebaserc` ya tienen la config real
  (los valores del SDK web son públicos por diseño; lo que protege los datos
  son las reglas de Firestore, no esta config).
- ⏳ **Pendiente (1 paso manual, una sola vez):** habilitar la API de Cloud
  Firestore en Google Cloud antes del primer `firebase deploy`:
  1. Abre
     https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=vibramente-web-app
  2. Haz clic en **"Habilitar"**.
  3. Corre:
     ```bash
     firebase firestore:databases:create "(default)" --location=nam5 --project vibramente-web-app
     firebase deploy --only firestore:rules --project vibramente-web-app
     ```

## 1. Requisitos

```bash
npm install -g firebase-tools     # una sola vez
firebase login                    # una sola vez, con la cuenta dueña del proyecto
```

## 2. Ver el sitio en local

```bash
npx serve public                             # http://localhost:3000
# o
firebase emulators:start --only hosting      # http://localhost:5000
```

## 3. Desplegar

```bash
firebase deploy --only firestore:rules --project vibramente-web-app
firebase deploy --only hosting --project vibramente-web-app
```

El sitio queda publicado en `https://vibramente-web-app.web.app` y
`https://vibramente-web-app.firebaseapp.com`.

## 4. Cómo funciona el formulario

- Al enviar, se crea un documento en la colección **`leads`** con:
  `nombre`, `contacto`, `perfil` (persona | empresa | colegio), `tarea`,
  `origen` (dominio) y `creadoEn` (timestamp del servidor).
- Si la casilla está marcada, se abre WhatsApp con el mensaje ya escrito.
- Si Firestore falla, el formulario **no pierde el lead**: muestra un enlace
  directo a WhatsApp con los datos que la persona escribió.

Las reglas (`firestore.rules`) permiten **crear** leads desde la web y
**prohíben leerlos, editarlos o borrarlos** con la clave pública. Se
consultan desde la consola de Firebase → Firestore → colección `leads`.

### Avisos por correo (opcional)

Extensión oficial **Trigger Email from Firestore**, o una Cloud Function:

```js
exports.avisoLead = onDocumentCreated("leads/{id}", async (event) => {
  const d = event.data.data();
  // enviar correo o mensaje con d.nombre, d.contacto, d.perfil, d.tarea
});
```

## 5. WhatsApp

El número vive en `WHATSAPP_NUMBER` (`public/js/firebase-config.js`) para el
CTA dinámico del selector de público, y como enlace directo
(`wa.me/593999793094`) en la barra de navegación, el bloque de contacto y el
botón flotante del `index.html`.

Cada CTA lleva su propio mensaje precargado: cohorte, diagnóstico de empresa
o visita a colegio, según el perfil elegido.

## 6. Dominio propio

Firebase Hosting → Agregar dominio personalizado → `vibramente.studio` →
copia los registros A o TXT en tu DNS. El certificado se emite solo.

## 7. Pendientes de contenido

- Confirmar permiso escrito del testimonio (Nicolás González, SALUDSA) y de
  las personas que aparecen en las fotos.
- Las métricas (+20, +25 h, +10) y la cita salen del brief; revísalas antes
  de publicar.
- Definir el descriptor oficial: *AI & Hacking School* o
  *School-Lab of Agentic Intelligence*.

## Reglas al editar (ver `CLAUDE.md`)

- No introducir build ni framework: HTML con estilos en línea + un módulo JS.
- Tokens de marca fijos, un solo CTA de conversión por sección, número de
  WhatsApp siempre desde `WHATSAPP_NUMBER`, accesibilidad AA.
