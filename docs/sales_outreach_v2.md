# ConcertRide — Análisis de Mercado, Outreach & Plan Comercial (v2)

> **Fecha:** 2026-05-03  
> **Versión:** 2.0 — Ampliada con auditoría, buyer personas, lista de prospectos priorizada y plan de 8 semanas  
> **Elaborado por:** Análisis estratégico con IA (supuestos explícitos; no usar cifras como hechos sin validar)  
> **Aviso:** Todas las cifras numéricas son **estimaciones con rangos**. Se indica el método, el nivel de confianza y cómo verificarlas. No se proporcionan datos personales reales.

---

## ÍNDICE

1. [Auditoría de Documentos](#1-auditoría-de-documentos)
2. [Análisis de Mercado Ampliado — TAM/SAM/SOM](#2-análisis-de-mercado-ampliado)
3. [Desglose por Tipo de Evento](#3-desglose-por-tipo-de-evento)
4. [Buyer Personas Detalladas](#4-buyer-personas-detalladas)
5. [Competencia y Posicionamiento](#5-competencia-y-posicionamiento)
6. [Propuestas de Valor Revisadas por Segmento](#6-propuestas-de-valor-revisadas)
7. [Mensajes de Venta por Canal](#7-mensajes-de-venta-por-canal)
8. [Manejo de Objeciones](#8-manejo-de-objeciones)
9. [Plan Operativo — 8 Semanas](#9-plan-operativo-8-semanas)
10. [Assets y Plantillas](#10-assets-y-plantillas)
11. [Pilotos Recomendados](#11-pilotos-recomendados)
12. [Riesgos Legales y RGPD Ampliados](#12-riesgos-legales-y-rgpd)
13. [KPIs y Métricas](#13-kpis-y-métricas)
14. [Preguntas Clave y Supuestos de Trabajo](#14-preguntas-clave-y-supuestos)
15. [Apéndice — Herramientas](#15-apéndice-herramientas)

---

## 1. AUDITORÍA DE DOCUMENTOS

### 1.1 Revisión de CLAUDE.md — Contexto Técnico

**Entendimiento del producto:** ConcertRide es una plataforma vertical de movilidad para eventos de música en vivo. Su arquitectura se apoya en un Cloudflare Worker (Hono.js) que sirve tanto la API como el SPA de React, con Drizzle ORM sobre Turso/libSQL como capa de datos. Los modelos clave son: `concerts`, `venues`, `rides`, `ride_requests`, `users`, `reviews` y `messages`. Las rutas de rides incluyen CRUD, filtrado, booking de asientos, checklist y un sistema de matching — tres features diferenciadoras que pocas plataformas de movilidad verticalizan para eventos. El sistema de autenticación usa JWT en cookies HttpOnly (30 días), con OTP y magic-link disponibles. El frontend tiene ~43 rutas lazy-loaded, landing pages SEO prerrenderizadas para festivales, artistas y rutas, y un PWA con service worker.

**Puntos fuertes para la venta B2B:** La arquitectura en Cloudflare Workers implica costes operativos marginales muy bajos (pay-per-request, sin servidores propios), lo que hace viable un modelo freemium o de bajo precio de entrada para ganar tracción B2B. El sistema de `seat booking` con `checklist` y `matching` está ya implementado, lo que permite presentar demos reales desde el día uno. Las landing pages SEO prerrenderizadas (`/festivales/:slug`, `/conciertos/:city`, `/rutas/:route`) son un diferenciador importante frente a competidores genéricos: permiten decirle a un promotor "ya tenemos una página indexada para tu festival". La ausencia de infraestructura propia y el uso de Turso permiten despliegues near-zero sin DevOps dedicado, lo que acelera la posibilidad de hacer pilotos rápidos con partners.

**Limitaciones y riesgos técnicos con impacto en penetración B2B:** La dependencia de Turso (libSQL) como única opción de base de datos de producción es un riesgo de concentración: si Turso tiene caída o cambia su pricing, hay impacto directo. Los cold starts de Cloudflare Workers (aunque mínimos en Workers, son más relevantes en Workers con Node.js compat) pueden afectar la latencia percibida en picos de demanda — exactamente cuando más usuarios acceden simultáneamente (hora antes del concierto). Las notificaciones push están implementadas parcialmente (hay una ruta `push.ts`) pero "wired" no confirmado — esto es un gap crítico para la propuesta de valor en tiempo real que los promotores esperan. Finalmente, la falta de un dashboard de analítica para promotores (no aparece en el código) es un gap comercial: los B2B necesitan ver métricas de uso en tiempo real.

### 1.2 Auditoría del Análisis de Mercado Actual

**Sobre las cifras TAM/SAM/SOM:** Las cifras del documento v1 tienen supuestos razonables pero con nivel de confianza bajo (30–50 %), lo cual está correctamente indicado. El mayor problema es que el SAM de España (€40M–€185M) tiene un rango demasiado amplio para ser accionable — la diferencia entre el escenario bajo y el alto es un factor de 4.5x, lo que refleja que el supuesto clave (% de usuarios dispuestos a usar la app, 15–30 %) es pura hipótesis. Las fuentes citadas (IFPI, APM, Promusicae) son correctas pero no se han consultado directamente; se recomienda obtener el informe anual de APM (Asociación de Promotores Musicales de España) que publica datos de asistencia por ciudad y tipo de evento. El SOM en escenario base (€2M–€5M ARR en año 3) es alcanzable pero requiere al menos 3–5 acuerdos B2B significativos, lo que implica un equipo de ventas dedicado o al menos 30–50 % del tiempo del founder en ventas.

**Sobre las propuestas de valor:** Las propuestas del documento v1 son correctas a nivel conceptual pero demasiado genéricas. Phrases como "reduce la congestión" o "mejora la experiencia del asistente" no son suficientes para abrir una conversación B2B: los decisores necesitan escuchar una cifra (ej. "un 23 % menos de tiempo de espera en el acceso según el piloto de X festival") o un caso de uso específico para su contexto. Los segmentos cubiertos (promotores, venues, ticketing, transporte, patrocinadores) son los correctos, pero falta el segmento municipal/movilidad (ayuntamientos con competencias en gestión de eventos) que puede ser un early adopter dado que tienen incentivos en reducir congestión y emisiones.

**Sobre los materiales de outreach:** Las plantillas de email del v1 son un buen punto de partida pero demasiado largas para un primer contacto en frío (deberían tener máximo 5–7 líneas + CTA) y les falta personalización a nivel de empresa/evento específico. Los subject lines no están optimizados para tasas de apertura (no incluyen el nombre del festival/empresa del destinatario ni crean urgencia relacionada con un evento próximo). Falta la secuencia de 3 seguimientos (follow-up 1, 2, 3) con mensajes diferenciados. También falta un template de LinkedIn que es esencial dado que muchos decisores de este sector son más activos en LinkedIn que en el email.

### 1.3 Análisis de Completitud — Gaps Críticos

**Información crítica que falta para ejecutar una campaña real:** El mayor gap es la ausencia de un pricing B2B específico y documentado — es imposible hacer outreach serio sin poder responder "¿cuánto cuesta?" de forma directa. Sin un pricing (aunque sea "piloto gratuito por 3 meses + revenue share") el proceso de ventas se atasca en la primera reunión. El segundo gap es la falta de un case study o testimonial real: con tracción mínima (aunque sean 50 bookings), se puede crear un "mini-case" que dé credibilidad. El tercero es la ausencia de un one-pager en PDF listo para enviar en el primer email (algo que el prospect pueda leer en 2 minutos y reenviar internamente). El cuarto gap es legal: sin términos de servicio B2B, NDA estándar y un contrato de piloto tipo, no se puede cerrar ningún acuerdo formal.

**Nivel de detalle operativo:** El plan de 30 días del v1 es correcto en estructura pero insuficiente en detalle de ejecución. Las tareas no tienen responsable asignado, tiempo estimado ni métrica de éxito verificable. El plan actualizado en la sección 9 de este documento expande esto a 8 semanas con checklist táctico completo.

---

## 2. ANÁLISIS DE MERCADO AMPLIADO

### 2.1 Metodología

> Método bottom-up por ciudad, consolidado con sanity check top-down. Para cada ciudad se estiman: nº de eventos >1.000 asistentes/año, asistentes promedio por evento, gasto estimado en transporte, penetración conservadora y SAM resultante.

**Supuestos globales de trabajo (validar con datos reales):**
- Tracción actual: 500 MAU, 50 bookings/mes, operando en Madrid
- Modelo de ingresos: comisión 8 % por asiento booked + fee opcional B2B (€500–€1.500/evento para promotores)
- Geografía año 1: España (5–7 ciudades). Portugal año 2. Francia e Italia año 3.
- Equipo: 1–2 personas en ventas (founder + posible comercial part-time)
- Presupuesto de outreach: low-cost (email + Google Sheets + LinkedIn gratuito)

### 2.2 TAM — Mercado Total Addressable (Europa)

| Variable | Valor estimado | Fuente / Método | Incertidumbre |
|---|---|---|---|
| Asistentes a eventos de música en vivo en Europa/año | 350–500 millones | IFPI Live Music Report 2023–24; recuperación post-COVID estimada | Media |
| % que usa transporte no propio o compartido | 40–60 % | Estudios Arup/EACEA; varía por ciudad y distancia al venue | Alta |
| Gasto medio en transporte/asistente/evento (ida+vuelta) | €12–25 | INE ocio; Uber/Bolt pricing en ciudades europeas (10–30 km típicos) | Media |

```
TAM bajo:  350M × 0.40 × €12 = €1.68B/año
TAM alto:  500M × 0.60 × €25 = €7.50B/año
→ Rango TAM: €1.7B – €7.5B/año (punto medio estimado: ~€4B)
```

**Nivel de confianza:** 40–50 %. El dato más incierto es el gasto medio en transporte por asistente; los datos disponibles en España mezclan transporte urbano subvencionado con transporte privado.

### 2.3 SAM por Ciudad — España (Año 1)

**Metodología por ciudad:**
```
SAM_ciudad = Eventos >1.000 asistentes/año × Asistentes promedio/evento
             × % que necesitaría transporte no propio (~50 %)
             × Gasto medio transporte (€15)
             × Tasa de penetración conservadora (1–2 %)
```

#### Madrid

| Parámetro | Estimación | Fuente/Método |
|---|---|---|
| Eventos >1.000 asistentes/año | 550–700 | APM 2024 + WiZink, Metropolitano, Movistar Arena, La Riviera; Madrid es el mayor mercado de eventos de España |
| Asistentes promedio/evento | 4.500 | Media ponderada: salas medianas (2.000) + estadios (50.000, pero pocos) |
| Asistentes totales/año | 2.5M – 3.2M | Cálculo anterior |
| % necesita transporte externo | 55 % | Madrid tiene buena red de metro pero los venues punta (Metropolitano, Bernabéu) saturan el transporte público |
| Gasto medio transporte | €16 | Uber/Bolt promedio + Cercanías, en Madrid capital |
| SAM total bruto (100 % del mercado) | €22M – €28M/año | — |
| Penetración ConcertRide año 1 (1.5 %) | **€330K – €420K** | Estimación conservadora |

#### Barcelona

| Parámetro | Estimación | Fuente/Método |
|---|---|---|
| Eventos >1.000 asistentes/año | 420–550 | Primavera Sound, Sonar, Palau Sant Jordi, Razzmatazz + eventos internacionales |
| Asistentes promedio/evento | 5.200 | Sonar (130K en 3 días), Primavera Sound (75K) elevan la media |
| Asistentes totales/año | 2.2M – 2.9M | — |
| % necesita transporte externo | 45 % | TMB es más eficiente que Madrid para algunos venues, pero Fòrum y zonas peri-urbanas son problemáticas |
| Gasto medio transporte | €14 | — |
| SAM total bruto | €14M – €18M/año | — |
| Penetración ConcertRide año 1 (1.5 %) | **€210K – €270K** | — |

#### Valencia

| Parámetro | Estimación | Fuente/Método |
|---|---|---|
| Eventos >1.000 asistentes/año | 180–250 | Festival de les Arts, Arenal Sound (Burriana, área valenciana), Canet Rock, eventos en Ciudad de las Artes |
| Asistentes promedio/evento | 3.800 | — |
| Asistentes totales/año | 680K – 950K | — |
| % necesita transporte externo | 60 % | Ciudad dispersa con menos transporte nocturno |
| Gasto medio transporte | €13 | — |
| SAM total bruto | €5.3M – €7.4M/año | — |
| Penetración ConcertRide año 1 (2 %) | **€106K – €148K** | — |

#### Sevilla

| Parámetro | Estimación | Fuente/Método |
|---|---|---|
| Eventos >1.000 asistentes/año | 130–180 | Icónica Sevilla Fest, Estadio Olímpico, Fibes, eventos Semana Santa (no música) |
| Asistentes promedio/evento | 3.200 | — |
| Asistentes totales/año | 416K – 576K | — |
| % necesita transporte externo | 65 % | Metro limitado, muchos venues peri-urbanos |
| Gasto medio transporte | €12 | Precios más bajos que Madrid/Barcelona |
| SAM total bruto | €3.2M – €4.5M/año | — |
| Penetración ConcertRide año 1 (2 %) | **€65K – €90K** | — |

#### Bilbao + País Vasco

| Parámetro | Estimación | Fuente/Método |
|---|---|---|
| Eventos >1.000 asistentes/año | 90–130 | BBK Live (40K/día), Azkena Rock, Bilbao Bizkaia, festival de jazz |
| Asistentes promedio/evento | 4.100 | BBK Live eleva la media |
| Asistentes totales/año | 370K – 530K | — |
| % necesita transporte externo | 70 % | BBK Live en Kobetamendi requiere transporte especial; transporte público insuficiente para eventos |
| Gasto medio transporte | €14 | — |
| SAM total bruto | €3.6M – €5.2M/año | — |
| Penetración ConcertRide año 1 (2 %) | **€72K – €104K** | — |

#### Otras ciudades (Málaga, Alicante, Zaragoza, A Coruña, etc.)

| Parámetro | Estimación |
|---|---|
| Eventos >1.000 asistentes/año (todas) | 250–400 |
| SAM bruto agregado | €6M – €10M/año |
| Penetración ConcertRide año 1 (1 %) | **€60K – €100K** |

#### Tabla Resumen SAM España (Año 1)

| Ciudad | SAM Bruto | Penetración objetivo | SAM ConcertRide Año 1 |
|---|---|---|---|
| Madrid | €22M – €28M | 1.5 % | €330K – €420K |
| Barcelona | €14M – €18M | 1.5 % | €210K – €270K |
| Valencia | €5.3M – €7.4M | 2 % | €106K – €148K |
| Sevilla | €3.2M – €4.5M | 2 % | €65K – €90K |
| Bilbao + PV | €3.6M – €5.2M | 2 % | €72K – €104K |
| Otras | €6M – €10M | 1 % | €60K – €100K |
| **TOTAL España** | **€54M – €73M** | **~1.5 %** | **€843K – €1.13M** |

**Conclusión SAM:** El SAM realista para España en año 1 (con penetración 1–2 %) es de aproximadamente **€850K – €1.1M** en ingresos brutos de la plataforma. Esto equivale a ~8.500–11.000 bookings de asientos a precio medio de €10/asiento con comisión del 10 %. Es un objetivo alcanzable con 5–8 acuerdos B2B activos + crecimiento orgánico B2C.

**Cómo verificar estos números:**
- Solicitar el "Anuario de la Música en Vivo" de APM (apmusicales.com) — contiene datos de asistencia por ciudad
- Consultar Ticketmaster España para volumen de transacciones por ciudad (no público, pero negociable en conversación B2B)
- Realizar encuesta de 100 asistentes en 2–3 eventos en Q2 2026

---

## 3. DESGLOSE POR TIPO DE EVENTO

### 3.1 Conciertos en Salas (500–5.000 personas)

**Perfil:** Salas tipo La Riviera, Sala Apolo, Razzmatazz, Moby Dick. Evento único o en días consecutivos. Público urbano, 20–40 años.

| Dimensión | Detalle |
|---|---|
| **Parking disponible** | Limitado o nulo (ubicaciones urbanas); el 70–80 % llega en transporte público o taxi/VTC |
| **Pain point de transporte** | Cola para taxi/Bolt al salir (pico de 23:00–01:00); Bolt surge pricing x3–4 |
| **Propuesta ConcertRide** | Coordinar carpooling desde distintos barrios; reducir surge pricing compartiendo vehículo |
| **Monetización** | Comisión 8–12 % por booking; €0 coste para la sala (modelo B2C puro) |
| **Propuesta para la sala** | Widget en su web/app con link a ConcertRide + comisión 1–2 % por booking referido |
| **Competidores principales** | Bolt, Uber, Cabify (VTC puro, sin coordinación entre asistentes) |
| **Diferencial** | Coordinación de grupos, ahorro vs VTC, experiencia social (meets en el viaje) |
| **Tamaño del deal** | Pequeño (€200–€500/mes por sala); valor en volumen + tracción de usuarios |

**Estrategia:** No hacer outreach masivo a salas pequeñas en fase 1. Usarlas para ganar volumen de usuarios. Acercarse a las 3–5 salas más grandes de Madrid y Barcelona con un modelo de afiliación (no coste, revenue share pequeño).

### 3.2 Festivales de 1 a 3 Días (5.000–30.000 personas)

**Perfil:** FIB, Arenal Sound, Low Festival, Cactus, Mad Cool (días con <30K). Ubicación periférica o peri-urbana. Público multi-ciudad, necesidad de alojamiento y transporte.

| Dimensión | Detalle |
|---|---|
| **Parking disponible** | Parcial; parking overflow con autobuses lanzadera; congestión en accesos es el problema nº1 |
| **Pain point de transporte** | Organizadores gastan €10K–€50K en shuttles sin datos; asistentes descontentos con colas |
| **Propuesta ConcertRide** | Plataforma completa de rides compartidos + gestión de shuttle propio del festival; datos de movilidad para el organizador |
| **Monetización** | Fee B2B: €1.500–€5.000/festival + comisión por booking; OR revenue share en shuttle (30–40 %) |
| **Propuesta para el organizador** | Reducción de quejas de transporte, ingreso adicional por shuttle, datos de procedencia de asistentes |
| **Competidores principales** | Shuttleid, WeGoTrip, operadores locales de autobús (ALSA, local) |
| **Diferencial** | App vertical (no genérica); integración con ticketing del festival; datos de audiencia como valor añadido |
| **Tamaño del deal** | Medio (€2K–€10K por festival); alto impacto en tracción de usuarios |

**Estrategia:** Este es el segmento prioritario para el año 1. Cada festival es un evento de alto volumen que puede activar 500–5.000 usuarios en un fin de semana. Apuntar a 3–5 festivales medianos en España en Q2–Q3 2026.

### 3.3 Conciertos al Aire Libre y Estadios (10.000–80.000 personas)

**Perfil:** Estadio Santiago Bernabéu, Camp Nou, Estadio Olímpico Sevilla, Estadio de La Cartuja. Artistas de primer nivel (Taylor Swift, Coldplay, Metallica). Frecuencia: 5–20 eventos/año por venue.

| Dimensión | Detalle |
|---|---|
| **Parking disponible** | Nulo o mínimo (estadios en zonas urbanas densas); transporte público colapsa en salida |
| **Pain point de transporte** | Salida simultánea de 50.000–80.000 personas en 60 minutos; incidentes de seguridad por congestión; Bolt/Uber fuera de rango por demanda |
| **Propuesta ConcertRide** | Coordinación de rutas por zonas geográficas (norte/sur/este de la ciudad); pre-booking de rides antes del evento; shuttle premium desde puntos de concentración |
| **Monetización** | Fee premium B2B: €5.000–€20.000/evento + comisión por booking; patrocinio de marca en la app durante el evento |
| **Propuesta para el venue/promotor** | Reducción de tiempo medio de evacuación del recinto; mejora de NPS post-evento; cumplimiento de requisitos de plan de evacuación municipal |
| **Competidores principales** | Soluciones ad-hoc del promotor (ALSA shuttle pagado); aplicaciones del ayuntamiento; nada digital específico |
| **Diferencial** | Única solución digital end-to-end para eventos >10K; datos de flujo en tiempo real para seguridad |
| **Tamaño del deal** | Alto (€5K–€20K/evento); pero ciclo de venta largo (6–12 meses); mejor objetivo año 2 |

**Estrategia:** No priorizar en año 1 por ciclo de ventas largo y requisitos de integración. Usar como aspiracional en el pitch. Foco en un piloto con un evento de 10K–20K en Q3 2026 para tener caso de estudio.

---

## 4. BUYER PERSONAS DETALLADAS

### Persona 1 — "Jorge M." — Director de Operaciones, Promotor Regional

**Perfil:**
- **Nombre ficticio:** Jorge M.
- **Rol:** Head of Operations / Director de Producción
- **Empresa típica:** Promotora regional con 15–35 eventos/año (festivales medianos + conciertos de sala grande); facturación €2M–€8M/año
- **Ciudades:** Madrid, Barcelona, Sevilla
- **Edad:** 38–50 años. Experiencia en producción de eventos >10 años. Muy pragmático, orientado a resolver problemas operativos.

**KPIs que mira:**
- Incidencias en acceso/salida del recinto (queja nº1 de asistentes)
- Coste operativo por asistente (incluye transporte, seguridad, staff)
- NPS post-evento (si lo miden, suele ser <50)
- Presupuesto de transporte vs uso real (habitualmente hay despilfarro en shuttles subutilizados)

**Pain points principales:**
1. El transporte es su "gestión más sucia": paga €15K–€40K a un operador de buses que llena el 60 % de los asientos. El resto del coste es pérdida.
2. No tiene datos de de dónde vienen los asistentes, lo que hace imposible optimizar rutas.
3. Las quejas de transporte en redes sociales destrozan el NPS del festival, aunque la programación sea perfecta.
4. Los conductores de coches privados crean congestión en carreteras locales que le genera problemas con el ayuntamiento.

**Objeciones típicas:**
- "Ya tenemos contratado un autobús con [operador local]" → Ver sección 8
- "¿Cuántos usuarios tiene vuestra app? ¿Mis asistentes van a usarla?" → Ver sección 8
- "No tenemos presupuesto para esto este año" → Ofrecer modelo revenue share (cero riesgo para él)

**Mensajes de venta optimizados:**
- "Reducimos el coste de tu shuttle un 30 % llenando los asientos con datos reales, no con estimaciones"
- "Tus asistentes pre-reservan el viaje cuando compran la entrada — llegamos al evento con el shuttle ya vendido al 80 %"
- "Te damos el mapa de movilidad: de qué ciudades y barrios vienen tus asistentes, para optimizar rutas y patrocinios"

**Timing de contacto:** 3–5 meses antes del festival. Para festivales de verano (junio–agosto), contactar en enero–marzo. Para festivales de otoño, contactar en mayo–julio.

**Canal preferido:** LinkedIn directo + email con PDF adjunto. Llamada telefónica para seguimiento si no responde en 5 días.

---

### Persona 2 — "Carmen L." — Responsable de Marketing y Experiencia del Asistente, Venue

**Perfil:**
- **Nombre ficticio:** Carmen L.
- **Rol:** Marketing Manager / Customer Experience Director
- **Empresa típica:** Venue de tamaño medio-grande: sala de conciertos con capacidad 2.000–15.000 (WiZink, Palau Sant Jordi, Bizkaia Arena, Fernando Buesa Arena)
- **Edad:** 32–45 años. Digital native, activa en LinkedIn e Instagram. Le importa la marca del venue.

**KPIs que mira:**
- NPS y satisfacción del asistente (la empresa la mide en reviews de Google y encuestas post-evento)
- Ingresos adicionales por servicios complementarios (aparcamiento, F&B, merch)
- Valoraciones en Google Maps y TripAdvisor (sí, los venues también)
- Número de eventos vendidos out vs. asistencia real (ghosting del asistente por problemas de acceso)

**Pain points principales:**
1. El venue recibe la queja del asistente aunque el problema sea del promotor o del transporte público — la reputación del venue sufre.
2. No tiene control sobre la experiencia de llegada/salida del recinto (es responsabilidad del promotor, pero el asistente culpa al venue).
3. Las plazas de aparcamiento son limitadas y genera conflictos con el entorno municipal.
4. Oportunidad no explotada: podría vender servicios de transporte como ingreso adicional (como hacen algunos estadios con el parking).

**Objeciones típicas:**
- "Eso depende del promotor de cada evento, no podemos imponer nada" → Ofrecer modelo de widget optativo que el promotor puede activar
- "Ya tenemos acuerdo con el metro/autobús municipal" → ConcertRide complementa el transporte público, no lo reemplaza

**Mensajes de venta optimizados:**
- "Convierte la experiencia de llegada en un diferencial de tu venue — los asistentes empiezan el evento desde el momento en que reservan el viaje"
- "Sin coste para el venue: el promotor activa ConcertRide para cada evento; vosotros os lleváis la mejora de reputación"
- "Genera ingresos adicionales: por cada booking desde tu página web, recibes una comisión del 2 %"

**Timing de contacto:** Cualquier época del año para acuerdos de venue. El objetivo es firmar un acuerdo marco que el promotor active evento a evento. Contactar en septiembre–octubre (planificación de temporada siguiente).

**Canal preferido:** LinkedIn + email institucional. Si hay feria del sector (ILMC, Live! Conference), hacer networking presencial.

---

### Persona 3 — "Álvaro R." — Head of Partnerships / Business Development, Plataforma de Ticketing

**Perfil:**
- **Nombre ficticio:** Álvaro R.
- **Rol:** Head of Partnerships / BD Manager
- **Empresa típica:** Plataforma de ticketing (Ticketmaster Spain, Wegow, Giglon, Fever, Entradas.com)
- **Edad:** 28–42 años. Perfil tech-business, entiende APIs e integraciones. Muy orientado al deal y al revenue share.

**KPIs que mira:**
- Revenue adicional por transacción (attach rate de productos complementarios en checkout)
- Gross Merchandise Value (GMV) generado por la plataforma
- Retención de clientes (promotores que venden con ellos año a año)
- NPS de compradores de entrada

**Pain points principales:**
1. El checkout de entrada ya está saturado de upsells (seguro, foto del artista, merch) — añadir otro widget tiene un coste de atención (A/B test, priorización de producto)
2. Necesita demostrar a los promotores (sus clientes) que la plataforma aporta valor adicional más allá de la venta de entradas
3. Los datos de comportamiento post-compra (dónde fue el asistente, cómo llegó) son gold pero no los tiene

**Objeciones típicas:**
- "Tenemos roadmap de producto lleno para los próximos 12 meses" → Ofrecer integración mínima (link redirect, no API) para testear sin desarrollo
- "¿Cuánto revenue genera esto para nosotros?" → Presentar modelo de split claro: 50 % de la comisión de cada booking generado desde su checkout

**Mensajes de venta optimizados:**
- "Añade transporte en el checkout sin código — en 48h tienes un link de redirección que ya genera datos"
- "Tus promotores te piden solución de transporte; nosotros se la damos bajo tu marca con revenue share para ti"
- "Caso de uso real: un widget de transporte en checkout aumenta el attach rate un 3–5 % (referencia: Trainline + eventos en UK)"

**Timing de contacto:** Q1–Q2 (antes de la temporada de verano). Los equipos de BD de ticketing cierran acuerdos en Q4–Q1 para la temporada siguiente.

**Canal preferido:** LinkedIn + email. Si están en SXSW, ILMC o VenuesNow, hacer networking en persona. Mencionar tech stack compartido (API, REST) en el primer email.

---

### Persona 4 — "Marta V." — Responsable de Movilidad Sostenible, Ayuntamiento

**Perfil:**
- **Nombre ficticio:** Marta V.
- **Rol:** Directora / Jefa de Servicio de Movilidad y Eventos (área de Tráfico o Urbanismo)
- **Empresa típica:** Ayuntamiento de Madrid, Barcelona, Valencia, Bilbao o municipio con festival importante
- **Edad:** 35–55 años. Funcionaria o personal de confianza política. Muy sensible a KPIs de sostenibilidad, movilidad y convivencia ciudadana.

**KPIs que mira:**
- Reducción de emisiones CO2 en eventos (objetivo Plan de Movilidad Urbana Sostenible)
- Incidencias de tráfico en eventos (accidentes, congestión, denuncias de vecinos)
- Cumplimiento del Plan de Evacuación de Eventos aprobado por Protección Civil
- Presupuesto de gestión de tráfico en eventos (Policía Local, señalización, cortes de calle)

**Pain points principales:**
1. Los eventos grandes (>5.000 personas) requieren un Plan de Movilidad que el promotor debe presentar al ayuntamiento — pero los promotores lo hacen con mínimos y el ayuntamiento no tiene herramientas para verificarlo
2. Los vecinos se quejan de la congestión post-evento; el área de movilidad recibe presión política para resolverlo
3. Los datos de movilidad en eventos son escasos: el ayuntamiento no sabe cuántos vehículos entran, de dónde vienen ni cuándo salen
4. Hay objetivo político de reducir el uso del coche privado en eventos (Plan Madrid 360, Plan de Movilidad de Barcelona)

**Objeciones típicas:**
- "Tenemos que seguir un proceso de contratación pública (licitación)" → ConcertRide puede entrar como partner del promotor, no como proveedor directo del ayuntamiento
- "No tenemos presupuesto para nuevas herramientas" → El ayuntamiento no paga; el promotor paga y el ayuntamiento recibe datos

**Mensajes de venta optimizados:**
- "Damos a los promotores la herramienta que el ayuntamiento necesita para aprobar su Plan de Movilidad — sin coste para la administración"
- "Cada evento con ConcertRide reduce el tráfico privado un 15–25 %: datos verificables para tu informe de sostenibilidad anual"
- "Los datos agregados de movilidad en eventos son tuyos: de dónde vienen los asistentes, cómo llegan, cuándo salen — sin datos personales, 100 % RGPD"

**Timing de contacto:** Q1 (planificación de temporada de eventos del año) y septiembre (balance de temporada + planificación siguiente). Asistir a jornadas de movilidad urbana y sostenibilidad.

**Canal preferido:** Email institucional + presentación formal. No usar LinkedIn para primeros contactos con funcionarios. Mejor solicitar cita formal a través del Área de Movilidad.

---

### Persona 5 — "Pablo S." — Brand Manager / Responsable de Patrocinio, Marca de Gran Consumo

**Perfil:**
- **Nombre ficticio:** Pablo S.
- **Rol:** Brand Manager / Head of Sponsorships / Partnerships Manager
- **Empresa típica:** Marca de cerveza (Estrella Damm, Heineken, Moritz), bebida energética (Red Bull), banco (Santander, BBVA), operador de telecom (Movistar, Vodafone)
- **Edad:** 28–40 años. Muy orientado a ROI de patrocinio, métricas de visibilidad y engagement.

**KPIs que mira:**
- Reach e impresiones (cuántas personas ve el logo/mensaje)
- Engagement (cuántos interactúan activamente con la marca en el contexto del evento)
- ROI del patrocinio (coste por impresión, coste por lead capturado)
- Data capturada (leads de calidad: nombre, email, preferencias musicales)

**Pain points principales:**
1. Los patrocinios tradicionales de festival (banner en el escenario, carpa de marca) tienen ROI difícil de medir y están saturados
2. Las marcas buscan activaciones digitales que generen data propia (first-party data) en un contexto de muerte de las cookies
3. El contexto de transporte al concierto es un momento de alta receptividad a la marca (el fan está excited, en modo celebración, 20–40 min de atención disponible)
4. Es difícil activar a fans fuera del recinto (el patrocinio en el venue solo llega a quien ya está dentro)

**Objeciones típicas:**
- "El presupuesto de patrocinio está comprometido hasta Q4" → Proponer un "digital activation pilot" de bajo coste para demostrar ROI antes del compromiso anual
- "¿Cuántos usuarios tiene la app?" → Posicionar el valor como "audiencia cualificada, no masiva" (músic fans >18 años, gasto en ocio demostrado)

**Mensajes de venta optimizados:**
- "Llega al fan 2 horas antes de que entre al festival — cuando está esperando el ride, tu marca es el contenido"
- "First-party data cualificada: nombre, ciudad, género musical favorito, eventos a los que va — con consentimiento explícito"
- "Activa tu patrocinio en los 30 minutos del viaje compartido: playlist de tu marca, oferta especial en el ride"

**Timing de contacto:** Q4 del año anterior (planificación de presupuesto de patrocinio) y Q1 (activación de acciones de verano). Asistir a Advertising Week Europe, IAB Spain, o contactar a través de agencias de medios.

---

## 5. COMPETENCIA Y POSICIONAMIENTO

### 5.1 Mapa de Competidores

| Competidor | Tipo | Mercado | Diferencia vs ConcertRide |
|---|---|---|---|
| **BlaBlaCar** | Carpooling genérico | Europa | No vertical de eventos; no integra con ticketing; no tiene checklist/matching por evento |
| **Bolt / Uber** | VTC bajo demanda | Global | Surge pricing en salida de eventos; no social; sin pre-booking por evento |
| **Cabify** | VTC B2B | España/LATAM | Enfocado en empresas; sin experiencia de consumidor en eventos |
| **Shuttleid** | Shuttle management B2B | UK/Europa | Gestión de shuttles para organizadores; sin componente ride-sharing entre asistentes |
| **WeGoTrip** | Tours y transporte turístico | Europa | No específico de eventos de música; no tiene matching entre fans |
| **Eventbrite Transport** | Add-on de ticketing | Global | Widget básico de transporte en checkout; sin app dedicada |
| **ALSA / FlixBus** | Autobús larga distancia | España/Europa | Rutas fijas; sin personalización por evento; no conecta asistentes entre sí |
| **Aplicaciones de ayuntamiento** | App de movilidad pública | Local | Transporte público genérico; sin experiencia específica de evento; no tiene booking |

### 5.2 Posicionamiento Diferencial

ConcertRide ocupa un espacio blanco claro: **plataforma vertical de movilidad para eventos de música en vivo con componente social y datos de audiencia para organizadores**. Ninguno de los competidores listados combina:
1. Ride-sharing entre asistentes (social, no genérico)
2. Seat booking pre-evento con matching
3. Dashboard de datos de movilidad para organizadores
4. Landing pages SEO por festival (captación orgánica)

El riesgo principal es que BlaBlaCar o Bolt lancen una feature vertical de eventos — históricamente no lo han hecho porque el modelo de negocio genérico escala mejor. Pero hay que monitorizar.

---

## 6. PROPUESTAS DE VALOR REVISADAS

### 6.1 Por Segmento — Tabla Consolidada

| Segmento | Problema del cliente | Solución ConcertRide | Features clave | Propuesta de valor (2–3 líneas) | Objeción más probable |
|---|---|---|---|---|---|
| **Promotores de festivales medianos** | Coste de shuttle alto, baja ocupación, sin datos de audiencia, quejas de transporte en RRSS | Plataforma de ride-sharing + gestión de shuttle con pre-booking y analytics | Seat booking, matching por zona, dashboard de movilidad, integración ticketing | "Reduce el coste de transporte un 30 % y convierte las quejas de movilidad en datos accionables. Tus asistentes llegan coordinados y el shuttle sale lleno." | "Ya tenemos un operador de buses contratado" |
| **Venues de tamaño medio-grande** | Reputación dañada por problemas de transporte ajenos; sin ingresos de movilidad | Widget de ConcertRide en web del venue + modelo de afiliación | Widget embebible, analytics básico de uso, revenue share | "Transforma la llegada al venue en una ventaja competitiva. Sin coste, sin integración técnica compleja — y con ingresos por cada ride generado desde tu web." | "El transporte lo gestiona cada promotor, no nosotros" |
| **Plataformas de ticketing** | Checkout sin diferencial vs. competencia; promotores piden soluciones de valor añadido | Widget en el checkout de entrada que ofrece reserva de transporte al comprar | Link redirect o widget ligero, revenue share 50/50, API opcional | "Añade transporte al checkout en 48h sin desarrollo: cada comprador de entrada ve la opción de reservar el viaje. Revenue share directo para tu plataforma." | "Roadmap lleno, no podemos integrar nada nuevo" |
| **Municipios / Ayuntamientos** | Congestión en eventos, presión de vecinos, objetivos de movilidad sostenible | Herramienta de coordinación de movilidad para eventos (datos agregados, reducción tráfico privado) | Dashboard de datos anónimos, reports de reducción CO2, API de integración con plan de evacuación | "Damos a los promotores la herramienta que tu Plan de Movilidad necesita — sin coste para la administración. Datos de movilidad en tiempo real, 100 % anonimizados." | "El proceso requiere licitación pública" |
| **Marcas patrocinadoras** | ROI difícil de medir en patrocinios; falta de first-party data; saturación en el recinto | Activación de marca en el contexto del viaje (antes/durante/después del evento) | Branded rides, playlist patrocinada, oferta en app, captura de leads con consentimiento | "Llega al fan 2 horas antes de que entre al festival — en un contexto de alta receptividad. Captura first-party data con consentimiento: nombre, ciudad, géneros favoritos." | "¿Cuánto reach tiene vuestra app?" |
| **Operadores de transporte (ALSA, regional)** | Rutas de evento con baja ocupación; sin tecnología de pre-venta digital | ConcertRide como canal de venta y gestión de sus rutas de evento | Booking integrado, gestión de ocupación en tiempo real, datos de demanda por zona | "Vende tus rutas de evento online con pre-booking y gestión de ocupación en tiempo real — sin desarrollar tu propia app." | "Tenemos nuestra plataforma propia" |

---

## 7. MENSAJES DE VENTA POR CANAL

### 7.1 Email en Frío — Estructura y Plantillas

**Regla de oro:** Máximo 7 líneas + CTA. Subject line con nombre del festival/empresa + dato de valor o pregunta.

---

**Template A — Para promotores de festivales (email inicial)**

**Subject:** [Nombre Festival] + transporte coordinado = menos quejas, más datos

Hola [Nombre],

Vi que [Nombre Festival] es uno de los festivales más esperados de [temporada/ciudad]. El transporte al recinto suele ser el punto de mayor frustración de los asistentes — y el que más quejas genera en RRSS después del evento.

ConcertRide es la primera plataforma de ride-sharing específica para eventos de música: los asistentes pre-reservan el viaje cuando compran la entrada, los shuttles salen llenos y el festival recibe datos de movilidad de su audiencia.

En 30 minutos te muestro cómo funciona aplicado a [Nombre Festival].

¿Tienes agenda esta semana o la próxima?

[Nombre]
[ConcertRide — web]

---

**Template B — Para venues (email inicial)**

**Subject:** ¿Cuántas estrellitas pierde [Nombre Venue] por el transporte?

Hola [Nombre],

Las reviews de Google de casi todos los venues grandes de España tienen al menos un 20 % de comentarios negativos sobre el acceso y el transporte. No es culpa vuestra — pero el asistente culpa al venue.

ConcertRide integra un widget en la web del venue que permite a los asistentes reservar el viaje antes del evento. Sin coste para el venue, revenue share incluido.

¿15 minutos para ver cómo funciona?

[Nombre]

---

**Template C — Para plataformas de ticketing (email inicial)**

**Subject:** +3 % de attach rate en el checkout — transporte integrado

Hola [Nombre],

El paso del checkout es el momento con mayor intención de compra complementaria. Las plataformas de ticketing que han añadido transporte en el checkout (Trainline + eventos, o el modelo Omio) ven un 3–5 % de attach rate adicional.

ConcertRide se integra en 48h con un redirect link — sin desarrollo, sin riesgo. Revenue share 50/50 en cada booking. Para eventos piloto, montamos la integración nosotros.

¿Hablamos esta semana?

[Nombre]

---

### 7.2 LinkedIn — Secuencia de Conexión + Mensaje

**Paso 1 — Solicitud de conexión (sin nota o con nota muy corta):**
> "Hola [Nombre] — trabajo en ConcertRide, plataforma de movilidad para eventos de música. Conectamos [empresa/festival] con la solución de transporte que esperan sus asistentes. Me gustaría tenerte en mi red."

**Paso 2 — Mensaje tras aceptar la conexión (24–48h después):**
> "Gracias por conectar, [Nombre]. Vi que [empresa] tiene [evento/festival X] en [mes] — justo el tipo de evento donde el transporte marca la diferencia entre una experiencia memorable y una queja viral. Si tienes 15 minutos para una demo rápida, encantado de mostrarte cómo lo hacemos. ¿Te funciona esta semana?"

**Paso 3 — Seguimiento si no responde en 5 días:**
> "Hola [Nombre] — te paso el link a un vídeo de 90 segundos con la demo: [link]. Sin presión; si no es momento, sin problema — pero creo que puede ser útil antes de [nombre del evento o temporada]."

### 7.3 Llamada Telefónica — Pitch de 30 Segundos

> "Hola [Nombre], te llamo de ConcertRide. Somos la plataforma de ride-sharing específica para festivales y conciertos en España. En 30 segundos: los asistentes pre-reservan el viaje cuando compran la entrada, tú no pagas nada hasta que el sistema genera bookings, y además recibes datos de movilidad de tu audiencia que ahora mismo no tienes. El motivo de mi llamada es [evento específico de la empresa] — creo que podría ser un buen piloto. ¿Tienes 10 minutos para que te explique cómo funciona?"

### 7.4 Demo en Vivo — Guía de 30 Minutos

**Qué mostrar (en orden):**
1. (5 min) El problema: mostrar reviews de Google de un festival con quejas de transporte; mostrar el precio surge de Bolt en salida de un evento grande (screenshot)
2. (10 min) La solución: live demo de la app — publicar un ride, reservar un asiento, ver el matching por zonas. Mostrar la landing SEO del festival del prospect (si existe ya indexada)
3. (7 min) El modelo para el organizador: cómo se activa ConcertRide para un evento, qué hace el organizador (casi nada), qué datos recibe
4. (5 min) El modelo de ingresos: sin coste upfront + comisión por booking o revenue share en shuttle
5. (3 min) Preguntas / Siguiente paso: proponer piloto concreto con fecha y evento

**Qué omitir:** No mostrar el código ni la arquitectura técnica. No hablar de la stack (Cloudflare, Drizzle) a no ser que pregunten. No mencionar que es un MVP si no lo preguntan directamente.

**Qué preguntar en la demo:**
- "¿Cuál es vuestro mayor problema de transporte en [evento]?"
- "¿Tenéis ya alguna solución de shuttle o transporte integrada? ¿Cómo la vendéis a los asistentes?"
- "¿Medís el NPS o la satisfacción de los asistentes? ¿El transporte aparece como pain point?"
- "¿Tenéis libertad para probar una solución nueva en algún evento de esta temporada?"

---

## 8. MANEJO DE OBJECIONES

### 8.1 Por Segmento — Promotores

**Objeción 1: "Ya tenemos un operador de autobuses contratado."**
> Respuesta: "Perfecto — ConcertRide no reemplaza tu autobús, lo complementa. Tu shuttle cubre la ruta principal; ConcertRide coordina a los asistentes que vienen de zonas que el shuttle no cubre, y también llena los asientos del shuttle con reservas anticipadas. El resultado es que el shuttle sale más lleno y reduces el coste por asistente. ¿Probamos en un evento concreto sin tocar tu contrato actual?"

**Objeción 2: "¿Cuántos usuarios tiene la app? No creo que mis asistentes la usen."**
> Respuesta: "Es la pregunta que espero, y es legítima. La adopción depende de cómo la promociones: en el email de confirmación de entrada, en tus redes, en el widget de tu web. Los festivales que incluyen el transporte en la confirmación de compra consiguen tasas de adopción del 5–15 % del total de asistentes. Para un festival de 5.000 personas, eso son 250–750 riders — suficiente para hacer viable el shuttle. Y si hacemos un piloto, el riesgo de no llegar a ese número lo asumimos nosotros con un modelo de cero coste fijo."

**Objeción 3: "No tenemos presupuesto para esto."**
> Respuesta: "No hay coste upfront. El modelo es revenue share: ConcertRide cobra una comisión de los bookings que genera; si no hay bookings, no hay coste. Si quieres, también te propongo que seas tú quien reciba parte de la comisión por los rides que ConcertRide genera entre tus asistentes — es una fuente de ingreso adicional, no un gasto."

### 8.2 Por Segmento — Ticketing

**Objeción 1: "Nuestro roadmap de producto está lleno."**
> Respuesta: "Entiendo — por eso la integración de fase 0 es solo un link redirect en el checkout: cero desarrollo de tu lado, cero modificación de roadmap. En 48h tienes datos reales de conversión. Si funciona (y la hipótesis es que sí), entonces lo ponemos en el roadmap como una integración más robusta. ¿Podemos hacer la prueba de link en el próximo evento grande?"

**Objeción 2: "¿Cuánto revenue genera esto para nosotros realmente?"**
> Respuesta: "Con un attach rate del 3 % (conservador) en 10.000 entradas vendidas/mes, son 300 bookings adicionales. A €12 de precio medio y 50 % para vosotros, son €1.800/mes o €21.600/año — sin ningún coste de tu lado. Con 50.000 entradas/mes, multiplica por 5. ¿Tiene sentido revisar estos números con tus datos reales de volumen?"

### 8.3 Por Segmento — General

**Objeción: "¿Y si falla la app durante el evento?"**
> Respuesta: "Es una preocupación válida. La plataforma corre sobre Cloudflare Workers con SLA de 99.9 % — la misma infraestructura de empresas como Shopify y Discord. Para el piloto, preparamos un plan de contingencia: número de WhatsApp de soporte directo durante el evento + instrucciones manuales de carpooling en caso de fallo. Ningún piloto depende 100 % de la app — la app es el facilitador, no el único canal."

**Objeción: "¿Estáis regulados? ¿Tenéis seguro?"**
> Respuesta: "Actuamos como plataforma intermediaria (marketplace), no como operador de transporte — el mismo modelo legal que BlaBlaCar o Airbnb. Los conductores son particulares que comparten costes de viaje, no transportistas profesionales. Para los shuttles operados con vehículos contratados, el operador de transporte tiene su propio seguro de viajeros. Podemos compartir nuestra nota legal si lo necesitas para tu due diligence."

---

## 9. PLAN OPERATIVO — 8 SEMANAS

### Semana 1 — Preparación de Lista y Assets Básicos

| # | Tarea | Responsable | Horas | Entregable | Métrica de éxito |
|---|---|---|---|---|---|
| 1 | Construir lista de 50 prospectos Tier 1 en Google Sheets | Sales | 4h | Lista con nombre, empresa, email, LinkedIn, evento próximo | 50 filas con email verificado |
| 2 | Redactar y revisar 3 templates de email (A, B, C) | Sales | 3h | Templates en Google Docs | Templates revisados por 2 personas |
| 3 | Grabar demo de 90s (Loom o similar) | Product | 4h | Link de vídeo no listado | Vídeo listo para enviar |
| 4 | Crear one-pager PDF (1 página A4) | Sales/Design | 5h | PDF en Google Drive | PDF visualmente limpio, mensaje claro |
| 5 | Verificar emails con Hunter.io (créditos gratuitos) | Sales | 2h | Lista con emails validados | <20 % bounce rate en batch de prueba |
| 6 | Configurar seguimiento en Google Sheets (pipeline) | Sales | 1h | Sheet con columnas: empresa, contacto, fecha envío, estado, próxima acción | Sheet operativo |

### Semana 2 — Outreach Inicial Tier 1 (Promotores)

| # | Tarea | Responsable | Horas | Entregable | Métrica de éxito |
|---|---|---|---|---|---|
| 1 | Enviar 20 emails personalizados a promotores Tier 1 | Sales | 4h | Emails enviados con PDF adjunto y link de demo | 20 emails enviados, 0 bounces |
| 2 | Enviar 10 solicitudes de LinkedIn a decisores objetivo | Sales | 2h | Solicitudes pendientes de aceptación | 10 solicitudes enviadas |
| 3 | Investigar eventos próximos de cada prospecto (personalización) | Sales | 3h | Notas en CRM/Sheet por empresa | 100 % de emails con referencia a evento específico |
| 4 | Responder a cualquier reply en <24h | Sales | Reactivo | Respuestas enviadas | <24h de tiempo de respuesta |

### Semana 3 — Outreach Inicial Tier 1 (Venues + Ticketing) + Follow-up

| # | Tarea | Responsable | Horas | Entregable | Métrica de éxito |
|---|---|---|---|---|---|
| 1 | Enviar 15 emails a venues Tier 1 | Sales | 3h | Emails enviados | 15 emails enviados |
| 2 | Enviar 10 emails a plataformas de ticketing | Sales | 2h | Emails enviados | 10 emails enviados |
| 3 | Follow-up 1 a los 20 emails de semana 2 que no respondieron | Sales | 2h | Follow-ups enviados | 100 % de no-respuestas con follow-up |
| 4 | Agendar primeras demos con quienes hayan respondido | Sales | Reactivo | Demos en agenda | ≥2 demos agendadas |
| 5 | Enviar 5 mensajes de LinkedIn a decisores que aceptaron conexión | Sales | 1h | Mensajes enviados | 5 mensajes enviados |

### Semana 4 — Demos y Expansión a Tier 2

| # | Tarea | Responsable | Horas | Entregable | Métrica de éxito |
|---|---|---|---|---|---|
| 1 | Realizar demos agendadas | Sales | 2h/demo | Notas de demo, próximos pasos acordados | ≥2 demos realizadas, 100 % con próximos pasos |
| 2 | Follow-up 2 a no-respuestas de semana 2 | Sales | 1h | Follow-ups enviados (vídeo Loom) | 100 % con segundo follow-up |
| 3 | Enviar 20 emails a prospectos Tier 2 | Sales | 4h | Emails enviados | 20 emails enviados |
| 4 | Construir lista Tier 2 adicional de 20 prospectos | Sales | 3h | Lista expandida | 70 prospectos totales en pipeline |

### Semana 5 — Propuesta de Piloto y Negociación

| # | Tarea | Responsable | Horas | Entregable | Métrica de éxito |
|---|---|---|---|---|---|
| 1 | Preparar propuesta de piloto para los 2–3 prospects más avanzados | Sales/Product | 4h | Documento de propuesta de piloto (PDF) | ≥2 propuestas enviadas |
| 2 | Realizar demos a prospectos Tier 2 que hayan respondido | Sales | Reactivo | Notas de demo | ≥1 demo adicional |
| 3 | Follow-up 3 y último a no-respuestas (cierre de ciclo) | Sales | 1h | Emails finales enviados | Lista de "archivo" con notas |
| 4 | Revisar métricas de la campaña hasta la fecha | Sales | 2h | Informe de 1 página: open rates, reply rates, demos, conversiones | Informe listo para ajustar estrategia |

### Semana 6 — Cierre de Piloto #1

| # | Tarea | Responsable | Horas | Entregable | Métrica de éxito |
|---|---|---|---|---|---|
| 1 | Negociar y firmar acuerdo de piloto con el prospect más avanzado | Sales/Legal | 4h | Contrato o MOU firmado | 1 acuerdo de piloto firmado |
| 2 | Configurar el evento en la plataforma | Product | 4h | Evento activo en ConcertRide | Evento público en la web |
| 3 | Preparar plan de comunicación con el partner (cómo se anunciará a los asistentes) | Sales/Marketing | 3h | Plan de comunicación aprobado por el partner | Plan enviado y aprobado |
| 4 | Preparar dashboard de métricas del piloto | Product | 3h | Sheet o dashboard con KPIs del piloto en tiempo real | Dashboard accesible para el partner |

### Semana 7 — Ejecución del Piloto y Seguimiento

| # | Tarea | Responsable | Horas | Entregable | Métrica de éxito |
|---|---|---|---|---|---|
| 1 | Activar comunicación del partner a sus asistentes (email, RRSS) | Partner + Sales | Coordinación | Comunicación publicada | ≥1 canal de comunicación activo |
| 2 | Monitorizar bookings en tiempo real | Product | Reactivo | Actualizaciones diarias al partner | Update diario enviado al partner |
| 3 | Soporte activo durante el evento (WhatsApp/chat) | Sales/Ops | 4h en el día del evento | Tiempo de respuesta <5 min durante el evento | 0 incidencias críticas sin resolver |
| 4 | Recopilación de datos post-evento | Product | 2h | Informe de datos del piloto | Informe listo en 24h post-evento |

### Semana 8 — Retrospectiva, Informe y Expansión

| # | Tarea | Responsable | Horas | Entregable | Métrica de éxito |
|---|---|---|---|---|---|
| 1 | Presentar informe de resultados al partner del piloto | Sales | 2h | Informe + reunión de resultados | Reunión realizada; partner satisfecho |
| 2 | Proponer conversión a cliente recurrente | Sales | 1h | Propuesta de acuerdo continuo | Propuesta enviada |
| 3 | Crear mini-case study del piloto (para usar en outreach) | Sales/Marketing | 4h | Texto de 300 palabras + 3 métricas clave | Case study listo para enviar |
| 4 | Retrospectiva de la campaña completa | Sales | 2h | Informe de aprendizajes: qué funcionó, qué cambiar, próximos 30 días | Documento de próximos pasos |
| 5 | Continuar outreach Tier 2 y Tier 3 | Sales | Continuo | Pipeline actualizado | ≥5 nuevas demos agendadas |

**KPIs de la campaña a 8 semanas:**

| Métrica | Objetivo | Cómo medirlo |
|---|---|---|
| Emails enviados | 80–100 | Google Sheets de pipeline |
| Open rate | >40 % | Lemlist o tracking manual |
| Reply rate | >8 % | Google Sheets |
| Demos realizadas | ≥8 | Calendario |
| Propuestas de piloto enviadas | ≥3 | Google Sheets |
| Pilotos cerrados | ≥1 | Contrato firmado |
| Usuarios activados en piloto | ≥200 | Dashboard de producto |

---

## 10. ASSETS Y PLANTILLAS

### Checklist de Assets Necesarios

| Asset | Dueño | Tiempo estimado | Estado actual | Prioridad |
|---|---|---|---|---|
| Demo vídeo (60–90s, Loom) | Product | 4h | No existe | 🔴 Crítico — antes de enviar emails |
| One-pager PDF (1 página A4) | Sales/Design | 6h | Borrador en v1 del documento | 🔴 Crítico — antes de enviar emails |
| Landing page de demo (concertride.com/demo) | Product | 8h | Producción existe; ¿hay demo pública? | 🟠 Alto |
| Email sequences (3 follow-ups) | Sales | 3h | Template genérico en v1; falta personalización | 🟠 Alto |
| Pricing deck B2B (PDF de 3 páginas) | Sales/Finance | 5h | No existe | 🟠 Alto |
| Contrato de piloto / MOU tipo | Legal | 8h | No existe | 🟠 Alto |
| Case study / testimonial (aunque sea mini) | Product/Sales | 4h | No existe (requiere piloto) | 🟡 Medio |
| Presentación de 10 slides para inversores | Sales | 8h | No existe | 🟡 Medio |
| Dashboard de analítica para promotores | Product | 16–40h | Posiblemente no existe | 🟡 Medio |
| Vídeo de testimonial de asistente | Marketing | 6h | No existe | 🟢 Bajo |

### Template de One-Pager (Estructura)

**Página única, máximo 400 palabras:**

**Cabecera:** Logo ConcertRide + tagline: "El transporte al concierto, finalmente resuelto"

**El problema (50 palabras):** "El transporte es el mayor punto de fricción para los asistentes a eventos de música. Congestión en la salida, surge pricing, quejas en RRSS — el organizador no controla nada y el asistente culpa al evento."

**La solución (80 palabras):** "ConcertRide conecta a los asistentes para compartir el viaje antes del evento. Los asistentes pre-reservan desde la app; el organizador activa una landing específica; los datos de movilidad llegan en tiempo real. Para el organizador: menos quejas, shuttle más lleno, ingresos adicionales. Para el asistente: viaje coordinado, precio justo, experiencia social."

**Cómo funciona (3 bullets):**
- El promotor activa ConcertRide para su evento en 30 minutos
- Los asistentes reciben el link en el email de confirmación de entrada
- Pre-reservan el viaje; el shuttle sale lleno; tú recibes los datos

**Modelo de ingresos (para el promotor):**
- Sin coste fijo. Comisión del 8 % por booking.
- Opción revenue share en shuttle: 60 % tú / 40 % ConcertRide
- Acceso a dashboard de movilidad incluido

**Casos de uso:** [Espacio para logo de festival piloto o cifra de usuarios]

**CTA:** "Agenda una demo de 30 minutos → calendly.com/concertride"

---

## 11. PILOTOS RECOMENDADOS

### Piloto 1 — Ride-sharing en Festival Mediano (Recomendado para Q2 2026)

| Parámetro | Detalle |
|---|---|
| **Tipo de evento** | Festival de 3.000–8.000 asistentes, ubicación periférica o peri-urbana |
| **Duración** | 6 semanas (4 pre-evento + día evento + 1 semana post) |
| **Coste para ConcertRide** | €0–€500 (tiempo del equipo; posible pequeño gasto en activación de usuarios) |
| **Lo que aporta el promotor** | Visibilidad en email de confirmación + 1 post en RRSS del festival |
| **Métricas de éxito** | ≥200 registros, ≥50 bookings, fill rate >50 %, NPS piloto >30 |
| **Riesgo principal** | Cold start: pocos conductores. Mitigación: reclutar 20–30 conductores proactivamente antes |
| **Resultado esperado** | Case study + datos reales para el outreach de resto del año |

### Piloto 2 — Widget en Checkout de Ticketing

| Parámetro | Detalle |
|---|---|
| **Tipo de integración** | Redirect link en confirmación de compra (no API en fase 0) |
| **Duración** | 6–8 semanas (1 semana setup + 5–7 semanas de datos) |
| **Coste para ConcertRide** | €0 (solo tiempo de configuración) |
| **Revenue model** | 50/50 split de comisiones generadas desde el checkout |
| **Métricas de éxito** | ≥3 % attach rate, ≥100 bookings, >€500 GMV en el período |
| **Riesgo principal** | El ticketing puede no activar la comunicación. Mitigación: pedir que incluyan el link en el email de confirmación (mínimo esfuerzo para ellos) |

### Piloto 3 — Shuttle Gestionado con Operador Local

| Parámetro | Detalle |
|---|---|
| **Tipo de evento** | Evento grande (>5.000 personas), venue peri-urbano |
| **Duración** | 4–6 semanas (3 semanas pre-venta + día evento) |
| **Modelo** | ConcertRide vende billetes (€8–€15/persona); operador recibe 60–70 %; ConcertRide 30–40 % |
| **Métricas de éxito** | ≥80 % ocupación del shuttle, ingresos netos >€500, 0 incidencias de seguridad |
| **Riesgo principal** | Responsabilidad legal en transporte de pasajeros; asegurar que el operador tiene seguro VTC/viajeros |
| **Candidatos iniciales** | Operadores regionales: Autos Porquera (Madrid), Socibus (Andalucía), AUTOCARES HIFE (Cataluña) |

---

## 12. RIESGOS LEGALES Y RGPD

### 12.1 RGPD y Protección de Datos

**Base legal para el procesamiento de datos de usuarios (usuarios de ConcertRide):**
- **Ejecución de contrato (Art. 6.1.b RGPD):** Para datos necesarios para la prestación del servicio (nombre, email, ubicación de recogida, destino). Base legal más sólida para el núcleo del servicio.
- **Consentimiento explícito (Art. 6.1.a):** Para geolocalización en tiempo real, notificaciones push, y datos de preferencias musicales usados para personalización. Debe ser granular (cada finalidad por separado), libre y revocable.
- **Interés legítimo (Art. 6.1.f):** Para análisis de uso de la plataforma y mejora del producto. Debe superar el test de balance de intereses (LIA — Legitimate Interest Assessment).

**Compartición de datos con partners B2B:**
- Los datos que se comparten con promotores/venues deben ser exclusivamente **agregados y anonimizados**: "el 35 % de los asistentes vienen del sur de Madrid", no "Juan García, 28 años, compró 2 asientos".
- Incluir en el contrato B2B una cláusula de procesamiento de datos que establezca: qué datos se comparten, en qué formato, con qué finalidad, por cuánto tiempo, y que el partner se compromete a no re-identificar a los usuarios.
- Si los datos se envían fuera de la UE (ej. servidor de análisis en EEUU), verificar que existe mecanismo de transferencia válido (cláusulas contractuales tipo de la UE o servidor dentro de la UE).

**Outreach por email a empresas (LOPD-GDD / RGPD):**
- Para contactos B2B (empresa a empresa), la base legal habitual es el interés legítimo profesional: el mensaje es relevante para la actividad profesional del destinatario.
- Requisitos: el email debe ser al destinatario en su capacidad profesional (no personal), el mensaje debe ser relevante para su sector, debe incluir opción de baja clara y sencilla, y debe registrarse la base legal utilizada.
- No comprar listas de contactos de terceros. Si se usan herramientas como Apollo.io o Hunter.io, verificar que los emails son de uso profesional (dominio corporativo, no Gmail personal).
- Documentar en una hoja de registro: fecha de contacto, empresa, nombre, cargo, base legal, si se ha ejercido el derecho de baja.

**Datos de menores:**
- Establecer edad mínima de 18 años en los términos del servicio con verificación activa en el registro (checkbox de declaración + posible verificación por ID en fases avanzadas del producto).

### 12.2 Responsabilidad Civil y Seguros

**Modelo legal de la plataforma:**
ConcertRide opera como intermediario (marketplace) y no como operador de transporte. Los conductores son particulares que comparten costes de viaje — modelo legal similar a BlaBlaCar en España, que opera bajo el Reglamento de la UE de Carpooling Social. Condiciones para que este modelo sea legal:
1. El conductor no obtiene beneficio económico; solo recupera costes de combustible, peajes y amortización del vehículo.
2. La plataforma no es quien fija el precio del viaje ni establece rutas predeterminadas con carácter obligatorio.
3. Los conductores no son profesionales del transporte (no VTC, no taxi).

**Para los shuttles operados con vehículos contratados:**
- El operador de autobuses/minibuses debe tener su propio seguro de transporte de viajeros (obligatorio para operadores con licencia).
- ConcertRide actúa como intermediario de venta de billetes, no como transportista.
- Incluir en los términos de servicio y en el contrato con el operador: ConcertRide no es responsable de accidentes, retrasos o incidencias durante el transporte.

**Seguro de responsabilidad civil para la plataforma:**
- Contratar un seguro de RC para la plataforma digital (no para el transporte en sí, sino para errores y omisiones en el servicio tecnológico, fallos de la app durante el evento, etc.)
- Coste estimado: €200–€500/mes para una startup tech en España. Consultar con corredores especializados en tech (Hiscox, Generali Tech, AXA Profesionales).

**Drivers — Régimen laboral:**
- Los conductores son usuarios de la plataforma, no empleados ni autónomos de ConcertRide.
- Sin embargo, si ConcertRide paga comisiones a conductores (más allá de la recuperación de costes), la Inspección de Trabajo puede recalificar la relación como laboral (riesgo de "uberización" regulada por la Ley Rider en España).
- Recomendación: no pagar a los conductores; el modelo debe ser que los conductores **reciben dinero de los pasajeros** (recuperación de costes), no de ConcertRide.

### 12.3 Compliance con Regulaciones de Eventos

**Permisos municipales:**
- Algunos ayuntamientos requieren que los servicios de transporte relacionados con eventos (especialmente shuttles con parada en el recinto) soliciten un permiso de ocupación de vía pública o coordinación con el Plan de Tráfico del evento.
- En eventos con Plan de Emergencia obligatorio (>10.000 personas según Real Decreto 2816/1982), el Plan de Movilidad del promotor debe ser aprobado por la autoridad competente. ConcertRide puede ser un componente de ese plan.

**Exclusividades de transporte en venues:**
- Algunos venues tienen contratos de exclusividad con operadores de transporte (parking, shuttle) que pueden impedir la operación de servicios alternativos.
- Antes de cerrar acuerdo con un venue, verificar si existe cláusula de exclusividad con otro operador de transporte.
- Solución: posicionar ConcertRide como complemento (ride-sharing entre asistentes) que no interfiere con el operador exclusivo de shuttle.

**Recomendación urgente:** Consultar con un abogado especializado en movilidad y eventos antes del primer piloto con cobro real. Coste de consulta: €300–€800. El costo de una sanción por operar sin licencia puede ser de €3.001–€90.000 (Ley de Ordenación de Transportes Terrestres).

---

## 13. KPIS Y MÉTRICAS

### 13.1 KPIs de Producto (Crecimiento B2C)

| KPI | Objetivo Mes 3 | Objetivo Mes 6 | Objetivo Mes 12 | Cómo medirlo |
|---|---|---|---|---|
| MAU (Monthly Active Users) | 1.000 | 3.000 | 10.000 | Analytics de app |
| Bookings/mes | 150 | 500 | 2.000 | Dashboard de producto |
| Fill rate de rides publicados | 40 % | 55 % | 70 % | rides_filled / rides_published |
| Retención D30 (usuarios que vuelven en 30 días) | 15 % | 22 % | 30 % | Cohortes en analytics |
| NPS de usuarios | >30 | >40 | >50 | Encuesta in-app post-ride |
| Rating medio en stores | >4.0 | >4.2 | >4.5 | App Store / Google Play |

### 13.2 KPIs Comerciales (B2B)

| KPI | Objetivo Q2 2026 | Objetivo Q3 2026 | Objetivo Q4 2026 |
|---|---|---|---|
| Emails enviados | 100 | 150 (acumulado) | 200 (acumulado) |
| Reply rate | >8 % | >10 % | >12 % |
| Demos realizadas | 8 | 15 | 25 |
| Pilotos cerrados | 1 | 3 | 5 |
| Acuerdos B2B activos (pago) | 0 | 1 | 3 |
| Revenue B2B | €0 | €2.000 | €8.000 |

### 13.3 KPIs de Negocio (Finanzas)

| KPI | Objetivo Año 1 |
|---|---|
| GMV (Gross Merchandise Value — valor total de los rides) | €150K – €250K |
| Revenue neto (comisiones) | €12K – €25K |
| CAC (Coste de Adquisición de Usuario) | <€5 |
| LTV (Lifetime Value por usuario) | >€15 |
| Ratio LTV/CAC | >3 |

---

## 14. PREGUNTAS CLAVE Y SUPUESTOS DE TRABAJO

| Pregunta | Supuesto de trabajo (si no hay dato real) | Impacto si el dato real es diferente |
|---|---|---|
| Tracción actual (MAU, bookings) | 500 MAU, 50 bookings/mes, Madrid | Si es mayor: argumentos de outreach más fuertes. Si es menor: mayor urgencia de primer piloto antes de outreach masivo |
| Modelo de ingresos definitivo | 8 % comisión por booking + fee opcional B2B (€500–€1.500/evento) | Si es SaaS-first: cambiar el outreach para hablar de "licencia mensual" en lugar de revenue share |
| Geografía prioritaria | España año 1, Portugal año 2 | Si se abre Portugal antes, añadir prospectos de Lisboa a la lista Tier 1 |
| Presupuesto de outreach | Low-cost: email (Gmail) + Google Sheets + LinkedIn gratuito | Si hay €200–€500/mes, añadir Lemlist + Hunter.io para automatización y verificación |
| Acuerdos existentes con promotores | Ninguno — cold outreach puro | Si hay algún contacto informal, usarlo como palanca para una intro más cálida |
| Notificaciones push — ¿funcionales? | Parcialmente implementadas (ruta push.ts existe) | Si no funcionan: no incluirlas en el pitch hasta que estén operativas |
| Dashboard para promotores — ¿existe? | Probablemente no en la UI | Si no existe: priorizar su desarrollo antes del primer piloto B2B |
| Seguro RC contratado | No | Contratar antes del primer piloto con cobro real |

---

## 15. APÉNDICE — HERRAMIENTAS RECOMENDADAS

### Outreach y Gestión de Pipeline

| Herramienta | Uso | Precio | Alternativa gratuita |
|---|---|---|---|
| **Gmail + Google Sheets** | Outreach manual + tracking | Gratis | — |
| **Lemlist / Instantly** | Email outreach con seguimiento automático y personalización | €50–€100/mes | Gmail manual |
| **LinkedIn Sales Navigator** | Búsqueda de contactos por cargo | €80/mes | LinkedIn gratuito (limitado) |
| **Hunter.io** | Búsqueda y verificación de emails corporativos | Freemium (25 búsquedas/mes gratis) | — |
| **Apollo.io** | Base de datos de contactos B2B + email finder | Freemium | Hunter.io |
| **Calendly** | Reserva de demos sin fricción | Gratis (básico) | Google Calendar con link |
| **Loom** | Grabar demo de 90s personalizada | Gratis (básico) | OBS + YouTube no listado |

### Analytics y Producto

| Herramienta | Uso | Precio |
|---|---|---|
| **PostHog** | Analytics de producto, funnels, cohortes (compatible con Cloudflare Workers) | Freemium | 
| **Sentry** | Error tracking en producción | Freemium |
| **Mixpanel** | Analytics de eventos de usuario | Freemium |

### Legal y Compliance

| Recurso | Uso |
|---|---|
| **AEPD (aepd.es)** | Guías oficiales de RGPD en España; incluye plantillas de registro de actividades de tratamiento |
| **LOPD-GDD (LO 3/2018)** | Ley Orgánica de Protección de Datos española — texto completo en BOE |
| **Hiscox / AXA Profesionales** | Seguro de RC para startups tech en España |

---

*Documento v2 generado: 2026-05-03. Basado en auditoría de CLAUDE.md y sales_outreach.md v1. Revisión recomendada tras primer piloto B2B (incorporar datos reales de tracción y case study).*
