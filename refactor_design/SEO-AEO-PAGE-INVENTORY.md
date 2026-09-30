# Inventario de páginas para SEO y AEO

Este documento traduce `screens.json` a un inventario de **37 rutas reales y únicas**. Excluye los tres componentes compartidos, el diálogo de descarga (estado dentro de páginas de libros) y la segunda representación visual de `/portal/calendar`. No implica que el rediseño esté implementado.

## Criterios de preparación

- Dominio base: `[Dominio canónico por confirmar]`. Las rutas canónicas propuestas se expresan de forma relativa hasta resolver la discrepancia de dominios indicada en `README.md`.
- Datos estructurados: publicar solo propiedades verificadas y visibles. No completar fechas, domicilio, teléfono, duración, imágenes, premios ni perfiles sociales con supuestos.
- Contenido privado: autenticación, portal, clases y administración deben enviar `noindex, nofollow`, quedar fuera del sitemap y requerir autorización real; `robots.txt` no sustituye esa protección.
- Rutas dinámicas: cada libro, serie, episodio, evento y artículo necesita una URL canónica estable y metadatos propios; los corchetes indican valores que vendrán de datos aprobados.
- Estados de interfaz (vacío, error, modal, confirmación) heredan la directiva y canonical de su ruta; no son páginas indexables independientes.
- AEO: las respuestas breves, listas, biografías, preguntas frecuentes y transcripciones deben ser visibles y fieles al contenido aprobado. El marcado estructurado no debe prometer información ausente en la página.

## Sitio público

