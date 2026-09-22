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
  contacto de la gente.
- El fallback a WhatsApp cuando Firestore falla: evita perder leads.
