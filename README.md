# Plex Library — etapa 1

Interfaz estática para GitHub Pages, adaptable a teléfonos. **Todavía no está conectada a Plex, TMDB ni al correo**; no se simulan películas disponibles ni se afirman solicitudes enviadas.

## Publicar

1. Crear repositorio GitHub `plex-library`.
2. Subir `index.html`, `styles.css`, `app.js`, `config.js` y `catalog.json` a la raíz.
3. En Settings → Pages, seleccionar Deploy from a branch, `main`, `/ (root)`.

## Contrato de catálogo

La sincronización del NAS escribirá `catalog.json` con esta estructura:

```json
{"updatedAt":"2026-11-17T20:00:00-06:00","movies":[{"title":"Ejemplo","originalTitle":"Example","year":2024,"poster":"https://...","tmdbId":12345}]}
```

Nunca publicar credenciales Plex ni tokens de GitHub en el repositorio. La tarea del Synology debe consultar Plex localmente y **subir solamente el JSON** mediante una credencial de escritura restringida, guardada en el NAS.

## Integraciones pendientes

- Tarea programada de Synology cada 60 minutos para leer Plex y actualizar `catalog.json`.
- Cloudflare Worker para búsqueda TMDB (`GET /search?q=...`) y recepción de solicitudes (`POST /request`). La respuesta de búsqueda debe ser `{ "results": [{"title":"...", "year":1994, "poster":"https://...", "tmdbId":123}] }`.
- Servicio de email para enviar a `aldolizares@gmail.com`, con controles antispam, validación y límites de uso. El correo de destino no es un secreto; las claves del proveedor sí deben quedar en el Worker.
- Configurar las URLs del Worker en `config.js` cuando estén disponibles.

No se necesitan puertos entrantes ni IP fija. El catálogo permanece consultable con el NAS apagado, pero deja de actualizarse.