| Ruta | Propósito actual | Título SEO propuesto | Meta descripción propuesta | Canonical e indexación | Oportunidad AEO / datos estructurados |
|---|---|---|---|---|---|
| `/` | Presentar la filosofía, el autor y los accesos principales. | Humanismo Evolutivo Transpersonal | Conoce la propuesta de Humanismo Evolutivo Transpersonal de Marcos Constandse Madrazo y explora sus libros, medios, eventos y reflexiones. | Canonical `/`; `index, follow`. | `WebSite` y `Organization` con datos confirmados; resumen introductorio en lenguaje directo. |
| `/descubre` | Reunir los ocho contenidos principales en un recorrido. | Descubre el Humanismo Evolutivo | Explora ocho caminos para conocer el Humanismo Evolutivo: filosofía, preguntas, jardines, documental, libros, medios y comunidad. | Canonical `/descubre`; `index, follow`. | `ItemList` de los ocho contenidos; enlaces descriptivos y respuestas breves por sección. |
| `/autor` | Presentar la trayectoria y obra de Marcos Constandse Madrazo. | Marcos Constandse Madrazo — Autor | Conoce la trayectoria, obra y visión de Marcos Constandse Madrazo, autor de la propuesta de Humanismo Evolutivo Transpersonal. | Canonical `/autor`; `index, follow`. | `Person` solo con datos biográficos confirmados; lista de obras enlazada. |
| `/vision` | Publicar el ensayo “Mi visión del mundo”. | Mi visión del mundo — Marcos Constandse | Lee la visión de Marcos Constandse Madrazo sobre conciencia, evolución, ciencia, filosofía, espiritualidad y humanidad. | Canonical `/vision`; `index, follow`. | `Article` con autor y fecha solo si se confirman; tabla de contenido y encabezados interrogativos cuando correspondan. |
| `/libros` | Mostrar el catálogo de obras. | Libros de Marcos Constandse Madrazo | Explora los libros de Marcos Constandse Madrazo sobre filosofía, conciencia, ecología, espiritualidad y desarrollo humano. | Canonical `/libros`; `index, follow`. | `CollectionPage` + `ItemList`; cada elemento enlaza a una ficha canónica. |
| `/libros/yo-soy-nosotros` | Ficha del libro *Yo soy nosotros*. | Yo soy nosotros — Marcos Constandse | Conoce el libro Yo soy nosotros, una obra que integra ciencia, filosofía, psicología, espiritualidad y ecología. | Canonical propia; `index, follow`. | `Book` con ISBN, edición, fecha, páginas y descarga solo cuando estén confirmados. |
| `/libros/ecologia-y-espiritualidad` | Ficha de *Ecología y espiritualidad*. | Ecología y espiritualidad — Libro | Conoce Ecología y espiritualidad, una reflexión de Marcos Constandse sobre el cuidado del planeta y la dimensión humana. | Canonical propia; `index, follow`. | `Book`; bloque visible de tema, autor, edición y disponibilidad confirmada. |
| `/libros/dejalo-ser` | Ficha de *¡Déjalo ser!*. | ¡Déjalo ser! — Marcos Constandse | Descubre ¡Déjalo ser!, obra de Marcos Constandse Madrazo. `[Descripción definitiva por confirmar]`. | Canonical propia; `index, follow` solo al aprobar la sinopsis. | `Book`; no marcar género, argumento ni edición hasta resolver la descripción contradictoria. |
| `/libros/lo-mejor-esta-por-venir` | Ficha de *¡Y lo mejor aún está por venir!*. | ¡Y lo mejor aún está por venir! — Libro | Conoce ¡Y lo mejor aún está por venir!, una obra de Marcos Constandse Madrazo sobre evolución personal y conciencia. | Canonical propia; `index, follow`. | `Book`; título exacto, archivo disponible y datos editoriales por confirmar. |
| `/libros/el-arte-de-ser-empresario` | Ficha de *El arte de ser empresario*. | El arte de ser empresario — Libro | Explora El arte de ser empresario, obra de Marcos Constandse Madrazo sobre empresa, propósito y dimensión humana. | Canonical propia; `index, follow`. | `Book`; diferenciar edición vigente y portada cuando sean suministradas. |
| `/medios` | Concentrar podcasts y contenidos audiovisuales. | Medios y podcasts — Humanismo Evolutivo | Escucha series, episodios y contenidos audiovisuales sobre filosofía, conciencia, ecología, espiritualidad y empresa. | Canonical `/medios`; `index, follow`. | `CollectionPage` + `ItemList`; enlaces a series, plataformas y feeds verificados. |
| `/medios/show/yo-soy-nosotros` | Página de la serie *Yo soy nosotros*. | Yo soy nosotros — Serie de audio | Escucha la serie Yo soy nosotros y explora sus episodios sobre filosofía, psicología, conciencia y evolución humana. | Canonical propia; `index, follow`. | `PodcastSeries` o `CreativeWorkSeries`; lista ordenada de episodios y feed confirmado. |
| `/medios/show/lo-mejor-esta-por-venir` | Página de la serie *Y lo mejor está por venir*. | Y lo mejor está por venir — Serie | Escucha Y lo mejor está por venir, una serie de Humanismo Evolutivo sobre conciencia, transformación y desarrollo humano. | Canonical propia; `index, follow`. | Serie + episodios; conservar la descripción restaurada y no confundirla con el título del libro. |
| `/medios/show/el-arte-de-ser-empresario` | Página de la serie empresarial. | El arte de ser empresario — Serie | Escucha El arte de ser empresario, serie sobre empresa, liderazgo, propósito y responsabilidad humana. | Canonical propia; `index, follow`. | Serie + `ItemList`; arte de serie, proveedor y feed quedan `[Por confirmar]`. |
| `/medios/show/ecologia-y-espiritualidad` | Página de la serie ecológica. | Ecología y espiritualidad — Serie | Escucha Ecología y espiritualidad, una serie sobre la relación entre conciencia, naturaleza y responsabilidad humana. | Canonical propia; `index, follow`. | Serie + episodios; incluir resumen y transcripción aprobada cuando existan. |
| `/medios/[showId]/[episodeSlug]` | Plantilla de episodio individual. | [Título del episodio] — Humanismo Evolutivo | Escucha [título del episodio] de [nombre de la serie] y consulta su resumen, duración y contenidos relacionados. | Canonical por episodio; `index, follow` solo con slug, fecha y contenido únicos. | `PodcastEpisode`/`AudioObject`; fecha, duración, archivo, número y transcripción confirmados. |
| `/eventos` | Mostrar eventos y actividades. | Eventos — Humanismo Evolutivo | Consulta conferencias, encuentros y actividades relacionadas con Humanismo Evolutivo y la obra de Marcos Constandse Madrazo. | Canonical `/eventos`; `index, follow`. | `CollectionPage` + `ItemList`; separar eventos futuros de archivo. |
| `/eventos/smge-2025` | Documentar la sesión solemne de ingreso. | Sesión solemne de ingreso de Marcos Constandse | Conoce la sesión solemne de ingreso de Marcos Constandse Madrazo a la Sociedad Mexicana de Geografía y Estadística. | Canonical propia; `index, follow`. | `Event` y, si procede, `VideoObject`; fecha/duración/ID del video y ubicación deben confirmarse. |
| `/eventos/conferencia-paz-2025` | Documentar la Conferencia de la Paz. | Conferencia de la Paz 2025 | Conoce la participación de Humanismo Evolutivo en la Conferencia de la Paz 2025 y explora la galería del encuentro. | Canonical propia; `index, follow`. | `Event` con ubicación, horario y participantes solo si están verificados; `ImageGallery` opcional. |
| `/video/1` | Reproducir el video de la sesión solemne. | Sesión solemne de ingreso — Video | Mira la sesión solemne de ingreso de Marcos Constandse Madrazo y consulta los datos y contenidos relacionados. | Sustituir `/video/1` por slug descriptivo si la aplicación lo permite; canonical estable; `index, follow`. | `VideoObject` cuando existan URL, miniatura, fecha y duración verificadas; transcripción visible. |
| `/resources` | Listar artículos de Recursos; actualmente no publicado. | Recursos y artículos — Humanismo Evolutivo | Explora artículos y recursos sobre filosofía, conciencia, ecología, espiritualidad y evolución humana. | Mientras use demos: `noindex, nofollow` y fuera del sitemap. Al publicar contenido real: canonical `/resources`; `index, follow`. | `CollectionPage` + `ItemList`; no estructurar artículos demo como reales. |
| `/resources/[slug]` | Plantilla de artículo; actualmente no publicada. | [Título del artículo] — Humanismo Evolutivo | Lee [título del artículo], un recurso de Humanismo Evolutivo sobre [tema confirmado]. | Mientras sea demo: `noindex, nofollow`. Luego canonical individual e `index, follow`. | `Article` con autor, fechas e imagen confirmados; resumen de respuesta y enlaces relacionados. |
| `/contacto` | Ofrecer canales de contacto y formulario. | Contacto — Humanismo Evolutivo | Ponte en contacto con Humanismo Evolutivo para consultas sobre libros, medios, eventos y el portal educativo. | Canonical `/contacto`; `index, follow`. | `ContactPage`; `Organization.contactPoint` solo después de confirmar correo y teléfono. |
| `/buscar` | Mostrar resultados de búsqueda interna. | Buscar — Humanismo Evolutivo | Busca libros, episodios, eventos, artículos y contenidos dentro del sitio de Humanismo Evolutivo. | Canonical `/buscar`; `noindex, follow`; excluir parámetros del sitemap. | Resultados agrupados semánticamente; no marcar resultados internos con schema. |
| `/chatbot` | Interfaz “Charla con el autor”. | Charla con el autor — Humanismo Evolutivo | Explora una experiencia conversacional para consultar contenidos publicados de Humanismo Evolutivo. | Canonical `/chatbot`; `noindex, follow` hasta definir alcance, fuentes y política de respuestas. | Citar las páginas fuente en cada respuesta; no representar respuestas generadas como palabras literales del autor. |
| `/privacidad` | Explicar el tratamiento de datos. | Política de privacidad — Humanismo Evolutivo | Consulta cómo Humanismo Evolutivo trata los datos personales y conoce los canales disponibles para ejercer tus derechos. | Canonical `/privacidad`; `noindex, follow`; accesible desde formularios y footer. | Sin schema especial; fecha de vigencia y responsable deben ser visibles y confirmados. |
| `/terminos` | Publicar condiciones de uso. | Términos y condiciones — Humanismo Evolutivo | Consulta los términos y condiciones aplicables al uso del sitio y sus contenidos. | Canonical `/terminos`; `noindex, follow`; accesible desde el footer. | Sin schema especial; versión/fecha y datos del responsable por confirmar. |
| `/*` (404) | Informar que una ruta no existe y recuperar navegación. | Página no encontrada — Humanismo Evolutivo | No se encontró la página solicitada. Explora los libros, medios, eventos y recursos de Humanismo Evolutivo. | Respuesta HTTP 404 real; `noindex, follow`; sin canonical a inicio. | Sin datos estructurados; ofrecer búsqueda y enlaces de recuperación. |

