# Contexto para Claude Code

Sitio de **Vibramente** (AI & Hacking School, Quito). Estático, sin build,
sin framework: HTML con estilos en línea + un módulo JS. Firebase Hosting +
Firestore.

## Reglas al editar

- **No introducir build ni framework.** Si algo necesita React o un bundler,
  proponerlo antes, no hacerlo.
- **Estilos en línea** en `index.html`, igual que el resto. Las clases solo
  para lo que necesita media query (`.navlinks`, `.wa-float`).
- **Tokens de marca** (no usar otros colores):
  noche `#070b14`, superficie `#101826`, carbón `#131512`, texto `#f4f1ea`,
  texto suave `#c9d2e3`, apagado `#9ba6bd`, violeta `#9431fa`,
  índigo `#5c33ee`, azul `#2c6eea`, cian `#2cdade`, menta `#6bf4c8`
  (CTA de conversión), oro `#d6b36a` (solo logros), lila texto `#b98cff`.
- **Tipografías:** Space Grotesk (titulares), Inter (texto),
  Cormorant Garamond (citas).
- **Un solo CTA de conversión por sección** y el número de WhatsApp siempre
  desde `WHATSAPP_NUMBER`.
- **Accesibilidad:** áreas táctiles ≥ 44 px, foco visible en menta, `alt` en
  toda imagen con contenido, contraste AA.
- Fotos y video: personas reales construyendo. Nada de robots ni stock.
- **Imágenes:** los originales viven en `assets-src/` (fuera de `public/`, no
  se despliegan). En `public/assets/` van ya redimensionadas al tamaño real
  de uso. Al reemplazar una foto, optimizarla antes: el sitio entero pesa
  ~1,4 MB y la primera visita móvil ~216 KB; conviene no perderlo.
- **Trampa con `aspect-ratio`:** si una imagen lleva `aspect-ratio` en CSS y
  atributos `width`/`height`, hay que poner también `height: auto` en el
  estilo inline. El atributo `height` es un *presentational hint* que fija la
  altura y anula el `aspect-ratio` (deformó las fotos una vez).

## Datos de la página

El texto dinámico vive en `public/js/app.js`:
`AUDIENCES` (los tres públicos) y `FAQS`. La oferta actual (6 de octubre de
2026, 10 cupos, 950 USD de lanzamiento sobre 1.900 USD) aparece en el HTML
y en la última pregunta del FAQ: al cambiarla, actualizar ambos.

## Comandos

```bash
npx serve public                          # ver local
firebase deploy --only hosting            # publicar sitio
firebase deploy --only firestore:rules    # publicar reglas
```

## No tocar sin avisar

- `firestore.rules`: relajar la regla de `leads` expondría los datos de
  contacto de la gente. `eventos` es solo-creación y sin datos personales a
  propósito: no añadir campos libres ahí.
- El fallback a WhatsApp cuando Firestore falla: evita perder leads.
- El aviso por correo (EmailJS) y las métricas van con `import()` dinámico y
  `.catch()` silencioso: si el CDN falla, el lead ya está guardado. Volver a
  un `import` estático arriba del módulo tumba Firestore y WhatsApp si el CDN
  responde mal (ya pasó).
- El video del hero solo se carga en escritorio (`setupHeroVideo`). En móvil,
  con `saveData` o con `prefers-reduced-motion` queda solo el póster: son
  626 KB que no se descargan.
- `robots.txt`, `sitemap.xml` y `llms.txt` viven en `public/`. Sin ellos, el
  rewrite `**` de `firebase.json` devuelve el HTML del sitio en su lugar.
