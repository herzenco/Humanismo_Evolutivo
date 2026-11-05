# Infraestructura del portal por perfil

Implementación local del alcance del deck «Portal educativo | Humanismo Evolutivo», 22 de octubre de 2026. Esta entrega continúa la rama `feature/portal-course-paths` y sus migraciones anteriores. No se ha aplicado a la base compartida ni se ha desplegado a producción.

## 1. Administrador de plataforma

- Inicio propio y selector de perfiles basado en permisos reales, sin elevar permisos por URL.
- Crear una escuela y la invitación de su primer administrador en una misma transacción.
- Estado de incorporación mientras el primer administrador acepta. Las escuelas existentes sin administrador quedan en incorporación para regularizarse.
- Ver miembros, aulas y progreso de todas las escuelas. Archivar y reactivar sin borrar datos.
- Revocar la administración escolar, conservando siempre al menos un administrador en escuelas incorporadas.
- Crear cursos adicionales en borrador, agregar/corregir lecciones y publicar programas con numeración consecutiva. Los cursos publicados se integran al catálogo, al progreso y a las páginas de lecciones del estudiante.
- Publicación inmutable en esta primera versión. La edición/versionado de cursos ya publicados requiere un flujo posterior para no alterar recorridos existentes.
- La autoridad global reutiliza `authz.assert_current_admin_permission('education.qa.manage')` y su requisito existente de MFA. No se crean administradores globales desde metadatos del usuario.

## 2. Administrador escolar

- Vista inicial de su escuela, sus miembros y progreso.
- Invitar estudiantes, maestros y administradores escolares. Promover a un maestro existente.
- Crear y archivar aulas, asignar varios maestros con el mismo acceso y colocar/transferir estudiantes.
- Gestionar el permiso de lectura de nuevas reflexiones.
- Retirar estudiantes y maestros. No revocar administradores ni retirar a un maestro que conserve administración activa.
- La aceptación del perfil de administrador escolar también crea la membresía de maestro.

## 3. Maestro

- Vista de sus estudiantes y gestión de invitaciones del aula.
- Los reportes, listados, actividad y reflexiones verifican asignaciones de aula en la base, además del servidor.
- Los demás estudiantes de la misma escuela permanecen fuera de su alcance.
- Puede invitar estudiantes a sus aulas y retirar a los estudiantes de ellas.
- Asistencia únicamente en Amigos que evolucionan. No hay acceso de asistencia para escuelas ordinarias.
- En Amigos no hay aulas y sus maestros autorizados ven a todos los miembros.

## 4. Estudiante

- Inicio con asistencia y avance independientes, cursos, lecciones y trabajo personal.
- Progreso global conservado entre escuelas, también para nuevos cursos publicados.
- Lecciones futuras bloqueadas en servidor y base. Guardar borrador no completa una lección.
- Invitaciones aceptadas desde Mis escuelas, con correo verificado coincidente. No hay membresía escolar ni perfil invitado antes de aceptar.
- Sin directorio de miembros ni acción para abandonar escuelas.
- Membresía automática en Amigos al crear la cuenta. Las bajas escolares no la eliminan.

## Base de datos y compatibilidad

Nueva migración: `supabase/migrations/20261022211034_portal_roles_infrastructure.sql`.

Aplicar primero, en este orden, las migraciones existentes de acceso escolar, progreso, asistencia y panel de maestro. La nueva migración agrega el rol `school_admin`, aulas, asignaciones, alcance por aula, aceptación de roles invitados, continuidad administrativa, permisos de reflexiones y cursos nuevos. Los datos existentes se conservan. Los accesos antiguos que permitían escribir membresías sin aceptación o abandonar escuelas dejan de estar disponibles para clientes.

Las tablas privadas tienen RLS y no otorgan acceso directo a clientes. Las funciones públicas son invocadoras de implementaciones privadas que repiten autenticación, autorización y validación. Las funciones antiguas conservadas para reutilización interna pierden permiso de ejecución para clientes. Los cambios de membresía y administración bloquean primero la escuela para serializar modificaciones concurrentes; el índice parcial de maestro impide pertenecer activamente a dos escuelas ordinarias.

