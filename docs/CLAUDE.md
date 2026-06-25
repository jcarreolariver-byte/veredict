# CLAUDE.md — Verdict · Instrucciones de trabajo para Claude Code

> Este archivo es la fuente de verdad operativa de este proyecto.
> Claude Code debe leerlo completo al inicio de cada sesión antes de ejecutar cualquier acción.

---

## 1. Qué es este proyecto

**Verdict** es una aplicación web mobile-first donde los usuarios responden dilemas morales diarios, ven cómo respondió el mundo, y acumulan un perfil de identidad moral. El objetivo central es viralidad orgánica: cada resultado es compartible y genera conversación.

- Producto: `verdict.app` (nombre tentativo)
- Dueño: César · 73 Solutions
- Stack: Next.js 15 · Supabase · Vercel
- Fase actual: **ver ROADMAP.md → sección "Fase activa"**

---

## 2. Los 6 documentos fundacionales

Antes de escribir cualquier línea de código, estos documentos deben existir y estar marcados como ✅ aprobados.
Claude Code NO debe asumir, inventar, ni inferir nada que debería estar en estos docs.

| # | Archivo | Contenido | Estado |
|---|---------|-----------|--------|
| 1 | `docs/PRD.md` | Qué construimos, para quién, métricas de éxito, scope MVP | ⬜ pendiente |
| 2 | `docs/UX.md` | Pantallas, flujos, happy path, estados vacíos y error | ⬜ pendiente |
| 3 | `docs/SCHEMA.md` | Tablas Supabase, RLS policies, índices, edge cases | ⬜ pendiente |
| 4 | `docs/ARCH.md` | Stack, estructura de carpetas, patrones, naming conventions | ⬜ pendiente |
| 5 | `docs/ROADMAP.md` | Fases del build, entregables por fase, criterio de "done" | ⬜ pendiente |
| 6 | `CLAUDE.md` | Este archivo — reglas de trabajo de Claude Code | ✅ activo |

### Regla de bloqueo
Si cualquier decisión de código requiere información que debería estar en uno de estos docs
y el doc no existe o está incompleto → **detener y preguntar a César, no asumir**.

---

## 3. Protocolo antes de escribir código

Claude Code debe seguir este orden estrictamente:

```
1. Leer CLAUDE.md (este archivo)
2. Identificar en qué fase del ROADMAP.md estamos
3. Revisar si la tarea afecta el schema → consultar SCHEMA.md
4. Revisar si la tarea afecta la UI → consultar UX.md
5. Aplicar patrones de ARCH.md (estructura de carpetas, naming, estado)
6. Verificar que la tarea está dentro del scope del PRD.md
7. Solo entonces: escribir código
```

**Si alguno de los pasos 2–6 genera una ambigüedad → preguntar antes de continuar.**

---

## 4. Stack y versiones

```
Framework:    Next.js 15 (App Router)
Lenguaje:     TypeScript (strict mode)
Base de datos: Supabase (PostgreSQL + Realtime + Auth + Storage)
Deploy:       Vercel
Estilos:      Tailwind CSS v4
Estado:       Zustand (cliente) · TanStack Query (servidor)
Formularios:  React Hook Form + Zod
Fechas:       date-fns
```

**Nunca agregar una dependencia nueva sin:**
1. Verificar que no existe una ya instalada que cubra el caso
2. Avisar a César con justificación antes de instalar
3. Actualizar `docs/ARCH.md` si se aprueba

---

## 5. Estructura de carpetas