## Portal educativo y administración

Estas rutas no deben competir en buscadores ni revelar contenido privado. Los títulos y descripciones sirven para navegación, historial y accesibilidad del producto, no para adquisición orgánica.

| Ruta | Propósito actual | Título de página propuesto | Descripción interna propuesta | Canonical e indexación | Oportunidad AEO / datos estructurados |
|---|---|---|---|---|---|
| `/auth` | Iniciar sesión en el portal. | Acceso al portal educativo | Inicia sesión para acceder a tus cursos y contenidos autorizados. | `noindex, nofollow`; fuera del sitemap; sin canonical pública. | Ningún schema; mensajes de error claros y no indexables. |
| `/auth?mode=signup` | Crear una cuenta. | Crear cuenta — Portal educativo | Crea una cuenta para solicitar o gestionar tu acceso al portal educativo. | `noindex, nofollow`; canonical técnica a `/auth` solo si el flujo lo requiere. | Ningún schema; explicar requisitos y privacidad con contenido aprobado. |
| `/auth/recover` | Solicitar recuperación de contraseña. | Recuperar contraseña — Portal educativo | Solicita un enlace para recuperar el acceso a tu cuenta. | `noindex, nofollow`; fuera del sitemap. | Ningún schema; respuesta neutra que no revele si una cuenta existe. |
| `/auth/reset-password` | Definir una contraseña nueva. | Nueva contraseña — Portal educativo | Define una contraseña nueva para recuperar el acceso a tu cuenta. | `noindex, nofollow`; fuera del sitemap. | Ningún schema; tokens de recuperación nunca deben aparecer en canonical o analítica. |
| `/portal` | Mostrar los cursos de la persona autenticada. | Tus cursos — Portal educativo | Consulta tus cursos y continúa tu aprendizaje. | `noindex, nofollow`; autenticación obligatoria; fuera del sitemap. | Sin schema público; nombres y progreso se generan para la persona autenticada. |
| `/portal/courses/[courseId]` | Mostrar módulos y clases de un curso. | [Nombre del curso] — Portal educativo | Consulta módulos, clases y progreso de [nombre del curso]. | `noindex, nofollow`; autorización por curso; fuera del sitemap. | No exponer `Course` público mientras currículo y acceso sean privados. |
| `/portal/classes/[classId]` | Leer una clase privada. | [Título de la clase] — Portal educativo | Lee el contenido autorizado de [título de la clase]. | `noindex, nofollow`; autorización por clase; fuera del sitemap. | Ningún schema público; no incluir texto curricular privado en metadatos, OG o JSON-LD. |
| `/portal/calendar` | Consultar agenda o mes del calendario 2027. | Calendario 2027 — Portal educativo | Consulta fechas, horarios y modalidades de tus clases. | Una sola ruta/canonical interna para ambas vistas; `noindex, nofollow`; autenticación obligatoria. | Sin schema público; si se generan calendarios privados, usar exportaciones autenticadas. |
| `/admin` | Administrar contenido del sistema. | Administración — Humanismo Evolutivo | Gestiona contenidos y recursos autorizados. | `noindex, nofollow`; autorización administrativa; fuera del sitemap. | Ningún schema; impedir caché compartida y filtración de nombres o borradores. |

