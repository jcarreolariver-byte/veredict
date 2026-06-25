# ARCH.md — Technical Architecture
# Verdict · 73 Solutions

> Versión: 1.0 · Estado: ✅ aprobado por César
> Última actualización: generado con Claude · junio 2026

---

## 1. Stack completo

| Capa | Tecnología | Versión | Notas |
|------|-----------|---------|-------|
| Framework | Next.js | 15.x | App Router, Server Components |
| Lenguaje | TypeScript | 5.x | strict mode activado |
| Base de datos | Supabase | latest | PostgreSQL + Realtime + Auth + Storage |
| Deploy | Vercel | latest | Edge Network, preview deployments |
| Estilos | Tailwind CSS | 4.x | utility-first |
| Componentes | shadcn/ui | latest | Radix UI base |
| Estado cliente | Zustand | 5.x | stores livianos |
| Estado servidor | TanStack Query | 5.x | cache + invalidation |
| Formularios | React Hook Form | 7.x | + Zod para validación |
| Fechas | date-fns | 4.x | sin moment.js |
| Linting | ESLint + Prettier | latest | config estricta |

---

## 2. Estructura de carpetas

```
verdict/
│
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Grupo: rutas autenticadas
│   │   ├── feed/
│   │   │   └── page.tsx              # /feed — feed principal
│   │   ├── dilemma/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # /dilemma/[id]
│   │   ├── results/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # /results/[id]
│   │   ├── profile/
│   │   │   ├── page.tsx              # /profile — perfil propio
│   │   │   └── [userId]/
│   │   │       └── page.tsx          # /profile/[userId] — perfil público
│   │   ├── settings/
│   │   │   └── page.tsx              # /settings
│   │   └── layout.tsx                # Layout con auth guard + bottom nav
│   │
│   ├── (public)/                     # Grupo: rutas públicas
│   │   ├── page.tsx                  # / — landing con dilema de muestra
│   │   ├── login/
│   │   │   └── page.tsx              # /login
│   │   └── layout.tsx                # Layout público (sin nav)
│   │
│   ├── (admin)/                      # Grupo: admin — solo César
│   │   ├── admin/
│   │   │   ├── page.tsx              # /admin — lista de dilemas
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # /admin/new
│   │   │   └── [id]/
│   │   │       └── page.tsx          # /admin/[id] — editar dilema
│   │   └── layout.tsx                # Layout con admin guard
│   │
│   ├── api/                          # Route Handlers
│   │   ├── votes/
│   │   │   └── route.ts              # POST /api/votes
│   │   ├── justifications/
│   │   │   └── route.ts              # POST /api/justifications
│   │   └── share/
│   │       └── [id]/
│   │           └── route.ts          # GET /api/share/[id] — genera OG image
│   │
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Estilos globales + Tailwind
│   └── not-found.tsx                 # 404
│
├── components/
│   ├── ui/                           # shadcn/ui base (auto-generados)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   │
│   ├── verdict/                      # Componentes del dominio Verdict
│   │   ├── DilemmaCard.tsx           # Tarjeta colapsable/expandible
│   │   ├── VoteButtons.tsx           # Botones A/B con estado
│   │   ├── ResultBar.tsx             # Barra animada de porcentajes
│   │   ├── CountryBreakdown.tsx      # Desglose por país con banderas
│   │   ├── JustificationsList.tsx    # Lista de justificaciones + likes
│   │   ├── JustificationInput.tsx    # Input de justificación post-voto
│   │   ├── MoralRadar.tsx            # Radar chart del perfil moral
│   │   ├── ShareCard.tsx             # Imagen generada para compartir
│   │   ├── DailyCounter.tsx          # "X dilemmas left today"
│   │   ├── PrivacyBadge.tsx          # "Your answers are always anonymous"
│   │   ├── PremiumGate.tsx           # Overlay de upgrade
│   │   └── VerdictPhrase.tsx         # Frase ácida/graciosa post-voto
│   │
│   └── layout/
│       ├── BottomNav.tsx             # Navegación inferior
│       ├── Header.tsx                # Header con logo + streak
│       └── AdminSidebar.tsx          # Sidebar del panel admin
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # createBrowserClient — Client Components
│   │   ├── server.ts                 # createServerClient — Server Components/Actions
│   │   └── middleware.ts             # Auth middleware para rutas protegidas
│   │
│   ├── validations/
│   │   ├── dilemma.ts                # Zod schemas para dilemas
│   │   ├── vote.ts                   # Zod schemas para votos
│   │   └── justification.ts          # Zod schemas para justificaciones
│   │
│   └── utils/
│       ├── country.ts                # Helpers de country codes + banderas
│       ├── phrases.ts                # Generador de frases ácidas/graciosas
│       ├── share.ts                  # Helpers para generar share cards
│       └── moral-profile.ts          # Calcular dimensiones del perfil moral
│
├── hooks/
│   ├── useDilemmaFeed.ts             # Feed paginado de dilemas
│   ├── useDilemmaVote.ts             # Mutación de voto con optimistic update
│   ├── useDilemmaResults.ts          # Resultados en tiempo real (Supabase Realtime)
│   ├── useDailyLimit.ts              # Estado del límite diario
│   └── useMoralProfile.ts            # Perfil moral del usuario
│
├── store/
│   ├── authStore.ts                  # Usuario actual + tier
│   └── feedStore.ts                  # Estado local del feed (dilema activo, etc.)
│
├── types/
│   ├── database.types.ts             # Generado por Supabase CLI — no editar manualmente
│   ├── verdict.ts                    # Tipos del dominio (Dilemma, Vote, Result, etc.)
│   └── api.ts                        # Tipos de request/response de API routes
│
├── docs/                             # Los 6 documentos fundacionales
│   ├── PRD.md
│   ├── UX.md
│   ├── SCHEMA.md
│   ├── ARCH.md                       # Este archivo
│   └── ROADMAP.md
│
├── design-system/                    # Generado por UI UX Pro Max skill
│   ├── MASTER.md                     # Design system global del proyecto
│   └── pages/                        # Overrides por pantalla (si aplican)
│
├── supabase/
│   ├── migrations/                   # SQL versionado — nunca editar en producción
│   │   └── 20260601_initial_schema.sql
│   └── seed.sql                      # 100+ dilemas iniciales
│
├── public/
│   ├── icons/                        # App icons + PWA manifest icons
│   └── og/                           # Open Graph images estáticas
│
├── CLAUDE.md                         # Instrucciones para Claude Code
├── middleware.ts                     # Next.js middleware (auth redirect)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json                     # strict: true
└── .env.local                        # Variables de entorno — nunca al repo
```