```
verdict/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Rutas autenticadas
│   │   └── layout.tsx
│   ├── (public)/               # Rutas públicas
│   │   └── layout.tsx
│   ├── api/                    # Route handlers
│   └── layout.tsx              # Root layout
│
├── components/
│   ├── ui/                     # Componentes genéricos (Button, Card, etc.)
│   ├── verdict/                # Componentes específicos del dominio
│   └── layout/                 # Header, Nav, Shell
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Cliente browser
│   │   ├── server.ts           # Cliente server (SSR)
│   │   └── middleware.ts       # Auth middleware
│   ├── validations/            # Schemas Zod
│   └── utils/                  # Helpers puros (sin side effects)
│
├── hooks/                      # Custom hooks (use*.ts)
├── store/                      # Zustand stores
├── types/                      # Tipos TypeScript globales
│   └── database.types.ts       # Generado por Supabase CLI
│
├── docs/                       # Los 6 documentos fundacionales
│   ├── PRD.md
│   ├── UX.md
│   ├── SCHEMA.md
│   ├── ARCH.md
│   └── ROADMAP.md
│
├── supabase/
│   ├── migrations/             # Migraciones SQL versionadas
│   └── seed.sql                # Datos iniciales (dilemas v1)
│
└── CLAUDE.md                   # Este archivo
```

---

## 6. Convenciones de código

### Naming
```typescript
// Componentes: PascalCase
export function DilemmaCard() {}

// Hooks: camelCase con prefijo use
export function useDilemmaVote() {}

// Funciones utilitarias: camelCase
export function formatVotePercent() {}

// Constantes: SCREAMING_SNAKE_CASE
export const MAX_DAILY_VOTES = 5

// Tipos e interfaces: PascalCase
type DilemmaWithVotes = Database['public']['Tables']['dilemmas']['Row'] & { ... }

// Archivos de componente: PascalCase.tsx
// Archivos de utilidad/hook: camelCase.ts
// Archivos de ruta Next.js: minúsculas (page.tsx, layout.tsx, route.ts)
```

### Reglas TypeScript
- `strict: true` siempre — no `any` sin comentario justificando por qué
- Tipos de Supabase siempre generados desde CLI (`supabase gen types typescript`)
- No castear con `as` sin verificar primero con type guard

### Patrones de estado
```
Estado UI local (modales, tabs, hover)  → useState / useReducer
Estado del servidor / cache              → TanStack Query
Estado global compartido entre rutas    → Zustand
Estado en URL (filtros, paginación)     → searchParams de Next.js
```

---

## 7. Supabase — reglas críticas

### Cliente correcto según contexto
```typescript
// En Server Components, Server Actions, Route Handlers:
import { createServerClient } from '@/lib/supabase/server'

// En Client Components:
import { createBrowserClient } from '@/lib/supabase/client'

// NUNCA usar el cliente browser en código de servidor
```

### RLS (Row Level Security)
- **Todas las tablas tienen RLS activado** — sin excepción
- Cada nueva tabla necesita sus policies definidas en `docs/SCHEMA.md` antes de ser creada
- Probar siempre con un usuario sin privilegios antes de dar por buena una policy

### Migraciones
- Todo cambio de schema va en un archivo de migración versionado en `supabase/migrations/`
- Nunca modificar tablas directamente en el dashboard de Supabase en producción
- Naming: `YYYYMMDD_descripcion_corta.sql`

---

## 8. Lo que Claude Code NUNCA debe hacer

```
❌  Modificar el schema de Supabase sin que exista definición aprobada en SCHEMA.md
❌  Avanzar a una fase del ROADMAP sin que la fase anterior esté marcada como done
❌  Instalar dependencias sin avisar y justificar
❌  Crear páginas o componentes que no estén descritos en UX.md
❌  Usar 'any' en TypeScript sin comentario de justificación
❌  Hacer queries directas a Supabase desde Client Components cuando debería ser Server Component
❌  Hardcodear strings de UI (copys, labels) — van a un archivo de constantes o i18n
❌  Commitear variables de entorno reales (.env.local nunca al repositorio)
❌  Inventar lógica de negocio que no esté especificada — preguntar primero
❌  Saltarse los tests de las funciones críticas (votación, autenticación, rate limiting)
```

---

## 9. Cómo reportar bloqueos

Cuando Claude Code encuentre una ambigüedad o falta de información, el formato de reporte es:

```
🚧 BLOQUEO

Tarea: [qué estaba intentando hacer]
Doc faltante o ambiguo: [qué documento necesita completarse]
Pregunta específica: [la pregunta exacta que necesita respuesta]
Opciones identificadas: [si hay, las opciones posibles con sus implicaciones]
```

No continuar con una suposición. Esperar respuesta de César.

