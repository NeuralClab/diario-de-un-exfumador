# Diario de un exfumador

Landing page estatica lista para publicar con GitHub Pages.

El archivo principal es `index.html`.

## Analitica

La landing incluye Google Analytics 4 con el ID placeholder `G-XXXXXXXXXX`.

Sustituye ese valor en `index.html` por el ID real de tu propiedad GA4.

Eventos medidos:

- `click_lead_magnet`
- `click_telegram`
- `click_guia_gratis`
- `submit_formulario_bienvenida`
- `click_cta_principal`

Para medir trafico desde TikTok Bio usa este enlace:

`https://neuralclab.github.io/diario-de-un-exfumador/?utm_source=tiktok&utm_medium=bio&utm_campaign=dejar_de_fumar`

Para comparar landing vs Telegram directo, usa UTMs diferentes en cada destino. Por ejemplo:

- Landing: `?utm_source=tiktok&utm_medium=bio&utm_campaign=dejar_de_fumar`
- Telegram directo: `?utm_source=tiktok&utm_medium=bio&utm_campaign=telegram_directo`

Alternativas posibles a GA4: Plausible, Umami, Matomo o Cloudflare Web Analytics. GA4 queda como opcion principal porque permite eventos personalizados y comparativas por UTM sin cambiar la arquitectura de GitHub Pages.
