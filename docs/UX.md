# UX.md — User Experience & Flows
# Verdict · 73 Solutions

> Versión: 1.0 · Estado: ✅ aprobado por César
> Última actualización: generado con Claude · junio 2026

---

## 1. Principios de diseño

- **Decisión en 3 segundos** — cada pantalla tiene una acción principal obvia
- **Resultado inmediato** — votar revela datos al instante, sin espera
- **Fricción cero en entrada** — el usuario juega antes de registrarse (ver flujo)
- **Compartir es natural** — el resultado está diseñado para ser screenshot
- **Anonimato visible** — la promesa de privacidad está siempre presente

---

## 2. Mapa de pantallas

```
PÚBLICAS (sin auth)
├── /                    → Landing / Dilema de muestra (gancho)
├── /login               → Google + Apple Sign-In

AUTENTICADAS
├── /feed                → Feed principal de dilemas (home)
├── /dilemma/[id]        → Dilema individual expandido
├── /results/[id]        → Resultados post-voto
├── /profile             → Perfil moral del usuario
├── /profile/[userId]    → Perfil público de otro usuario
└── /settings            → Configuración + info de privacidad

ADMIN (solo César)
└── /admin
    ├── /admin/dilemmas  → Gestión de dilemas
    └── /admin/new       → Crear dilema nuevo
```

---

## 3. Happy path completo

### Paso 1 — Aterrizaje
Usuario llega a `/` y ve un dilema real en pantalla, sin login.
El dilema está activo pero al intentar votar aparece el prompt de auth.
**Objetivo:** que el usuario quiera votar antes de registrarse.

### Paso 2 — Auth
Modal o página `/login` con dos botones:
- "Continue with Google"
- "Continue with Apple"
- Texto pequeño debajo: *"Your answers are always anonymous."*

Un tap. Redirect a feed.

### Paso 3 — Onboarding (primera vez)
Una sola pantalla, no un carrusel:
- Logo + nombre de la app
- Frase: *"The world's moral pulse. One dilemma at a time."*
- Refuerzo de privacidad: *"We never show your name. Ever."*
- Botón: "Let's go"

### Paso 4 — Feed
Lista vertical de dilemas. El primero está expandido y listo para votar.
Los siguientes se ven parcialmente (incitan el scroll).
Indicador de dilemas restantes del día: "4 dilemmas left today"

### Paso 5 — Votar (modo rápido)
- Pregunta en grande
- Dos botones grandes: Opción A / Opción B
- Tap → animación de confirmación → transición a resultados

### Paso 6 — Votar (modo contexto)
- Situación narrada en 2-3 líneas (texto más pequeño, color secundario)
- Pregunta en grande
- Dos botones
- Tap → resultados

### Paso 7 — Resultados
Pantalla inmediata post-voto:
```
[Barra de porcentaje animada: 67% / 33%]

"67% would tell their friend."
"You're in the honest majority."   ← frase generada (tono ácido/gracioso)

[Desglose por país — top 5 países con más votos]
  🇺🇸 USA: 71% Yes
  🇲🇽 Mexico: 58% Yes
  🇧🇷 Brazil: 62% Yes
  ...

[Justificaciones destacadas]
  "Because silence makes you complicit." ↑ 2.3k
  "Some things are better left unsaid." ↑ 1.1k

[Botón: Add your take]   ← abre input de justificación
[Botón: Share result]    ← genera imagen para compartir
[Botón: Next dilemma]    ← vuelve al feed
```

### Paso 8 — Justificación (opcional)
Input de texto libre después de votar.
Límite: 140 caracteres (compartible, tweeteable).
Las mejores justificaciones son votadas por la comunidad (👍 únicamente).

### Paso 9 — Compartir
Genera una imagen automática con:
- Nombre de la app
- La pregunta
- El resultado del usuario ("I said Yes")
- El porcentaje global
- La frase ácida
- URL de la app

Diseñada para ser screenshot y posteada en Instagram Stories / Twitter.

### Paso 10 — Límite diario (tier gratis)
Al agotar los 5 dilemas:
```
"You've reached your daily limit."
"Come back tomorrow — or go unlimited."

[Ver qué me perdí]    ← muestra los dilemas del día sin poder votar
[Go Premium — $2.99]  ← upgrade flow
```

---

## 4. Pantallas detalladas

### 4.1 Feed (`/feed`)

**Componentes:**
- Header: logo + contador de racha diaria (🔥 3 days) + avatar
- Indicador: "X dilemmas left today"
- Lista de DilemmaCards
- Footer nav: Feed | Profile | Settings

**DilemmaCard (collapsed):**
- Categoría / tag (Ethics, Loyalty, Money, etc.)
- Pregunta en bold
- Número de votos totales
- Si ya votó: muestra su voto + resultado resumido

**DilemmaCard (expanded — primer item):**
- Categoría
- Contexto (si aplica) — texto secundario
- Pregunta
- Botón A / Botón B grandes
- Número de votos globales