---

## 10. Flujo de trabajo por sesión

```
Inicio de sesión:
  1. Leer este CLAUDE.md
  2. Preguntar: "¿en qué tarea trabajamos hoy?"
  3. Identificar fase actual en ROADMAP.md
  4. Revisar docs relevantes para esa tarea

Durante la sesión:
  - Confirmar antes de crear archivos nuevos
  - Confirmar antes de modificar schema
  - Reportar bloqueos con el formato del punto 9
  - Al terminar una tarea: resumir qué se hizo y qué queda pendiente

Fin de sesión:
  - Listar archivos modificados
  - Indicar si algún doc necesita actualizarse
  - Indicar si la fase actual puede marcarse como done
```

---

## 11. Contexto del dueño del proyecto

- **César** trabaja solo con Claude Code como par de programación
- Stack familiar: Next.js 15 + Supabase + Vercel (proyectos anteriores en producción)
- Preferencia: código explícito sobre magia · tipos estrictos · comentarios solo donde no es obvio
- Empresa: 73 Solutions — producto bajo marca propia, no cliente
- Objetivo de lanzamiento: MVP funcional en 2–3 semanas desde que los 6 docs estén completos

---

## 12. Primer paso

Si los 6 documentos de `docs/` no existen aún:

```
→ El primer trabajo es generar los 6 docs en orden (1 al 5)
→ César revisa y aprueba cada uno antes de pasar al siguiente
→ Solo cuando los 5 están marcados ✅ en la tabla del punto 2 se empieza a codear
→ Empezar con: "¿Generamos el PRD.md juntos ahora?"
```

---

*Última actualización: generado por Claude · proyecto Verdict · 73 Solutions*

---

## 13. Skills instaladas — cuándo y cómo usarlas

Claude Code tiene acceso a skills especializadas en `/mnt/skills/`.
Antes de improvisar una solución, verificar si existe una skill que resuelve el problema mejor.

### Mapa de skills por situación

#### 🎨 Diseño visual y UI

| Situación | Skill a usar | Ruta |
|-----------|--------------|------|
| Diseñar cualquier pantalla, componente o UI de Verdict | **frontend-design** | `/mnt/skills/public/frontend-design/SKILL.md` |
| Crear assets estáticos: posters, banners, imagen de lanzamiento | **canvas-design** | `/mnt/skills/examples/canvas-design/SKILL.md` |
| Aplicar un tema visual consistente a toda la app | **theme-factory** | `/mnt/skills/examples/theme-factory/SKILL.md` |
| Construir un artifact HTML/React complejo con shadcn/ui | **web-artifacts-builder** | `/mnt/skills/examples/web-artifacts-builder/SKILL.md` |

> **Regla crítica para UI:** Siempre leer `frontend-design` antes de escribir cualquier
> componente visual. La skill define el sistema de diseño específico de este proyecto
> y evita que la app se vea genérica.

#### 📄 Documentación y gestión del proyecto

| Situación | Skill a usar | Ruta |
|-----------|--------------|------|
| Crear o editar cualquiera de los 6 docs fundacionales | **doc-coauthoring** | `/mnt/skills/examples/doc-coauthoring/SKILL.md` |
| Generar documentos Word/DOCX (reportes, propuestas) | **docx** | `/mnt/skills/public/docx/SKILL.md` |
| Crear o rellenar PDFs (pitch deck, one-pager) | **pdf** | `/mnt/skills/public/pdf/SKILL.md` |
| Leer archivos subidos por César (cualquier formato) | **file-reading** | `/mnt/skills/public/file-reading/SKILL.md` |
| Leer PDFs complejos (diseños, especificaciones) | **pdf-reading** | `/mnt/skills/public/pdf-reading/SKILL.md` |

#### 🔌 Integraciones y herramientas técnicas

| Situación | Skill a usar | Ruta |
|-----------|--------------|------|
| Construir un MCP server para integrar una API externa | **mcp-builder** | `/mnt/skills/examples/mcp-builder/SKILL.md` |
| Crear o mejorar una skill nueva para este proyecto | **skill-creator** | `/mnt/skills/examples/skill-creator/SKILL.md` |

