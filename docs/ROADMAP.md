# ROADMAP.md — Build Roadmap
# Verdict · 73 Solutions

> Versión: 1.0 · Estado: ✅ aprobado por César
> Última actualización: generado con Claude · junio 2026

---

## Fase activa: FASE 2

Actualizar esta línea al avanzar de fase. Claude Code siempre lee aquí primero.

---

## Regla de avance

**No se pasa a la siguiente fase hasta que todos los criterios de "done"
de la fase actual estén cumplidos y verificados por César.**

---

## FASE 0 — Setup y fundación
**Objetivo:** Repositorio listo, Supabase configurado, deploy base funcionando.
**Estimado:** 1–2 días

### Tareas

- [ ] Crear repositorio en GitHub (`verdict`)
- [ ] Inicializar Next.js 15 con App Router y TypeScript strict
- [ ] Configurar Tailwind CSS v4
- [ ] Instalar y configurar shadcn/ui
- [ ] Crear proyecto en Supabase
- [ ] Configurar variables de entorno (`.env.local`)
- [ ] Instalar `@supabase/ssr` y configurar cliente browser + server
- [ ] Configurar `middleware.ts` para auth redirect
- [ ] Crear proyecto en Vercel y conectar con GitHub
- [ ] Verificar que deploy automático funciona en cada push a `main`
- [ ] Correr UI UX Pro Max skill y generar `design-system/MASTER.md`
- [ ] Crear estructura de carpetas según `ARCH.md`
- [ ] Configurar ESLint + Prettier
- [ ] Crear `types/database.types.ts` (placeholder hasta tener schema)

### Criterio de done ✅
> El proyecto hace deploy exitoso en Vercel mostrando una página `/` con
> "Verdict — coming soon" sin errores en consola ni en build.
> `design-system/MASTER.md` existe en el repositorio.

---

## FASE 1 — Schema y datos base
**Objetivo:** Base de datos lista con datos de prueba.
**Estimado:** 1 día

### Tareas

- [ ] Crear migración inicial con todas las tablas de `SCHEMA.md`
- [ ] Activar RLS en todas las tablas
- [ ] Crear todas las policies de RLS
- [ ] Crear triggers (vote counters, daily limits, handle new user)
- [ ] Crear vistas (`dilemma_results`, `moral_profile`)
- [ ] Crear índices
- [ ] Correr migración en Supabase (`supabase db push`)
- [ ] Regenerar `types/database.types.ts` con Supabase CLI
- [ ] Escribir `supabase/seed.sql` con 20 dilemas de prueba (mezcla de tipos)
- [ ] Correr seed y verificar datos en Supabase dashboard
- [ ] Verificar que RLS funciona correctamente con usuario de prueba

### Criterio de done ✅
> `supabase db push` corre sin errores.
> Los 20 dilemas de prueba existen en la tabla `dilemmas` con status='active'.
> Una query sin auth NO puede ver `votes` ni `profiles`.
> Una query con auth SÍ puede ver `dilemmas` activos.

---

## FASE 2 — Autenticación
**Objetivo:** Login con Google y Apple funcionando end-to-end.
**Estimado:** 1 día

### Tareas

- [ ] Configurar Google OAuth en Supabase Auth
- [ ] Configurar Apple OAuth en Supabase Auth
- [ ] Crear página `/login` con botones "Continue with Google" y "Continue with Apple"
- [ ] Agregar `PrivacyBadge` en pantalla de login
- [ ] Configurar callback URL de OAuth
- [ ] Verificar que `handle_new_user` trigger crea `profiles` automáticamente
- [ ] Crear layout `(auth)/layout.tsx` con guard que redirige a `/login`
- [ ] Crear layout `(public)/layout.tsx`
- [ ] Crear `store/authStore.ts` con Zustand
- [ ] Probar flujo completo: login → redirect a `/feed` → logout