---

## 3. Patrones de estado

```
┌─────────────────────────────────────────────────────────────┐
│  ¿Dónde vive este estado?                                   │
├─────────────────────────────────────────────────────────────┤
│  UI local (modal abierto, tab activo, hover)                │
│  → useState / useReducer                                    │
├─────────────────────────────────────────────────────────────┤
│  Datos del servidor (dilemas, votos, perfil)                │
│  → TanStack Query (cache + background refetch)              │
├─────────────────────────────────────────────────────────────┤
│  Estado global compartido (usuario, tier, auth)             │
│  → Zustand                                                  │
├─────────────────────────────────────────────────────────────┤
│  Filtros, paginación, navegación                            │
│  → URL searchParams (Next.js)                               │
├─────────────────────────────────────────────────────────────┤
│  Datos en tiempo real (contador de votos)                   │
│  → Supabase Realtime (canales de postgres_changes)          │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Supabase Realtime

Los contadores de votos se actualizan en tiempo real usando Supabase Realtime.

```typescript
// En useDilemmaResults.ts
const channel = supabase
  .channel(`dilemma-${dilemmaId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'dilemmas',
    filter: `id=eq.${dilemmaId}`
  }, (payload) => {
    // Actualizar votes_a y votes_b en el cache de TanStack Query
    queryClient.setQueryData(['dilemma', dilemmaId], payload.new)
  })
  .subscribe()
```

**Canales activos por sesión de usuario:**
- `dilemma-[id]` — cuando el usuario está viendo resultados
- Se desuscribe al navegar fuera de la pantalla de resultados

---

## 5. Estrategia de autenticación

```
middleware.ts
└── Verifica sesión de Supabase en cada request
    ├── Rutas (auth)/*  → redirige a /login si no autenticado
    ├── Rutas (admin)/* → redirige a /feed si no es admin
    └── Rutas (public)/ → permite sin sesión
```

```typescript
// lib/supabase/middleware.ts
// Usar createServerClient de @supabase/ssr
// Refrescar session cookie en cada request
// No usar getSession() en Server Components — usar getUser() (más seguro)
```

**Variables de entorno requeridas:**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # Solo para admin routes — nunca exponer al cliente
```

---

## 6. Naming conventions

```typescript
// Componentes React → PascalCase
export function DilemmaCard() {}
export function VoteButtons() {}

// Hooks → camelCase con prefijo use
export function useDilemmaVote() {}
export function useDailyLimit() {}

// Funciones utilitarias → camelCase
export function getCountryFlag(code: string) {}
export function generateVerdictPhrase(pct: number) {}

// Constantes → SCREAMING_SNAKE_CASE
export const MAX_DAILY_VOTES = 5
export const MAX_JUSTIFICATION_LENGTH = 140

// Tipos e interfaces → PascalCase
type Dilemma = Database['public']['Tables']['dilemmas']['Row']
type VoteChoice = 'a' | 'b'
interface DilemmaResult { ... }

// Archivos de componentes → PascalCase.tsx
// Archivos de hooks/utils → camelCase.ts
// Archivos de rutas Next.js → minúsculas (page.tsx, layout.tsx, route.ts)
// Archivos de tipos → camelCase.ts o PascalCase.ts (consistente por carpeta)
```

---

## 7. Reglas TypeScript

```typescript
// tsconfig.json — strict: true implica:
// - noImplicitAny: true
// - strictNullChecks: true
// - strictFunctionTypes: true

// PROHIBIDO sin justificación comentada:
const x: any = value           // ❌
const y = value as SomeType    // ❌ (sin type guard previo)

// PERMITIDO con comentario:
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const legacy: any = externalLib.weirdMethod()  // ✅ con razón documentada

// Tipos de Supabase: siempre desde el archivo generado
import type { Database } from '@/types/database.types'
type DilemmaRow = Database['public']['Tables']['dilemmas']['Row']

// Regenerar tipos cuando cambie el schema:
// npx supabase gen types typescript --project-id [ID] > types/database.types.ts
```

---

## 8. Optimistic updates

Los votos usan optimistic updates para UX inmediata:

```typescript
// En useDilemmaVote.ts con TanStack Query
const mutation = useMutation({
  mutationFn: castVote,
  onMutate: async (variables) => {
    // Cancelar queries en vuelo
    await queryClient.cancelQueries({ queryKey: ['dilemma', variables.dilemmaId] })
    // Snapshot del estado anterior
    const previous = queryClient.getQueryData(['dilemma', variables.dilemmaId])
    // Actualizar optimistamente
    queryClient.setQueryData(['dilemma', variables.dilemmaId], (old) => ({
      ...old,
      votes_a: variables.choice === 'a' ? old.votes_a + 1 : old.votes_a,
      votes_b: variables.choice === 'b' ? old.votes_b + 1 : old.votes_b,
    }))
    return { previous }
  },
  onError: (err, variables, context) => {
    // Revertir en caso de error
    queryClient.setQueryData(['dilemma', variables.dilemmaId], context.previous)
  }
})
```

---

## 9. Variables de entorno

```bash
# .env.local — NUNCA commitear al repositorio

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_KEY]  # Solo server-side

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000  # https://verdict.app en producción
NEXT_PUBLIC_APP_NAME=Verdict

# Admin (para proteger /admin)
ADMIN_USER_ID=[UUID_DE_CESAR_EN_SUPABASE]
```

---

## 10. Performance targets

| Métrica | Target |
|---------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID / INP | < 100ms |
| CLS | < 0.1 |
| Bundle size (first load JS) | < 150kb |
| Time to first vote | < 5s desde cold start |

**Estrategias:**
- Server Components para fetch de datos (zero client JS para datos estáticos)
- Streaming con Suspense para partes lentas
- Imágenes optimizadas con `next/image`
- Prefetch de siguiente dilema mientras el usuario lee el actual

---

*ARCH v1.0 · Verdict · 73 Solutions · César · generado junio 2026*
