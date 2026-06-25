# PRD.md — Product Requirements Document
# Verdict (nombre tentativo) · 73 Solutions

> Versión: 1.0 · Estado: ✅ aprobado por César
> Última actualización: generado con Claude · junio 2026

---

## 1. Resumen ejecutivo

Verdict es una aplicación mobile-first donde los usuarios responden dilemas morales
diarios, ven cómo respondió el mundo, y acumulan un perfil de identidad moral.

**Propuesta de valor en una línea:**
> Verdict convierte opinión dispersa en señal clara — el termómetro moral del mundo.

**Nota de nombre:** "Verdict" es tentativo. Evaluar alternativas antes del lanzamiento
público con criterio psicológico (engagement, memorabilidad, alcance global).
Candidatos a explorar: Pulse, Split, The Line, Mirror.

---

## 2. El problema

### Dolor central
Las redes sociales generan debate moral pero nunca lo agregan ni lo resuelven.
Twitter/X tiene la conversación pero no la estructura. Una poll de Instagram da
porcentaje pero sin contexto, sin segmentación, sin tendencia histórica.
La gente discute pero nunca sabe realmente dónde para su sociedad en un tema concreto.

### Consecuencia
No existe un instrumento diseñado para capturar posición moral colectiva con precisión.
La necesidad de entender "cómo piensan los demás" existe pero el instrumento está roto.

### Gancho viral
El perfil moral individual no es el problema — es el mecanismo de retención y sharing.
La zanahoria que hace que la gente vuelva y comparta sus resultados.

### Oportunidad de datos
Las respuestas agregadas y segmentadas por país, cultura y demografía constituyen
un dataset de alto valor para medios, investigadores, marcas y gobiernos.
Verdict como termómetro moral global es el negocio de largo plazo.

---

## 3. Usuario objetivo

**Perfil primario:** Cualquier persona curiosa sobre cómo piensa la gente.
Sin restricción demográfica dura. El producto no requiere contexto previo
ni postura ideológica para ser útil.

**Mercado primario:** Estados Unidos (idioma base: inglés)
**Mercado global:** Desde el día 1 — los datos de país son parte del producto,
no un feature futuro. La fricción cultural entre países ES el contenido.

**Insight clave:** Lo que es controversial en México puede ser obvio en Japón.
Esa diferencia es viralidad garantizada.

---

## 4. Solución — qué es Verdict

### 4.1 Tipos de dilema (tres formatos)

**Modo rápido**
Pregunta directa + dos opciones. 3 segundos. Máxima fricción cero.
Ejemplo: *"¿Le dirías a tu amigo que su pareja le engaña?"* → [Sí] [No]

**Modo contexto**
Situación narrada en 2-3 líneas + dos opciones. Para dilemas que necesitan setup.
Ejemplo: *"Tu jefe te pide cubrir un error que afectó a un cliente.
El cliente nunca lo sabrá. ¿Lo cubres?"* → [Sí] [No]

**Modo justificación**
Después de votar, opción de escribir el razonamiento en texto libre.
La mejor justificación del día, la más votada, la más polémica — ese es
el contenido que se vuelve viral. El screenshot que va a Twitter.

### 4.2 Resultados post-voto

El usuario ve inmediatamente después de votar:
- Porcentaje global: "67% dijo Sí"
- Desglose por país/región
- Posición relativa: "Votaste como el 33% de los estadounidenses"
- Mejores justificaciones escritas (más votadas + más polémicas)
- Frase generada automáticamente — tono ácido o gracioso
  Ejemplo: *"Eres moralmente predecible"* / *"El 8% más caótico de Brasil te entiende"*

### 4.3 Perfil moral acumulado

Cada voto contribuye al perfil del usuario:
- Dimensiones: honestidad, lealtad, pragmatismo, empatía, caos
- Visible en el perfil público (sin nombre — solo el avatar y el perfil moral)
- Compartible como imagen generada automáticamente

### 4.4 Dilemas localizados

Los dilemas pueden ser globales o específicos por país/cultura.
La segmentación cultural es parte del producto, no un edge case.

---

## 5. Autenticación y privacidad

**Método:** Google Sign-In y Apple Sign-In únicamente.
Fricción mínima de entrada + identidad verificada para calidad de datos.

**Promesa de privacidad (no negociable):**
> "Tus respuestas son siempre anónimas."

Esta promesa aparece en:
- Onboarding (primera pantalla)
- Debajo de cada dilema
- En los resultados
- En los términos de uso