---

### Protocolo de uso de skills

```
1. Antes de diseñar cualquier UI     → leer frontend-design/SKILL.md
2. Antes de crear cualquier doc      → leer doc-coauthoring/SKILL.md
3. Antes de construir una integración → leer mcp-builder/SKILL.md
4. Si la skill requiere archivos de salida → usar los paths correctos:
   - Trabajo en progreso: /home/claude/
   - Output final para César: /mnt/user-data/outputs/
```

### Skills NO relevantes para este proyecto

Las siguientes skills existen pero no aplican a Verdict (ignorarlas):
- `brand-guidelines` — es específica de Anthropic, no de 73 Solutions
- `benepass-reimbursement`, `grocery-shopping`, `meal-delivery` — uso personal
- `algorithmic-art` — arte generativo, no UI de producto
- `cancel-unsubscribe`, `prescription-refill`, `return-refund` — flujos de consumidor

---

*Sección añadida: Skills instaladas · Verdict · 73 Solutions*

---

## 14. UI UX Pro Max — skill global instalada

Esta skill está instalada globalmente en `~/.claude/skills/ui-ux-pro-max/`
y está disponible en todos los proyectos sin instalación adicional.

### Qué hace

Motor de razonamiento de diseño con:
- 161 reglas por tipo de industria/producto
- 67 estilos UI catalogados (Glassmorphism, Brutalism, AI-Native, Bento Grid, etc.)
- 161 paletas de color alineadas por industria
- 57 combinaciones tipográficas con Google Fonts
- 99 guías UX y anti-patrones documentados
- Soporte explícito para Next.js, shadcn/ui y React

### Cuándo usarla en Verdict

| Situación | Comando |
|-----------|---------|
| Antes de diseñar cualquier pantalla nueva | Generar design system de Verdict |
| Al crear un componente visual por primera vez | Consultar estilos recomendados para app social/moral |
| Cuando haya duda sobre colores, tipografía o efectos | Buscar en el catálogo de estilos |
| Al diseñar la landing page de lanzamiento | Generar design system específico para landing |

### Comando de activación para Verdict

Antes de tocar cualquier UI, correr este comando desde la raíz del proyecto:

```bash
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py \
  "social app moral dilemmas voting real-time" \
  --design-system \
  -p "Verdict" \
  -f markdown
```

Esto genera el design system completo con:
- Estilo UI recomendado para el tipo de producto
- Paleta de colores específica
- Tipografía recomendada
- Anti-patrones a evitar (ej: no usar "AI purple/pink gradients")
- Checklist de entrega

### Persistir el design system del proyecto

Correr una sola vez y commitear el resultado:

```bash
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py \
  "social app moral dilemmas voting real-time" \
  --design-system \
  --persist \
  -p "Verdict"
```

Esto crea `design-system/MASTER.md` en la raíz del proyecto.
**Ese archivo se convierte en la fuente de verdad visual de Verdict.**

### Jerarquía de fuentes de verdad para diseño

```
1. design-system/pages/[pantalla].md   ← override por pantalla (si existe)
2. design-system/MASTER.md             ← sistema global del proyecto
3. ~/.claude/skills/ui-ux-pro-max/     ← catálogo base de la skill
4. /mnt/skills/public/frontend-design/ ← guía filosófica de diseño
```

### Flujo correcto al diseñar una pantalla nueva

```
1. Verificar si existe design-system/MASTER.md
   → Si no existe: correr el comando de persistencia primero
2. Leer design-system/MASTER.md
3. Verificar si existe design-system/pages/[nombre-pantalla].md
   → Si existe: sus reglas tienen prioridad sobre el MASTER
4. Leer /mnt/skills/public/frontend-design/SKILL.md
5. Solo entonces: escribir el componente o pantalla
```

### Regla crítica

❌ Nunca diseñar una pantalla de Verdict sin haber leído
   `design-system/MASTER.md` primero.
   Si el archivo no existe aún, generarlo antes de continuar.

---

*Sección añadida: UI UX Pro Max global · Verdict · 73 Solutions*
