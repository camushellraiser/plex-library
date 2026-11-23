# Plex Library 5.0 — Discovery

Estado: interfaz web publicada en `main`; enriquecimiento de géneros y reparto pendiente de instalar en Synology.

## Backup inalterable de código anterior
Rama: [backup/plex-library-v4-before-v5](https://github.com/camushellraiser/plex-library/tree/backup/plex-library-v4-before-v5)

Fue creada **antes de la primera modificación de Plex Library 5.0**. Contiene el catálogo y código web anteriores. No contiene contraseñas ni la copia del script privado del NAS.

## Cambios
- Tres tarjetas clicables: todas, añadidas durante los últimos 30 días y estrenadas en el año actual.
- Selector compacto de géneros, visible cuando el catálogo incluya `genres`.
- Ficha enriquecida con etiquetas de géneros y actores principales.
- Actores clicables que filtran exclusivamente las películas de Plex.
- Interfaz ES/EN, sin alterar los títulos/posters ingleses.
- Solicitudes, panel administrativo y conexión Cloudflare existentes permanecen intactos.

El catalogo antiguo no tiene `genres` ni `cast`; la v5 los añade mediante una versión compatible del sincronizador `plex_sync.py` que debe instalarse en el Synology. Antes de sustituirlo, guardar una copia llamada `plex_sync_before_v5.py`. No cambiar `config.env`, `run.sh` ni los tokens.

## Rollback
**Rollback visual inmediato y reversible (sin borrar historial):** en GitHub → repositorio → Settings → Pages → Build and deployment → Branch, seleccionar `backup/plex-library-v4-before-v5` con carpeta `/ (root)` y guardar. Para volver a 5.0, seleccionar nuevamente `main`. Alternativamente, revertir los commits de esta versión si quieres restaurar el código en `main`. **Antes de cualquier rollback** comprobar si `main` tiene cambios posteriores que quieras conservar. Para el NAS, devolver `plex_sync_before_v5.py` al nombre `plex_sync.py`; los campos extra de `catalog.json` se ignoran por la UI anterior.

Esta documentación garantiza un punto de restauración en el repositorio y no depende de recordar una conversación.