**Razón estratégica:** La gente vota diferente cuando sabe que nadie
los va a juzgar por nombre. La honestidad en las respuestas es
la calidad que hace valioso el dataset.

---

## 6. Modelo de monetización

### Tier Gratis
- 5 dilemas por día
- Anuncios entre dilemas (pausa natural entre preguntas)
- Resultados básicos: porcentaje global únicamente
- Perfil moral básico

### Tier Premium — $2.99/mes · $19.99/año
- Dilemas ilimitados
- Sin anuncios
- Resultados completos: desglose por país, edad, género
- Historial completo de respuestas propias
- Frases ácidas/graciosas desbloqueadas
- Acceso anticipado a dilemas virales del día

### Dilemas patrocinados (v1.1)
- Marcas pagan por dilemas contextuales con badge "Patrocinado"
- El dilema es real y relevante — el patrocinio es contextual
- Ejemplo: marca de streaming patrocina "¿Compartes tu contraseña con tu ex?"
- No interrumpe el flujo — es parte del contenido

### Verdict Insights — API de datos (v2.0)
- Dataset agregado y segmentado: país, cultura, demografía, tendencia temporal
- Vendido a: medios de comunicación, investigadores académicos,
  agencias de publicidad, marcas, gobiernos
- Producto: reportes periódicos + acceso API con rate limiting
- Requiere volumen mínimo: ~500k votos para ser creíble como dataset

---

## 7. Métricas de éxito del MVP

| Métrica | Objetivo a 30 días | Objetivo a 90 días |
|---------|-------------------|-------------------|
| Usuarios registrados | 1,000 | 10,000 |
| Votos totales | 10,000 | 150,000 |
| Retención día 7 | 20% | 35% |
| Ratio de compartir resultado | 5% de sesiones | 15% de sesiones |
| Conversión a premium | — | 2% de usuarios activos |

---

## 8. Scope del MVP — qué se construye

### ✅ Incluido en MVP

- Autenticación Google + Apple
- Feed de dilemas (los tres formatos)
- Votación con resultados en tiempo real (Supabase Realtime)
- Desglose por país post-voto
- Justificaciones escritas opcionales
- Perfil moral básico acumulado
- Límite diario de 5 dilemas (tier gratis)
- Pantalla de resultados con frase generada
- Compartir resultado como imagen (share card)
- Admin panel básico para cargar dilemas (solo César)

### ❌ Fuera del MVP (v2+)

- Anuncios y AdSense (v1.1)
- Dilemas patrocinados (v1.1)
- Desglose por edad y género (v1.1 — requiere recolección de datos en onboarding)
- Suscripción premium / paywall (v1.1)
- Notificaciones push — "nuevo dilema del día" (v1.1)
- Dilemas localizados por país (v1.1)
- Verdict Insights / API de datos (v2.0)
- App nativa iOS/Android (v2.0 — MVP es PWA o web mobile-first)
- Rankings y ligas entre usuarios (v2.0)
- Dilemas generados por usuarios (v2.0)

---

## 9. Restricciones

| Restricción | Detalle |
|-------------|---------|
| Equipo | Solo César + Claude Code |
| Tiempo objetivo | MVP funcional en 2–3 semanas desde inicio de código |
| Stack | Next.js 15 + Supabase + Vercel (no negociable) |
| Presupuesto infra | Tier gratuito de Supabase y Vercel hasta tracción |
| Idioma base | Inglés (EN-US) |
| Plataforma | Web mobile-first (no app nativa en MVP) |
| Moderación | César modera dilemas manualmente en MVP |

---

## 10. Riesgos identificados

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| Dilemas demasiado polémicos generan problemas de moderación | Alta | César aprueba cada dilema manualmente en MVP |
| Usuarios crean cuentas múltiples para manipular resultados | Media | Rate limiting por IP + Google/Apple auth |
| Bajo volumen inicial hace los datos poco representativos | Alta | Lanzar con 100 dilemas precargados de alta calidad |
| Privacidad de datos en jurisdicciones estrictas (GDPR) | Media | Votos nunca asociados a identidad real en DB |

---

## 11. Visión de largo plazo

Verdict no es solo una app de dilemas — es infraestructura para entender
la moral colectiva de la humanidad en tiempo real.

El dataset que genera tiene valor periodístico, académico, comercial y político.
"¿Qué piensa el mundo sobre X?" es una pregunta que medios, marcas y gobiernos
pagan por responder con datos reales.

**Posicionamiento a 3 años:** El termómetro moral del mundo.

---

*PRD v1.0 · Verdict · 73 Solutions · César · generado junio 2026*
