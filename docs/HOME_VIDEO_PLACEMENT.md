# Videos de inicio (QA)

Configuración compartida: `src/config/home-videos.ts`.

- Popup de primera visita: el archivo suministrado «INTRODUCCIÓN PARQUE CANCUN final.mov», convertido a MP4 H.264/AAC 720p, con fast-start. Duración: 186.1 segundos. Tamaño aproximado: 42 MB frente a 275 MB del original.
- Sección 1, «Conoce a los tres filósofos»: el archivo suministrado «INTRODUCCION HUMANISMO EVOLUTIVO TRANSPERSONAL.mov», convertido a MP4 H.264/AAC 720p con fast-start. Duración: 413.75 segundos. Tamaño aproximado: 77 MiB frente a 617 MiB del original. Tiene su propio póster y se reproduce al pulsar la tarjeta; no comparte el video del popup.
- Sección 4, «Documental completo»: YouTube `FbRIey3dFwA`, anteriormente utilizado en el popup. Tanto el botón como la tarjeta abren el documental directamente.

El popup usa una clave nueva de primera visita; quienes ya vieron el documental en el popup podrán ver ahora la introducción. Se abre tras cinco segundos, con reproducción inicial silenciada y controles para activar el sonido. Cerrar el diálogo desmonta el reproductor y detiene la reproducción.

## Privacidad y alojamiento

El MP4 y su póster residen en el almacén privado autorizado `humanismo-qa-media` (`store_zfh7gHza2Ad98ivf`), conectado exclusivamente al proyecto QA mediante OIDC y el prefijo `QA_MEDIA`. La conexión temporal de desarrollo usada para subir los archivos se retiró después de la carga. No hay videos, credenciales ni tokens en Git.

Los navegadores solicitan `/api/qa-media/introduction` y `/api/qa-media/introduction-poster`. El proxy y la ruta verifican la cookie de QA. La ruta solo admite los identificadores de la introducción y de la sección de filósofos, transmite el contenido sin almacenarlo completo en memoria y conserva las respuestas de rango para reproducción/búsqueda en el video. Las respuestas son privadas y no se almacenan en caché compartida.

Este alojamiento está configurado para QA. Antes de publicar esta configuración en el proyecto principal debe definirse su acceso al video; esta entrega no despliega main.

## Reemplazo de la sección 1 — 2 de noviembre de 2026

Rutas permitidas: `/api/qa-media/philosophers` y `/api/qa-media/philosophers-poster`. Archivos del almacén: `homepage/humanismo-evolutivo-transpersonal-20261102.mp4` y `.jpg`. La introducción a Parque Cancún y el documental conservan sus archivos anteriores.

El cambio se prepara en `dev`; la promoción a staging/QA se realiza cuando el usuario termine de enviar los cambios.

MP4 (80,599,468 bytes) y póster (66,780 bytes) cargados al almacén privado y verificados mediante SHA-256 después de descargarlos. Copias locales en `../VIDEOS SITIO WEB/INTRODUCCION HET/`. El acceso temporal de desarrollo autorizado por el usuario se retiró después de verificar la carga; la conexión conserva únicamente production y preview del proyecto QA. No se desplegó staging/QA.