### Criterio de done ✅
> Un usuario puede hacer login con Google y con Apple.
> Al hacer login, se crea automáticamente un registro en `profiles`.
> Al intentar acceder a `/feed` sin auth, redirige a `/login`.
> Al hacer logout, redirige a `/`.

---

## FASE 3 — Feed y votación
**Objetivo:** El usuario puede ver dilemas y votar. Es el core de la app.
**Estimado:** 3–4 días

### Tareas

- [ ] Crear `hooks/useDilemmaFeed.ts` con TanStack Query
- [ ] Crear `hooks/useDilemmaVote.ts` con optimistic update
- [ ] Crear `hooks/useDailyLimit.ts`
- [ ] Crear componente `DilemmaCard` (todos los tipos: quick, context, justification)
- [ ] Crear componente `VoteButtons` con estados: idle, loading, voted
- [ ] Crear página `/feed` con lista de DilemmaCards
- [ ] Implementar lógica de límite diario (5 dilemas para tier free)
- [ ] Crear componente `DailyCounter`
- [ ] Crear componente `PremiumGate` (overlay al alcanzar límite)
- [ ] Crear página `/` (landing) con dilema de muestra sin auth
- [ ] Crear onboarding de primera sesión (pantalla única)
- [ ] Crear componente `Header` con streak indicator
- [ ] Crear componente `BottomNav`

### Criterio de done ✅
> Un usuario autenticado puede ver el feed de dilemas.
> Puede votar en un dilema (quick, context y justification).
> El voto se registra en la DB con el country_code correcto.
> Al votar el 5to dilema (tier free), aparece el PremiumGate.
> Un usuario no puede votar dos veces el mismo dilema.
> Los contadores `votes_a` y `votes_b` se actualizan en la DB.

---

## FASE 4 — Resultados en tiempo real
**Objetivo:** Pantalla de resultados completa con Supabase Realtime.
**Estimado:** 2–3 días

### Tareas

- [ ] Crear `hooks/useDilemmaResults.ts` con Supabase Realtime
- [ ] Crear componente `ResultBar` con animación CSS
- [ ] Crear componente `CountryBreakdown` con banderas
- [ ] Crear `lib/utils/phrases.ts` — generador de frases ácidas/graciosas
- [ ] Crear componente `VerdictPhrase`
- [ ] Crear página `/results/[id]`
- [ ] Implementar lógica de tier: free ve global+top3 países, premium ve todo
- [ ] Crear componente `JustificationsList`
- [ ] Crear componente `JustificationInput` (input post-voto)
- [ ] Crear `hooks/` y API route para likes en justificaciones
- [ ] Verificar que los contadores se actualizan en tiempo real

### Criterio de done ✅
> Después de votar, el usuario ve la pantalla de resultados.
> Los porcentajes se muestran correctamente (A vs B).
> El desglose por país muestra los top países con banderas.
> La frase generada aparece y tiene sentido con el resultado.
> Abrir la misma pantalla en dos ventanas muestra actualización
> en tiempo real cuando alguien más vota.

---

## FASE 5 — Perfil moral
**Objetivo:** Perfil acumulado del usuario con radar chart.
**Estimado:** 1–2 días

### Tareas

- [ ] Crear `hooks/useMoralProfile.ts`
- [ ] Instalar librería de charts (Recharts o similar)
- [ ] Crear componente `MoralRadar` con las 5 dimensiones
- [ ] Crear página `/profile` (perfil propio)
- [ ] Crear página `/profile/[userId]` (perfil público)
- [ ] Implementar lógica de privacidad: perfil público NO muestra respuestas
- [ ] Mostrar stats: total votes, streak, dilemmas answered

### Criterio de done ✅
> El perfil muestra el radar chart con las 5 dimensiones.
> Las dimensiones reflejan los votos reales del usuario.
> El perfil público de otro usuario NO muestra sus respuestas individuales.
> Con 0 votos, el radar está vacío con mensaje de onboarding.

---

## FASE 6 — Compartir resultados
**Objetivo:** Share card generada automáticamente para redes sociales.
**Estimado:** 1–2 días