## Entidades y respuestas que faltan por confirmar

Antes de generar metadata o JSON-LD final deben resolverse, usando `[Por confirmar]` mientras tanto:

1. Dominio canónico único y reglas de redirección.
2. Nombre legal de la organización, domicilio, teléfono y correo de contacto único.
3. URLs reales de perfiles sociales y plataformas de audio/video.
4. ISBN, edición, año, páginas y tipo de descarga de cada libro.
5. Slugs, fechas, duración, archivos, feeds y transcripciones de episodios.
6. Fecha, horario, ubicación, video y participantes confirmados de eventos.
7. Autoría, fechas, imágenes y contenido definitivo de Recursos.
8. Sede de las clases presenciales de 2027.

## Reglas de salida para implementación futura

- Una sola etiqueta `<title>`, una meta description específica, canonical absoluta y directiva robots por ruta.
- `lang="es-MX"` si el propietario confirma esa variante; mientras tanto conservar `es`.
- Open Graph y tarjetas sociales deben reutilizar título, resumen e imagen aprobados, nunca imágenes provisionales de baja resolución.
- El sitemap incluye únicamente URLs públicas, canónicas e indexables con contenido real.
- JSON-LD debe validarse y coincidir con texto visible. Si un dato es `[Por confirmar]`, se omite del objeto estructurado.
- Para AEO, cada página informativa debe abrir con una explicación concisa de su tema y usar encabezados que reflejen preguntas reales respondidas por el contenido disponible.
