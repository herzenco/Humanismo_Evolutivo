# Acceso privado de QA

El proyecto Vercel `humnanismo-evolutivo-qa` tiene una barrera de contraseña propia, sin contratar el complemento de protección de Vercel. No sustituye el inicio de sesión ni los permisos del portal.

El proxy se ubica en `src/proxy.ts`, junto a `src/app`, para que Next.js lo incluya en el build.

## Alcance

- El proxy intercepta todas las rutas antes de consultar la sesión del portal: páginas, APIs, RSC, imágenes, archivos descargables y recursos de Next.
- Solo `/qa-access`, una página HTML autónoma sin recursos externos, es accesible para introducir la contraseña.
- El proyecto de QA se identifica por su ID de Vercel. La aplicación pública no activa esta barrera. Para pruebas locales se usa `QA_GATE_ENABLED=true`.
- Si QA carece de configuración válida, responde 503 en lugar de dejar entrar.
- Cookie `__Host-qa-access`: firmada con HMAC-SHA256, vinculada al host, HttpOnly, Secure, SameSite=Lax, Path=/, sin Domain y persistente hasta 30 días, incluso tras cerrar el navegador. Se renueva una vez al día mientras se utiliza QA; las cookies anteriores de 8 horas se amplían en la siguiente visita si todavía son válidas. La contraseña nunca se usa como cookie.
- Comparación de contraseñas en tiempo constante sobre SHA-256. La contraseña generada es aleatoria y de alta entropía. Las respuestas de acceso incorrecto incorporan una demora de 500 ms; no se afirma que esto sea un limitador de intentos distribuido.
- POST exige el mismo origen, un formulario URL-encoded y un cuerpo pequeño. Los destinos externos y el retorno recursivo al acceso se rechazan.
- Respuestas de QA privadas, sin caché y con `X-Robots-Tag: noindex, nofollow, noarchive`. La página de acceso tiene CSP y no permite ser enmarcada.
- Para cerrar el acceso, visitar `/qa-access` y pulsar «Cerrar acceso». El registro de usuario del portal conserva sus propios controles.

## Configuración (solo proyecto QA)

Variables de servidor, sin prefijo `NEXT_PUBLIC_`:

- `QA_GATE_ENABLED=true`.
- `QA_GATE_PASSWORD_HASH`: SHA-256 hexadecimal de la contraseña aleatoria; variable sensible.
- `QA_GATE_SECRET`: clave de firma aleatoria de al menos 32 caracteres; variable sensible.

No guardar ninguna de estas credenciales en el repositorio. Para rotar el acceso, generar una nueva contraseña aleatoria, actualizar su hash y desplegar QA. El cambio del hash o de la clave de firma invalida todas las cookies anteriores en la nueva versión. Nunca habilitar estas variables en el proyecto principal de producción.

## Validación

`npm test`, `npm run build` y, después de compilar, `npm run verify:qa-gate`. Esta última prueba inicia servidores locales con y sin configuración de QA y realiza peticiones HTTP contra el build real.


Pruebas automatizadas de aislamiento de QA, configuración incompleta, contraseña incorrecta, firma manipulada, vencimiento, otro host, rotación y retorno seguro. Además, comprobar mediante HTTP el rechazo de páginas/API/archivos sin acceso, el POST correcto/incorrecto, la cookie y el cierre de acceso. Validar también que la aplicación sin configuración de QA se sirve normalmente.

La barrera cubre lo que sirve este proyecto. Los archivos o videos alojados en servicios públicos externos conservan las políticas de acceso de esos servicios.

## Compatibilidad con formularios del navegador

La página de acceso usa `Referrer-Policy: same-origin`. `no-referrer` puede hacer que un POST de formulario nativo envíe `Origin: null`, que la comprobación CSRF rechaza correctamente. Se conserva la comprobación exacta del origen; no se permiten orígenes nulos o ausentes. La prueba HTTP comprueba esta política y el rechazo de orígenes nulos/ausentes.