### Tareas

- [ ] Crear `lib/utils/share.ts`
- [ ] Crear API route `/api/share/[id]` que genera OG image con `@vercel/og`
- [ ] Crear componente `ShareCard` con botón de share
- [ ] Implementar Web Share API para mobile
- [ ] Fallback: copiar URL al clipboard en desktop
- [ ] Crear meta tags OG dinámicos para cada dilema (`/dilemma/[id]`)
- [ ] Verificar que la imagen generada se ve bien en Twitter, Instagram, WhatsApp

### Criterio de done ✅
> Al tocar "Share result", se abre el share sheet nativo en mobile.
> La imagen generada incluye: pregunta, resultado del usuario,
> porcentaje global y URL de la app.
> Los meta tags OG funcionan correctamente al compartir el link.

---

## FASE 7 — Admin panel
**Objetivo:** César puede crear y gestionar dilemas sin tocar la DB directamente.
**Estimado:** 1–2 días

### Tareas

- [ ] Configurar `ADMIN_USER_ID` en variables de entorno
- [ ] Crear guard de admin en `(admin)/layout.tsx`
- [ ] Crear página `/admin` con tabla de dilemas (status, votos, fecha)
- [ ] Crear página `/admin/new` con formulario de nuevo dilema
- [ ] Crear página `/admin/[id]` para editar dilema existente
- [ ] Implementar cambio de status: draft → active → archived
- [ ] Crear componente `AdminSidebar`
- [ ] Validación con Zod en el formulario

### Criterio de done ✅
> César puede crear un dilema desde `/admin/new` y verlo en el feed.
> Solo el ADMIN_USER_ID tiene acceso a rutas `/admin/*`.
> Cualquier otro usuario redirige a `/feed`.
> Se puede cambiar el status de un dilema (draft → active → archived).

---

## FASE 8 — Polish y lanzamiento
**Objetivo:** App lista para lanzamiento público.
**Estimado:** 2–3 días

### Tareas

- [ ] Cargar los 100 dilemas iniciales de alta calidad en producción
- [ ] Configurar dominio real (cuando esté decidido el nombre)
- [ ] Configurar PWA manifest + service worker básico
- [ ] Revisar y ajustar design system según UI UX Pro Max + feedback visual
- [ ] Revisar todos los estados vacíos y de error
- [ ] Revisar todos los textos (copy) en inglés
- [ ] Prueba de flujo completo en mobile (iOS Safari + Android Chrome)
- [ ] Configurar Supabase en producción (separado de staging)
- [ ] Configurar variables de entorno en Vercel para producción
- [ ] Verificar RLS en producción con usuario real
- [ ] Smoke test: registro → voto → resultados → compartir

### Criterio de done ✅
> La app funciona de extremo a extremo en un iPhone y un Android.
> Los 100 dilemas están cargados y aparecen en el feed.
> El share card se genera correctamente.
> No hay errores en Vercel logs ni en Supabase logs.
> César aprueba el flujo completo.

---

## Post-MVP (v1.1) — No construir antes del lanzamiento

- [ ] Sistema de anuncios (AdSense o similar)
- [ ] Dilemas patrocinados con badge
- [ ] Suscripción premium — Stripe integration
- [ ] Paywall + gestión de tier en DB
- [ ] Notificaciones push — "new dilemma of the day"
- [ ] Dilemas localizados por país
- [ ] Desglose por edad y género (requiere onboarding extendido)
- [ ] Internacionalización (i18n) — español como segundo idioma

## Futuro (v2.0) — Para cuando haya tracción

- [ ] Verdict Insights — API de datos para medios/investigadores
- [ ] App nativa iOS y Android (React Native)
- [ ] Rankings y ligas entre usuarios
- [ ] Dilemas generados por usuarios (con moderación)
- [ ] Dashboard de analytics para compradores de datos

---

*ROADMAP v1.0 · Verdict · 73 Solutions · César · generado junio 2026*