**Estados:**
- Sin votar: botones activos
- Ya votado: botones deshabilitados, resultado visible
- Límite alcanzado: overlay con CTA de premium

### 4.2 Resultados (`/results/[id]`)

**Componentes:**
- ResultBar — barra animada con porcentajes
- VerdictPhrase — frase generada (tono ácido/gracioso)
- CountryBreakdown — top países con bandera + porcentaje
- JustificationsList — top 3 justificaciones con votos
- AddJustification — input opcional
- ShareCard — botón de compartir
- NextDilemma — botón principal de acción

**Reglas de negocio:**
- Tier gratis ve: porcentaje global + top 3 países + top 3 justificaciones
- Tier premium ve: todos los países + desglose completo + historial

### 4.3 Perfil (`/profile`)

**Componentes:**
- Avatar (generado, no foto real)
- MoralProfile — radar chart con 5 dimensiones:
  Honesty · Loyalty · Pragmatism · Empathy · Chaos
- Stats: total votes · days streak · dilemmas answered
- RecentActivity — últimos 5 dilemas votados (sin mostrar respuesta a otros)
- ShareProfile — genera imagen del perfil moral

**Privacidad:**
- El perfil público muestra el radar chart pero NO las respuestas individuales
- Solo el usuario ve sus respuestas propias

### 4.4 Admin (`/admin`) — solo César

**Dilemmas list:**
- Tabla: ID · Pregunta · Tipo · Votos · Estado (draft/active/archived)
- Filtros: tipo, estado, fecha
- Botón: New Dilemma

**New/Edit Dilemma:**
- Tipo: Quick / Context / Justification
- Pregunta (max 120 chars)
- Contexto opcional (max 280 chars)
- Opción A / Opción B (max 40 chars cada una)
- Categoría/tag
- País target (Global o específico)
- Fecha de publicación
- Estado: draft / scheduled / active

---

## 5. Estados vacíos

| Pantalla | Estado vacío | Copy |
|----------|-------------|------|
| Feed sin dilemas | Ilustración simple | "No more dilemmas today. See you tomorrow." |
| Perfil nuevo | Radar chart vacío | "Answer dilemmas to build your moral profile." |
| Sin justificaciones | Lista vacía | "Be the first to share your take." |
| Sin votos en un dilema | Barra en 50/50 | "No votes yet. Be the first." |

---

## 6. Estados de error

| Error | Mensaje | Acción |
|-------|---------|--------|
| Sin conexión | "No connection. Your vote will sync when you're back." | Reintentar |
| Error al votar | "Something went wrong. Try again." | Reintentar |
| Auth fallida | "Sign-in failed. Try again." | Reintentar |
| Dilema no encontrado | "This dilemma is no longer available." | Volver al feed |

---

## 7. Onboarding — primera sesión

**Pantalla única (no carrusel):**
```
[Logo]

The world's moral pulse.
One dilemma at a time.

━━━━━━━━━━━━━━━━━━━━━

🔒 Your answers are always anonymous.
   We never show your name. Ever.

━━━━━━━━━━━━━━━━━━━━━

[Let's go →]
```

Después del onboarding → directo al feed con el primer dilema expandido.

---

## 8. Componentes compartidos

| Componente | Usado en | Descripción |
|------------|----------|-------------|
| `DilemmaCard` | Feed, Admin | Tarjeta de dilema colapsable/expandible |
| `VoteButtons` | DilemmaCard | Dos botones grandes A/B con estado |
| `ResultBar` | Results, DilemmaCard | Barra animada de porcentajes |
| `CountryFlag` | Results, Breakdown | Bandera + nombre + porcentaje |
| `JustificationItem` | Results | Texto + votos + botón like |
| `MoralRadar` | Profile | Radar chart de 5 dimensiones |
| `ShareCard` | Results, Profile | Genera imagen para compartir |
| `DailyCounter` | Feed, Header | "X dilemmas left today" |
| `PrivacyBadge` | Login, Dilemma | "Your answers are always anonymous" |
| `PremiumGate` | Feed (límite) | Overlay de upgrade |

---

## 9. Navegación

**Bottom nav (autenticado):**
- Feed (home icon) — activo por defecto
- Profile (user icon)
- Settings (gear icon)

**No hay navegación lateral ni drawer** — la app es vertical y lineal por diseño.
El flujo natural es: dilema → voto → resultado → siguiente dilema.

---

## 10. Notas de diseño para UI UX Pro Max

Al generar el design system con la skill, usar este contexto:

```
Tipo de producto: Social voting app / moral dilemmas
Audiencia: Global, 18-45, mobile-first
Tono: Serio pero con humor ácido ocasional
Mood: Confianza, claridad, algo de tensión dramática
Anti-patrones a evitar: colores pasteles suaves, gradientes AI purple/pink,
  diseño "wellness", ilustraciones cute
Preferencia: Datos claros, tipografía fuerte, resultados impactantes
Stack: Next.js 15 + Tailwind + shadcn/ui
```

---

*UX v1.0 · Verdict · 73 Solutions · César · generado junio 2026*