### Reflexiones: decisiones conservadoras de esta implementación

- Se comparte una instantánea de la primera entrega completada, con fecha de envío. Los borradores y las ediciones posteriores del trabajo personal no actualizan esa instantánea.
- Solo se crean permisos para las escuelas a las que el estudiante pertenece y que tienen lectura habilitada al enviar.
- Habilitar lectura no comparte entregas anteriores ni convierte trabajo antiguo editado en una entrega nueva.
- Deshabilitar revoca la consulta escolar. Volver a habilitar inicia una fecha nueva y no recupera entregas anteriores.
- El administrador global mantiene el alcance global acordado.

Estas decisiones evitan aperturas retroactivas mientras se define un futuro flujo de edición y reenvío. La política de conservación, exportación y eliminación de cuentas sigue pendiente de definición.

## Invitaciones por correo

El envío está implementado en `src/lib/education/mail.ts` y ocurre después de autorizar y guardar la invitación. Usa una notificación por correo para cuentas nuevas o existentes; no sustituye contraseñas ni requiere una clave `service_role`.

Configurar en el servidor:

- `RESEND_API_KEY`: credencial del proveedor de correo.
- `PORTAL_INVITATION_FROM`: remitente de un dominio verificado.
- `NEXT_PUBLIC_SITE_URL` o `SITE_URL`: origen correcto del portal.

Sin configuración o si el proveedor falla, se conserva la invitación y se muestra «Envío fallido», con acción de reenvío. No se informa un envío exitoso ficticio. El destinatario inicia sesión o crea su cuenta con ese correo y acepta en Mis escuelas. Las invitaciones vencen a los 14 días. La autorización del remitente se comprueba nuevamente al aceptar.

**Pendiente operativo:** configurar el proveedor y comprobar entrega real en QA. Las pruebas no envían mensajes a personas reales.

## Activación y verificación

1. Revisar la migración y aplicarla en el entorno de pruebas acordado, respetando la promoción feature → dev → qa → main.
2. Mantener `EDUCATION_ACCESS_ENVIRONMENT=qa` para habilitar esta infraestructura en QA. La activación en producción permanece deliberadamente separada.
3. Invitar y aceptar al primer administrador de Amigos y de cada escuela existente que aún esté en incorporación.
4. Configurar el correo y verificar destinatario, aceptación y revocación con cuentas de prueba.
5. Validar visualmente los cuatro perfiles antes de la promoción. La comprobación automática de navegador de esta sesión fue bloqueada por la política del navegador integrado.

### Pruebas locales

- `npm test`: incluye pruebas PostgreSQL con PGlite de la matriz de permisos, invitaciones, alcance de aula, continuidad administrativa, asistencia, privacidad temporal y cursos.
- `npx tsc --noEmit`.
- `npm run lint`.
- `npm run build:site -- --webpack`.

Prueba de integración HTTP, desde una base de fixture nueva:

```sh
node scripts/learning-preview-server.mjs
```

En otra terminal:

```sh
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54339 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=fixture-key EDUCATION_ACCESS_ENVIRONMENT=qa npx next dev --port 3036
```

Después:

```sh
node scripts/verify-roles-api.mjs
```

El fixture es exclusivamente local, efímero y no se importa en la aplicación. Solo acepta cuentas ficticias: `student@example.test`, `teacher@example.test`, `schooladmin@example.test` y `platformadmin@example.test`. Cualquier contraseña no vacía sirve únicamente en este fixture. Reiniciarlo borra sus cambios de prueba. No usarlo ni desplegarlo como sistema de autenticación real.

Verificado el flujo cuenta → API Next → PostgreSQL → respuesta para los cuatro perfiles. La prueba cubre creación de escuela, aceptación, fracaso explícito de correo sin proveedor, aislamiento por aula, protección de administración, publicación de curso y finalización del estudiante.
