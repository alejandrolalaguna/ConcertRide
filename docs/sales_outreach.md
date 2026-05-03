# ConcertRide — Análisis de Mercado, Outreach & Plan Comercial

> **Fecha:** 2026-05-03  
> **Elaborado por:** Análisis estratégico con IA (supuestos explícitos; no usar cifras como hechos sin validar)  
> **Aviso:** Todas las cifras numéricas son **estimaciones con rangos**. Se indica el método de estimación, el nivel de confianza y cómo verificarlas. No se proporcionan datos personales reales.

---

## RESUMEN EJECUTIVO

**ConcertRide** es una plataforma vertical de movilidad para eventos de música en vivo (conciertos, festivales) que conecta asistentes con conductores y rutas compartidas, ofrece reserva de plazas y coordinación de viaje, y habilita monetización B2B para promotores, venues y patrocinadores.

**Oportunidad clave:** El mercado de eventos en vivo en Europa lleva recuperándose desde 2023 y el transporte al evento es el mayor punto de fricción no resuelto por los grandes operadores. ConcertRide ocupa un nicho de alta retención (los fans van a más de un evento) con múltiples vectores de ingresos.

**Estado asumido del producto (supuesto de trabajo):** MVP operativo — catálogo de conciertos, publicación de rides, booking, rutas SEO y sistema de autenticación. Tracción inicial desconocida → ver sección de preguntas al final.

---

## ÍNDICE

1. [Análisis de Mercado (TAM / SAM / SOM)](#1-análisis-de-mercado)
2. [Competencia y Posicionamiento](#2-competencia-y-posicionamiento)
3. [Segmentos Objetivo y Propuesta de Valor](#3-segmentos-objetivo)
4. [Materiales de Outreach Listos para Usar](#4-materiales-de-outreach)
5. [CSV Ejemplo de Prospectos](#5-csv-ejemplo)
6. [KPIs y Métricas Clave](#6-kpis-y-métricas)
7. [Plan de Acción Operativo — 30 Días](#7-plan-operativo-30-días)
8. [Pilotos Recomendados](#8-pilotos-recomendados)
9. [Transparencia, Riesgos Legales y RGPD](#9-transparencia-y-rgpd)
10. [Preguntas para Afinar el Análisis](#10-preguntas-clave)

---

## 1. ANÁLISIS DE MERCADO

### 1.1 Metodología general

> Método bottom-up: partimos de datos observables (asistencia a eventos, gasto en transporte) y escalamos con tasas de penetración conservadoras. Las cifras top-down (informes de mercado) se usan como sanity check.

### 1.2 TAM — Mercado Total Addressable

**Definición:** Ingresos totales potenciales si ConcertRide capturara el 100 % del gasto en transporte relacionado con eventos de música en vivo en Europa.

**Fórmula:**
```
TAM = Asistentes a eventos de música en vivo en Europa/año
      × % que usa transporte no propio o comparte viaje
      × Gasto medio en transporte por asistente/evento
```

**Pasos y supuestos:**

| Variable | Valor estimado | Fuente / Método | Incertidumbre |
|---|---|---|---|
| Asistentes a eventos de música en vivo en Europa/año | 350–500 millones | Statista / IFPI Live Music Report 2023–24 reportan ~300M pre-COVID; recuperación estimada en 2025–26 | Media |
| % que usa transporte no propio o compartido | 40–60 % | Estimación basada en estudios de movilidad urbana en eventos (Arup, EACEA); varía mucho por ciudad | Alta |
| Gasto medio en transporte por asistente/evento (ida+vuelta) | €12–25 | INE encuesta de gasto en ocio; Uber/Bolt pricing en ciudades europeas para distancias típicas (10–30 km) | Media |

**Cálculo:**
```
TAM bajo:  350M × 0.40 × €12 = €1.68B/año
TAM alto:  500M × 0.60 × €25 = €7.50B/año
→ Rango TAM: €1.7B – €7.5B/año (estimación punto medio: ~€4B)
```

**Nivel de confianza:** Bajo-Medio (40–50%). El mercado europeo de eventos es heterogéneo; los datos de gasto en transporte por evento son escasos y dispersos.

**Cómo verificar:**
- Fuente 1: [IFPI Global Music Report](https://www.ifpi.org/resources/) — datos de asistencia y gasto
- Fuente 2: Eurostat "Participation in cultural activities" + BVA BDRC Event Transport Surveys (UK)
- Método: comprar o solicitar el informe "Live Entertainment Europe 2024" de PwC/Statista

**Siguiente acción recomendada:** Buscar en Statista el report "Live music market Europe" y anotar el número de asistentes por país objetivo.

---

### 1.3 SAM — Mercado Accesible

**Definición:** Segmento del TAM que ConcertRide puede realmente perseguir con su producto actual (España + potencialmente Portugal, Francia e Italia en fases posteriores; eventos medianos y grandes >1.000 asistentes).

**Fórmula:**
```
SAM = TAM × (% mercado España + mercados objetivo año 1–2)
      × (% eventos de tamaño accesible para plataforma)
      × (% usuarios dispuestos a usar app para transporte)
```

**Pasos:**

| Variable | Valor | Supuesto |
|---|---|---|
| España como % de Europa en eventos | 8–12 % | PIB + población; España es 4.º mercado europeo de festivales (datos FIM/APM) |
| Asistentes a eventos >1.000 personas en España/año | 18–28 millones | No verificado — supuesto: 60–70 % de los asistentes a eventos van a conciertos >1.000 personas |
| % dispuestos a usar app para compartir transporte | 15–30 % | Encuestas de comportamiento movilidad en eventos (hipótesis propia; validar con encuesta) |
| Gasto medio transporte | €15–22 | Medio entre rango TAM, ajustado a España |

```
SAM bajo:  18M × 0.15 × €15 = €40.5M/año
SAM alto:  28M × 0.30 × €22 = €184.8M/año
→ Rango SAM (España sola): €40M – €185M/año
→ Con expansión a PT/FR/IT en año 2–3: multiplicar por 2.5–3x → €100M – €550M
```

**Nivel de confianza:** Bajo (35%). El % de disposición a usar app es el supuesto más frágil.

**Cómo verificar:** Encuesta de 50–100 asistentes en los próximos 2–3 eventos (Google Forms en RRSS de fans).

**Siguiente acción recomendada:** Lanzar encuesta de 5 preguntas en comunidades de fans (Instagram/TikTok) para validar el % de disposición a pagar/usar.

---

### 1.4 SOM — Mercado Obtenible

**Definición:** Porción realista del SAM que ConcertRide puede capturar en los próximos 3 años dado el equipo, recursos y hoja de ruta actuales.

**Fórmula:**
```
SOM = SAM × tasa de penetración realista (año 1–3)
```

**Escenarios:**

| Escenario | Penetración SAM | SOM Año 3 | Condición |
|---|---|---|---|
| Conservador | 0.3–0.5 % | €0.5M – €1.5M ARR | Solo España, 5–10 ciudades, sin grandes acuerdos B2B |
| Base | 1–2 % | €2M – €5M ARR | España + 1–2 mercados, 3–5 acuerdos B2B con promotores |
| Optimista | 3–5 % | €6M – €15M ARR | Expansión EU, integración ticketing, patrocinadores activos |

**Modelo de ingresos asumido (multicanal):**
- Comisión por booking B2C: 8–15 % del precio del ride
- Licencia/SaaS B2B para promotores: €500–€3.000/mes por evento o acuerdo anual
- Comisión por shuttle integrado: 5–10 % del ticket
- Patrocinio/visibilidad de marca: €5.000–€50.000 por campaña/evento

**Nivel de confianza:** Bajo (30%). Depende críticamente del modelo de ingresos elegido y de cuántas conversiones B2B se logren en año 1.

**Siguiente acción recomendada:** Definir el modelo de ingresos principal (comisión, SaaS, o híbrido) antes de ejecutar el outreach para tener una propuesta de precios clara.

---

## 2. COMPETENCIA Y POSICIONAMIENTO

### 2.1 Competidores directos

| Competidor | Modelo | Fortaleza | Debilidad | Cómo diferenciarse |
|---|---|---|---|---|
| **Uber/Bolt Events** | Ride-hailing genérico con picos en eventos | Escala masiva, marca reconocida | Sin coordinación grupal, precios surge, sin integración promotor | Coordinación previa, precio fijo, identidad de fans |
| **BlaBlaCar** | Carpool larga distancia | Comunidad establecida, precio competitivo | No optimizado para eventos ni tiempos cortos | Especificidad de evento, checklist, booking de asiento |
| **Grupos WhatsApp / Facebook** | Organización informal | Gratis, confianza social | Sin garantías, pagos informales, no escalable | Seguridad, pagos integrados, matching automático |
| **Shuttles de promotores** | Servicio propio de buses/transfers | Integrado, confiable | Coste alto, cobertura limitada, sin flexibilidad horaria | Coste menor, red de conductores particulares, más horarios |
| **Moovit/Citymapper Events** | Transporte público + planificación | Gratuito, datos en tiempo real | Sin ride-sharing privado, sin conexión social fans | Ride-sharing privado, comunidad, gamificación |

### 2.2 Competidores indirectos

- Grupos de Telegram de fans (sin monetización, escala nula)
- Apps de events generales (Fever, Xceed) — sin transporte
- Apps de carpooling corporativo (Karos, Klaxit) — B2B, sin foco en ocio
- Taxistas y VTC locales que organizan rutas informales en eventos grandes

### 2.3 Ventajas competitivas de ConcertRide

1. **Verticalización total:** features específicas para el contexto evento (checklist pre-viaje, matching por artista/sala, reserva con antelación)
2. **Doble propuesta de valor B2B/B2C:** genera ingresos tanto del usuario final como del promotor/venue
3. **Datos de comportamiento** de movilidad en eventos — activo valioso para patrocinadores y ayuntamientos
4. **First-mover advantage** en España en este nicho específico (no verificado — validar con búsqueda de competidores locales)
5. **SEO estructural:** landing pages por festival, ruta y ciudad ya implementadas — barrera de entrada para nuevos competidores

### 2.4 Riesgos de mercado

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Uber lanza feature "Events" agresiva | Media | Alto | Diferenciarse en UX, comunidad y B2B (Uber no monetiza promotores) |
| BlaBlaCar pivota a eventos | Baja | Alto | Velocidad de ejecución y lock-in de promotores con contratos |
| Regulación transporte privado (VTC) más restrictiva | Media | Medio | Modelo de carpooling social (no VTC comercial) + asesoría legal |
| Adopción lenta (cold start de red) | Alta | Alto | Acuerdos B2B para garantizar demanda desde el primer evento |
| Privacidad / RGPD con datos de geolocalización | Media | Alto | Ver sección 9 |

**Siguiente acción recomendada:** Realizar búsqueda en Google Play/App Store + Product Hunt con keywords "event ride sharing Europe" para mapear competidores que no aparecen en búsquedas web.

---

## 3. SEGMENTOS OBJETIVO

### 3.1 Mapa de segmentos (priorizado)

```
PRIORIDAD 1 (impacto alto, accesibilidad media-alta)
├── Promotores de conciertos y festivales
└── Venues medianos (aforo 1.000–15.000)

PRIORIDAD 2 (impacto alto, accesibilidad media)
├── Plataformas de ticketing
└── Operadores de shuttle/transfer eventos

PRIORIDAD 3 (impacto medio, accesibilidad alta)
├── Patrocinadores / marcas de evento
└── Ayuntamientos / oficinas de movilidad urbana

PRIORIDAD 4 (B2C — activar en paralelo con B2B)
├── Asistentes habituales a conciertos (18–35 años)
└── Comunidades de fans de artistas

PRIORIDAD 5 (oportunista)
├── Compradores estratégicos / inversores
└── Universidades / asociaciones estudiantiles
```

---

### 3.2 Segmento A — Promotores de Conciertos y Festivales

**Rol objetivo:** Head of Operations / Director de Producción / Partnerships Manager

**¿Quiénes son en España?**
- Live Nation España, Primavera Sound, Sónar, Mad Cool, Rototom, Arenal Sound, Doctor Music, etc.
- Promotores regionales: Warm Up (Murcia), OchoymedioCLUB (Madrid), Sala Razzmatazz (Barcelona), etc.

**3 argumentos de valor personalizados:**

1. **Reducción de congestión y quejas:** "El 62 % de las quejas post-evento en encuestas de asistentes se relacionan con el acceso y la salida. ConcertRide puede reducir el volumen de vehículos en un 15–30 % en los puntos de acceso al recinto." *(No verificado — supuesto: elaborado a partir de estudios de movilidad en eventos del Reino Unido, AECOM/Arup; validar con datos propios del promotor)*

2. **Nueva línea de ingresos sin inversión:** "Integra ConcertRide como servicio oficial de tu evento. Tú ofreces el canal a tus asistentes; nosotros gestionamos el ride-sharing y compartimos el revenue (modelo CPA o revenue-share negociable)."

3. **Datos de movilidad como activo:** "Generamos un informe post-evento con los patrones de llegada/salida, zonas de origen y picos de demanda — información que normalmente cuesta €5.000–€20.000 a consultoras de movilidad y que incluimos en el acuerdo."

**Métricas que más les importan:**
- NPS y satisfacción de asistentes
- Incidencias operativas (congestión, esperas)
- Coste de producción por asistente
- Venta de entradas y retención de público edición a edición

**Siguiente acción recomendada:** Identificar los 10 promotores españoles con más eventos anuales y buscar su contacto de operaciones en LinkedIn antes de enviar el email.

---

### 3.3 Segmento B — Venues Medianos

**Rol objetivo:** Director/a de Operaciones, Responsable de Eventos

**¿Quiénes son?**
- Salas de conciertos con aforo 1.000–15.000: WiZink Center, Palau Sant Jordi, Bilbao Arena, Auditorio Municipal de ciudades medianas
- Recintos de festival: campos, hipódromos, polígonos reconvertidos

**3 argumentos de valor personalizados:**

1. **Parking saturado = problema diario:** "Sabemos que el parking de tu recinto tiene capacidad para el X % de los asistentes. ConcertRide puede desviar el 20–40 % del tráfico a rides compartidos, reduciendo la presión logística sin obras ni inversión."

2. **Diferenciación de la oferta:** "Ofrece en tu web de venta de entradas la opción de reservar el viaje al mismo tiempo que la entrada — aumenta la conversión y el tiempo de permanencia en tu ecosistema digital."

3. **Cumplimiento de planes de movilidad sostenible:** "Muchos ayuntamientos exigen planes de movilidad para renovar licencias de eventos. ConcertRide genera automáticamente los informes de reducción de vehículos necesarios para estos trámites."

**Métricas que más les importan:**
- Incidentes de tráfico y quejas de vecinos
- Coste de seguridad y control de acceso
- Renovación de licencias de actividad

**Siguiente acción recomendada:** Buscar en el BOE/BOP requisitos de plan de movilidad para eventos en las ciudades objetivo — es un pain point regulatorio real.

---

### 3.4 Segmento C — Plataformas de Ticketing

**Rol objetivo:** Head of Product, Director de Partnerships / Integraciones

**¿Quiénes son?**
- Ticketmaster España, Eventbrite, Wegow, Fever, EntradaPlus, El Corte Inglés Entradas, Taquilla.com

**3 argumentos de valor personalizados:**

1. **Upsell en el checkout:** "Integra ConcertRide en el paso final del checkout de tu plataforma. El asistente que acaba de comprar una entrada de €50–€120 tiene alta intención de compra — añadir 'Reserva tu viaje por €8' aumenta el ticket medio sin fricción."

2. **Reducción de churn y no-shows:** "Los asistentes que tienen el transporte resuelto tienen un 25–40 % menos de probabilidad de no presentarse al evento (hipótesis no verificada — proponer a la plataforma un A/B test de 2 meses para validar)."

3. **Sin desarrollo propio:** "Integración vía widget o API REST en menos de 2 semanas. Nuestro equipo técnico lo implementa y mantenemos; tú solo activas el canal."

**Métricas que más les importan:**
- GMV (Gross Merchandise Value) total de la plataforma
- Ticket medio por transacción
- Tasa de conversión del checkout
- Retención de compradores

**Siguiente acción recomendada:** Preparar una demo del widget de checkout con mockup visual antes de contactar a plataformas de ticketing — hablan en lenguaje de producto.

---

### 3.5 Segmento D — Operadores de Shuttle / Transfer

**Rol objetivo:** Director Comercial, Responsable de Operaciones

**¿Quiénes son?**
- Empresas de autobuses de alquiler, VTC grupales, agencias de transfer para eventos
- Ejemplos de perfil: empresas medianas de 10–50 vehículos que ya trabajan eventos de forma informal

**3 argumentos de valor personalizados:**

1. **Demanda garantizada y planificada:** "ConcertRide te asigna rutas con ocupación confirmada antes del evento — dejas de operar a ciegas y puedes planificar la flota con 48–72h de antelación."

2. **Digitalización sin inversión propia:** "Accedes a un backoffice de gestión de rutas, asientos y pagos sin necesidad de desarrollar tu propia app. Nosotros ponemos la tecnología; tú pones los vehículos."

3. **Expansión de cartera sin equipo de ventas:** "ConcertRide te lleva los clientes; tú ejecutas. Modelo de afiliación sin cuota de entrada: cobramos comisión solo cuando confirmas ocupación."

**Métricas que más les importan:**
- Tasa de ocupación de vehículos
- Coste por kilómetro / coste por pasajero
- Margen operativo

**Siguiente acción recomendada:** Contactar primero a 2–3 operadores pequeños (menos poder de negociación) para construir casos de éxito antes de acercarse a los grandes.

---

### 3.6 Segmento E — Patrocinadores / Marcas

**Rol objetivo:** Brand Manager, Head of Sponsorship / Activaciones

**¿Quiénes son?**
- Cerveceras (Estrella Damm, Mahou, Heineken España)
- Bebidas energéticas (Red Bull, Monster, Burn)
- Marcas de movilidad (SEAT, Renault, Cabify, Repsol)
- Plataformas de streaming (Spotify, Apple Music) — co-branding eventos

**3 argumentos de valor personalizados:**

1. **Audiencia captiva y cualificada:** "El usuario de ConcertRide está en tránsito hacia un evento de música — contexto de alta receptividad a marcas de lifestyle, bebidas y experiencias. CPM efectivo estimado: €8–€20 vs €15–€40 en social media (hipótesis — ajustar con datos de campañas propias)."

2. **Activación experiencial integrada:** "Patrocina las 'Rutas Oficiales' de tu festival o artista. El usuario ve tu marca en el momento de reservar su viaje — sin bloqueo, sin skip. Incluye CTA directo a landing de marca."

3. **Datos first-party y post-event reporting:** "Informe detallado de impresiones, clics y comportamiento de activación por evento — datos de primera mano que no ofrece ninguna red de publicidad de eventos."

**Métricas que más les importan:**
- CPM / CPE (coste por engagement)
- Brand recall y asociación en encuestas post-evento
- Volumen de impresiones garantizadas

**Siguiente acción recomendada:** Esperar a tener al menos 1 evento piloto con datos reales antes de acercarse a patrocinadores — necesitan métricas de audiencia verificadas.

---

### 3.7 Segmento F — Usuarios B2C

**Perfil principal:** 22–38 años, asistente a 3–8 conciertos/año, usuario de Spotify/Instagram, urbano, sensible al precio pero dispuesto a pagar por comodidad.

**3 argumentos de valor:**
1. Ahorra un 30–60 % vs Uber/Bolt en horas pico post-evento (precio acordado de antemano)
2. Viaja con gente que va al mismo concierto — experiencia social, no solo transporte
3. Deja el coche en casa: bebe, disfruta, llega seguro

**Canales de captación B2C:**
- TikTok/Instagram ads segmentados por artista/evento
- Colaboraciones con cuentas de fans (microinfluencers 10k–100k seguidores)
- SEO: las landing pages de festival y ruta ya existen en el producto
- Co-marketing con promotores (mailing a compradores de entradas)

**Siguiente acción recomendada:** Activar campañas de contenido orgánico en TikTok/Instagram ligadas a 2–3 festivales de verano próximos para generar primeros registros B2C sin coste.

---

## 4. MATERIALES DE OUTREACH

### 4.1 One-Pager (texto listo para maquetar)

---

**CONCERTRIDE**
*La movilidad oficial de tu evento*

---

**El problema**
Cada concierto genera el mismo caos: parking colapsado, Ubers con precio disparado, asistentes que llegan tarde o no vuelven. El promotor pierde reputación. El asistente, experiencia. Nadie gana.

**La solución**
ConcertRide es la plataforma de rides compartidos diseñada específicamente para eventos de música. Los asistentes reservan su viaje al mismo tiempo que compran la entrada. Los conductores publican rutas antes del evento. Todo coordinado, todo confirmado.

**Para promotores y venues**
- Reduce vehículos en el acceso: menos congestión, menos incidencias
- Nueva fuente de ingresos vía revenue-share (sin inversión inicial)
- Informes de movilidad post-evento incluidos
- Integración en 2 semanas vía widget o API

**Para asistentes**
- Precio fijo acordado antes del evento (sin surge pricing)
- Viaja con fans del mismo concierto
- Perfiles verificados, pagos seguros, checklist de viaje

**Tracción**  
[COMPLETAR: usuarios registrados / bookings / ciudades / eventos piloto]

**Modelo comercial**
- B2C: comisión del 10–15 % por booking
- B2B: revenue-share o fee fijo por evento / suscripción mensual
- Patrocinadores: CPM sobre impresiones en flujo de reserva

**Próximo paso**
Demo de 20 minutos → piloto en 1 evento → acuerdo marco

📧 [email] | 🌐 concertride.es | 📱 [teléfono]

---

### 4.2 Pitch de 90 segundos (guión)

```
[0–10s] Hook
"Cada vez que termina un concierto grande, hay 15.000 personas intentando coger 
un Uber al mismo tiempo. El precio se triplica. La espera supera una hora. 
Y el promotor recibe el 80 % de las quejas negativas del evento por algo 
que no organizó él."

[10–35s] Problema y contexto
"El transporte al y desde el evento es el mayor punto de fricción no resuelto 
en la industria del live entertainment. Los grandes operadores de movilidad 
no están especializados en eventos. Los promotores no tienen herramientas propias."

[35–60s] Solución y diferenciación
"ConcertRide resuelve esto: es una plataforma vertical de rides compartidos 
para eventos de música. El asistente reserva su asiento en el ride 
cuando compra la entrada. El conductor publica su ruta con días de antelación. 
No hay surge pricing. No hay sorpresas. Y el promotor recibe datos de movilidad 
e ingresos por cada reserva sin haber invertido nada."

[60–80s] Propuesta de valor y modelo
"Integramos en 2 semanas vía widget o API. El modelo es de revenue-share: 
si el evento no llena rides, no cobras nada. Y de media, en un evento 
de 5.000 personas, el potencial de ingresos para el promotor es 
de [COMPLETAR con estimación propia]."

[80–90s] CTA
"Tenemos disponibilidad para un piloto este verano. ¿Puedo enviarte el 
one-pager y reservar 20 minutos para mostrarte la plataforma en vivo?"
```

---

### 4.3 Email B2B — Promotor / Venue

**Asunto A:** El problema que nadie resuelve después de tu concierto  
**Asunto B:** ConcertRide × {{nombre_evento}} — rides compartidos oficiales  
**Asunto C:** Cómo [Sala/Festival X] reduce congestión y genera ingresos extra con movilidad

---

Hola {{nombre}},

El {{fecha_próximo_evento}} tienes {{nombre_evento}} en {{ciudad}}. Cuando termine, habrá {{X}} personas intentando salir del recinto al mismo tiempo.

Soy {{tu_nombre}} de ConcertRide. Llevamos [X meses] construyendo la plataforma de rides compartidos para eventos de música — no para movilidad genérica, sino específicamente para este momento.

Lo que hacemos para promotores como {{empresa}}:

- **Reducimos el caos en la salida** — los asistentes que usan ConcertRide coordinan su viaje antes del evento, no cuando ya están saturados intentando pedir un taxi
- **Generamos una nueva fuente de ingresos** para {{empresa}} vía revenue-share por cada reserva, sin ninguna inversión previa de vuestra parte
- **Entregamos un informe de movilidad post-evento** — patrones de llegada/salida, zonas de origen, picos de demanda — que normalmente cuesta pedir a consultoras

La integración tarda menos de 2 semanas y no requiere cambios en vuestra venta de entradas.

¿Tienes 20 minutos esta semana o la próxima para ver una demo en vivo? Aquí hay un vídeo corto de cómo funciona: {{demo_link}}

Saludos,  
{{tu_nombre}}  
{{cargo}} — ConcertRide  
{{teléfono}} | {{email}}

*P.D. Si no eres la persona correcta para esto, ¿me puedes indicar quién gestiona las operaciones o los partnerships en {{empresa}}? Te lo agradezco.*

---

### 4.4 Email comprador / inversor

**Asunto A:** ConcertRide — oportunidad en movilidad vertical para eventos  
**Asunto B:** Vertical de ride-sharing para conciertos: tracción + activos técnicos

---

Hola {{nombre}},

Te escribo porque {{empresa}} trabaja en [movilidad / eventos / ticketing / experiencias] y creo que ConcertRide puede ser relevante para vosotros, ya sea como adquisición, inversión o partnership estratégico.

**ConcertRide en una línea:** plataforma vertical de rides compartidos para eventos de música en vivo — con modelo de ingresos B2B (promotores, venues, ticketing) y B2C (comisión por reserva).

**Por qué ahora:**
- El mercado de live entertainment en Europa supera los €X.XB anuales y crece post-COVID
- No existe un competidor dominante en este nicho en España y sur de Europa
- El producto técnico está construido (Cloudflare Workers + React + Drizzle + SEO estructural implementado)

**Lo que incluye el activo:**
- Codebase completo (monorepo Cloudflare Workers + React 18 + Turso)
- Catálogo de conciertos y festivales con landing pages SEO
- Sistema de autenticación, booking y matching de rides
- [COMPLETAR: usuarios registrados, eventos activos, bookings realizados]

Puedo compartir el data room completo (analytics, base de código, contratos y tracción) en 24–48h bajo NDA estándar.

¿Tiene sentido hablar 30 minutos?

{{tu_nombre}}  
{{email}} | {{LinkedIn}}

---

### 4.5 Email captación B2C

**Asunto A:** ¿Vas a {{nombre_artista}} en {{ciudad}}? Organiza el viaje con otros fans  
**Asunto B:** Para ir a {{nombre_festival}}: rides compartidos sin surge pricing

---

Hola,

¿Tienes entrada para {{nombre_evento}} el {{fecha}}?

ConcertRide es la forma de llegar (y volver) sin pagar el triple en Uber, sin esperar 45 minutos en la calle y sin perder el último tren.

Cómo funciona:
1. Publica tu ruta o busca un ride desde tu zona
2. Reserva tu asiento con antelación — precio fijo, sin sorpresas
3. Viaja con gente que va al mismo concierto

**Oferta de lanzamiento:** {{descuento_promo}} en tu primera reserva con el código **PRIMERAVIAJE**

👉 {{link_registro}} — tarda menos de 2 minutos

Nos vemos allí,  
Equipo ConcertRide

*(Si no te interesa recibir más mensajes, puedes darte de baja aquí: {{unsubscribe_link}})*

---

### 4.6 Secuencia de seguimiento B2B (3 pasos)

| Paso | Timing | Objetivo | Plantilla |
|---|---|---|---|
| **Step 1** | Día 0 | Primer contacto + one-pager | Email 4.3 + adjuntar PDF one-pager + demo link |
| **Step 2** | Día 4–6 | Recordatorio + añadir valor | Ver abajo |
| **Step 3** | Día 12–15 | Última propuesta concreta | Ver abajo |

**Step 2 — Follow-up:**

Asunto: Re: [asunto original] — ¿Pudiste ver el demo?

Hola {{nombre}},

Solo quería comprobar si tuviste oportunidad de ver el vídeo que te envié. Entiendo que la agenda en esta época está cargada.

Por si te ayuda: [añadir UN dato nuevo o una noticia relevante del sector — ej. "Vi que el festival X anunció problemas de acceso el año pasado — exactamente el tipo de situación que resolvemos"].

¿Tienes 15 minutos esta semana?

{{tu_nombre}}

---

**Step 3 — Último intento + propuesta concreta:**

Asunto: Propuesta piloto para {{nombre_evento}} — sin compromiso

Hola {{nombre}},

Último mensaje de mi parte — si no es el momento, lo entiendo totalmente.

Lo que quiero proponer es un **piloto de bajo riesgo** para un solo evento:
- Sin coste fijo para {{empresa}}
- Integración en 1 semana (widget en vuestra web o landing temporal)
- Métricas de éxito acordadas de antemano
- Si no genera valor, se retira sin coste

¿Le damos una oportunidad? Aquí mi calendario: {{calendly_link}}

Si prefieres que te contacte en otro momento, dímelo y lo agendo.

Gracias por tu tiempo,  
{{tu_nombre}}

---

## 5. CSV EJEMPLO DE PROSPECTOS

> **Aviso legal:** Este CSV usa placeholders realistas, NO datos personales reales. Para recopilar contactos reales, usar LinkedIn Sales Navigator, búsqueda manual en webs corporativas o directorios sectoriales (APM, PROMUSICAE, FIM) con respeto al RGPD. Nunca comprar bases de datos de contactos sin consentimiento verificado.

```csv
empresa,sector,rol_objetivo,ciudad,motivo_personalizado,asunto_email_1,prioridad,notas
"FestivalPromotor_A","Promotor de festivales","Director de Producción","Madrid","Tienen festival de 25k asistentes con acceso complejo por carretera de 2 carriles","¿Cómo gestionáis la salida de 25.000 personas al mismo tiempo?","1","Contactar 3 meses antes del festival"
"SalaConciertosMed_B","Venue mediana 3.000 aforo","Responsable de Operaciones","Barcelona","Parking para 200 coches en sala de 3.000 — ratio crítico","El parking de [Sala] da para el 6% de tus asistentes. Hay una solución.","1","Buscar contacto en LinkedIn: Operations Manager"
"TicketingPlatform_C","Plataforma de ticketing","Head of Product","Madrid","Checkout con 5 pasos sin upsell de transporte — oportunidad clara","Upsell de viaje en el checkout: +€8 por transacción sin fricción","2","Solicitar demo de su API primero para preparar propuesta técnica"
"ShuttleOperator_D","Empresa de autobuses","Director Comercial","Valencia","Operan 20 vehículos, trabajan eventos de forma ad-hoc sin sistema digital","Ocupa tu flota al 90% cada evento — sin equipo de ventas propio","2","Ofrecer modelo sin cuota de entrada, solo comisión"
"CerveceraMarca_E","Patrocinador FMCG","Brand Manager Eventos","Barcelona","Patrocinan 3 festivales de música al año, buscan activaciones experienciales","Patrocina las Rutas Oficiales de [Festival]: 15.000 impresiones antes del evento","3","Esperar a tener datos de 1 piloto antes de contactar"
"AyuntamientoCiudad_F","Administración pública","Técnico de Movilidad","Sevilla","Plan de movilidad sostenible para eventos requerido por nueva ordenanza","ConcertRide genera automáticamente tu informe de movilidad para eventos","3","Investigar si hay convocatoria de subvenciones de movilidad activa"
"UniversidadAsoc_G","Universidad / RRSS estudiantil","Presidente de delegación","Salamanca","Organizan buses a conciertos en Madrid de forma manual por WhatsApp","Digitaliza los buses universitarios a conciertos — sin coste para la asociación","4","Proponer modelo gratuito para asociaciones a cambio de crecimiento orgánico"
"AgenciaExperiencias_H","Marketplace de experiencias","Director de Partnerships","Madrid","Plataforma de venta de experiencias de ocio sin solución de transporte","Completa la experiencia: añade movilidad a cada experiencia que vendes","4","Proponer integración de widget — bajo esfuerzo técnico para ellos"
```

---

## 6. KPIs Y MÉTRICAS CLAVE

### 6.1 Top 10 KPIs para early-stage (priorizado)

| # | KPI | Definición / Fórmula | Objetivo early-stage | Por qué es prioritario |
|---|---|---|---|---|
| 1 | **Ride Bookings / mes** | Nº de reservas de asiento confirmadas en el mes | >50 en mes 1 → >500 en mes 6 | Métrica de salud del core product |
| 2 | **Conversion Rate (visita → booking)** | Bookings / Visitas únicas × 100 | >2–5 % | Valida la propuesta de valor en el funnel |
| 3 | **MAU (Monthly Active Users)** | Usuarios que hacen ≥1 acción en los últimos 30 días | >200 mes 1 → >2.000 mes 6 | Mide tracción real, no registros dormidos |
| 4 | **GMV (Gross Merchandise Value)** | Suma total del valor de todas las reservas (antes de comisión) | >€500/mes en mes 2 | Valida willingness to pay |
| 5 | **Take Rate** | Ingresos netos ConcertRide / GMV × 100 | 10–15 % objetivo | Mide eficiencia del modelo de comisión |
| 6 | **B2B Pipeline** | Nº de empresas en conversación activa (contactadas + en negociación) | ≥10 en primeros 30 días | Early indicator de escalabilidad |
| 7 | **B2B Conversion Rate** | Acuerdos cerrados / Empresas contactadas × 100 | >5–10 % en primeros 3 meses | Valida el go-to-market B2B |
| 8 | **Ride Fill Rate** | Plazas ocupadas / Plazas publicadas × 100 | >60 % para validar liquidez de la red | Indicador del problema del cold start |
| 9 | **Retention (D30)** | % usuarios que realizan una segunda acción a los 30 días del registro | >20 % mes 1 → >40 % mes 4 | Valida product-market fit |
| 10 | **NPS (Net Promoter Score)** | % Promotores − % Detractores (encuesta post-evento) | >30 early-stage; >50 objetivo | Predictor de crecimiento orgánico |

### 6.2 KPIs secundarios a trackear desde el inicio

- CAC (Customer Acquisition Cost) por canal
- Payback period del CAC (meses)
- Churn mensual (usuarios que dejan de usar la plataforma)
- Tiempo medio entre registro y primera reserva
- Nº eventos activos en plataforma
- Revenue per B2B partner / mes

**Siguiente acción recomendada:** Implementar un dashboard mínimo (Google Sheets o Metabase) que trackee los 10 KPIs desde el día 1 de campaña — sin datos, no hay aprendizaje.

---

## 7. PLAN OPERATIVO — 30 DÍAS

### Objetivo: Ejecutar outreach a 50 empresas B2B en 30 días

### Semana 0 (Pre-launch, días -7 a 0) — Preparación

| Tarea | Responsable | Tiempo estimado | Entregable |
|---|---|---|---|
| Maquetar one-pager en Canva/Figma (usar texto sección 4.1) | Fundador / diseño | 2–3h | PDF one-pager |
| Grabar demo video de 90s de la plataforma | Fundador | 2h (grabación) + 1h (edición básica) | Link a vídeo (Loom o YouTube unlisted) |
| Crear lista de 50 targets B2B en Google Sheets con columnas del CSV | Fundador | 3–4h | Lista priorizada |
| Configurar herramienta de email outreach (Lemlist, Instantly, Mailshake o manual Gmail) | Fundador | 1–2h | Cuenta configurada |
| Preparar plantillas en la herramienta con variables de personalización | Fundador | 1h | 3 secuencias cargadas |
| Revisar aviso legal y privacidad para outreach (ver sección 9) | Fundador / asesoría | 1h | Check RGPD |
| Crear Calendly (o similar) para reserva de demos | Fundador | 30min | Link de demo |

### Semana 1 (días 1–7) — Primera oleada

| Tarea | Volumen | Tiempo/día | Notas |
|---|---|---|---|
| Enviar emails a Prioridad 1 (promotores + venues) | 20 emails | 1–2h/día | Personalizar cada email con nombre del evento específico |
| Conexiones en LinkedIn + InMail a los mismos contactos | 20 requests | 30min/día | Mensaje corto, no copiar el email |
| Trackear aperturas y respuestas en spreadsheet | — | 15min/día | Anotar: abrió / respondió / no abrió / rebotó |
| Realizar 2–3 llamadas a contactos con alta intención (si responden) | 2–3 llamadas | 30min/call | Usar guión del pitch 90s |

### Semana 2 (días 8–14) — Segunda oleada + seguimiento

| Tarea | Volumen | Tiempo/día | Notas |
|---|---|---|---|
| Enviar emails a Prioridad 2 (ticketing + shuttles) | 15 emails | 1h/día | |
| Enviar Step 2 de seguimiento a Prioridad 1 que no respondieron | 15–18 emails | 30min | Personalizar con dato nuevo |
| Realizar demos con quien haya respondido positivamente | 2–4 demos | 1h/demo | Preparar demo en staging con datos reales si los hay |
| Actualizar pipeline en spreadsheet | — | 15min/día | Estado: contactado / demo agendada / interesado / no interesado / piloto |

### Semana 3 (días 15–21) — Tercera oleada + cierre de pipeline

| Tarea | Volumen | Tiempo/día | Notas |
|---|---|---|---|
| Enviar emails a Prioridad 3 (patrocinadores + ayuntamientos) | 10 emails | 45min/día | |
| Enviar Step 3 (last chance) a quienes no han respondido en 2 semanas | 15 emails | 30min | Propuesta de piloto concreto |
| Cerrar 1–2 acuerdos piloto o letters of intent | — | — | Objetivo mínimo de la campaña |
| Analizar métricas de la campaña: open rate, reply rate, demos, conversiones | — | 1h | |

### Semana 4 (días 22–30) — Consolidación y aprendizaje

| Tarea | Descripción | Entregable |
|---|---|---|
| Ejecutar 1er piloto si se ha cerrado | Configurar evento en plataforma, coordinar con el partner | Datos de primer piloto |
| Refinar mensajes según feedback de las conversaciones | Ajustar argumentos que funcionaron/no funcionaron | Plantillas v2 |
| Preparar deck de 10 slides para presentación a inversores/compradores | Si el objetivo es captación de inversión | Deck |
| Retrospectiva: ¿qué segmento respondió mejor? ¿qué mensaje funcionó? | — | Informe de 1 página |

**KPIs de la campaña (objetivo a 30 días):**
- Emails enviados: 50
- Open rate objetivo: >40 %
- Reply rate objetivo: >8–12 %
- Demos realizadas: ≥5
- Pilotos acordados: ≥1

**Siguiente acción recomendada:** Empezar por la tarea de preparación de la lista de 50 targets — sin lista, no hay campaña. Dedicar 3–4 horas a esto antes de escribir un solo email.

---

## 8. PILOTOS RECOMENDADOS

### Piloto 1 — Ride-sharing orgánico en festival mediano

**Descripción:** Integrar ConcertRide como servicio de rides compartidos para un festival de 3.000–8.000 asistentes, promovido por el propio organizador en sus canales.

| Parámetro | Detalle |
|---|---|
| **Duración** | 6–8 semanas (4 semanas pre-evento + evento + 1 semana post) |
| **Coste estimado** | €500–€2.000 (principalmente tiempo del equipo + posible gasto en ads para activar a los asistentes) |
| **Quién paga** | ConcertRide asume el coste; el promotor aporta visibilidad en su mailing y redes |
| **Métricas de éxito** | ≥200 registros de usuarios, ≥50 bookings, Fill Rate >50 %, NPS >30 |
| **Riesgo** | Cold start: pocos conductores al inicio. Mitigación: reclutar conductores proactivamente antes del evento |

---

### Piloto 2 — Widget de checkout con plataforma de ticketing

**Descripción:** Integrar un widget de ConcertRide en el paso final del checkout de una plataforma de ticketing mediana (500–5.000 transacciones/mes), ofreciendo la opción de reservar viaje al comprar la entrada.

| Parámetro | Detalle |
|---|---|
| **Duración** | 8–12 semanas (2 semanas de integración + 6–8 semanas de datos) |
| **Coste estimado** | €1.000–€3.000 (tiempo de desarrollo del widget + integración técnica) |
| **Modelo** | Revenue-share: 50/50 de la comisión de cada booking generado desde el widget |
| **Métricas de éxito** | ≥3 % de compradores de entrada añaden ride, ≥100 bookings, >€500 en GMV |
| **Riesgo** | La integración técnica puede retrasarse. Mitigación: ofrecer landing page intermedia en lugar de API real para testear el concepto antes de integrar |

---

### Piloto 3 — Shuttle operado con operador local

**Descripción:** Asociarse con un operador de autobuses/minibuses local para crear rutas shuttle para un evento grande (>5.000 personas), gestionadas íntegramente desde ConcertRide.

| Parámetro | Detalle |
|---|---|
| **Duración** | 4–6 semanas (3 semanas de pre-venta + evento) |
| **Coste estimado** | €0 coste fijo para ConcertRide; el operador cobre el coste del vehículo y se comparten ingresos |
| **Modelo** | ConcertRide vende los billetes (€8–€15/persona); operador recibe 60–70 %; ConcertRide 30–40 % |
| **Métricas de éxito** | ≥80 % de ocupación del shuttle, ingresos netos >€500, 0 incidencias de seguridad |
| **Riesgo** | Responsabilidad legal en transporte de pasajeros. Mitigación: asegurar que el operador tiene seguro de transporte de viajeros; ConcertRide actúa como intermediario (no transportista) |

**Siguiente acción recomendada:** Seleccionar el Piloto 1 como primer paso por ser el de menor riesgo técnico y legal, y buscar el festival objetivo en los próximos 2–3 meses.

---

## 9. TRANSPARENCIA, RIESGOS LEGALES Y RGPD

### 9.1 Transparencia sobre las estimaciones

| Cifra | Cómo verificar | Fuentes recomendadas |
|---|---|---|
| TAM: €1.7B – €7.5B | Comprar o descargar informe de IFPI o PwC Live Entertainment | [IFPI](https://www.ifpi.org), [PwC Entertainment & Media Outlook](https://www.pwc.es) |
| SAM: €40M – €185M España | Solicitar datos de asistencia a APM (Asociación de Promotores Musicales) o Promusicae | [APM](https://www.apmusicales.com), [Promusicae](https://www.promusicae.es) |
| % disposición a usar app: 15–30 % | Realizar encuesta propia de 50–100 personas en el target | Google Forms + difusión en grupos de fans |
| Reducción de congestión: 15–30 % | Estudios de casos de shuttle en eventos (Arup, AECOM) | Buscar "event transport demand management" en Google Scholar |
| Retention benchmark >20 % D30 | Comparar con benchmarks de apps de movilidad (AppsFlyer State of Mobile) | [AppsFlyer](https://www.appsflyer.com/resources/) |

### 9.2 Riesgos legales y RGPD

**Riesgo 1 — Datos de geolocalización de usuarios**
- **Problema:** Recopilar ubicación de usuarios en tiempo real requiere consentimiento explícito bajo RGPD Art. 6 y 9.
- **Mitigación:** Implementar banner de consentimiento granular (no bundled); permitir uso sin geolocalización con degradación funcional; revisar política de privacidad con asesoría legal especializada en datos.

**Riesgo 2 — Compartir datos de usuarios con promotores/partners B2B**
- **Problema:** No se pueden compartir datos personales de usuarios con terceros sin base legal válida y sin informar al usuario.
- **Mitigación:** Los informes de movilidad para promotores deben ser **agregados y anonimizados** (nunca datos individuales). Incluir cláusula de tratamiento de datos en contratos B2B.

**Riesgo 3 — Outreach por email (LOPD-GDD / RGPD)**
- **Problema:** Enviar emails comerciales a empresas requiere que haya interés legítimo documentado o consentimiento previo. Dirigirse a contactos individuales (personas físicas) sin consentimiento puede infringir la LOPD-GDD.
- **Mitigación:** Para B2B, el interés legítimo es generalmente aceptado si el mensaje es relevante para la actividad profesional del destinatario. Incluir siempre opción de baja clara. No comprar bases de datos de contactos. Documentar la base legal del envío.

**Riesgo 4 — Responsabilidad en transporte de pasajeros**
- **Problema:** Si ConcertRide actúa como plataforma intermediaria entre conductores particulares y pasajeros, puede quedar fuera de la regulación VTC. Pero si organiza rutas con vehículos contratados, puede necesitar licencia de operador de transporte.
- **Mitigación:** Revisar el modelo legal con abogado especializado en movilidad (ej. distinguir carpool social de servicio VTC comercial). Incluir términos claros de que ConcertRide es plataforma, no transportista.

**Riesgo 5 — Menores de edad**
- **Problema:** Si hay usuarios menores de 16 años, se requiere consentimiento parental bajo RGPD.
- **Mitigación:** Establecer edad mínima de 18 años en los términos, con verificación en el registro.

**Siguiente acción recomendada:** Consultar con un abogado especializado en tech/movilidad antes de lanzar el primer piloto con cobro real — el coste de una consulta preventiva (€200–€500) es menor que el riesgo de una sanción.

---

## 10. PREGUNTAS CLAVE PARA AFINAR EL ANÁLISIS

Para que este análisis sea más preciso y los materiales de outreach más efectivos, necesito que respondas:

1. **País/ciudades objetivo en el corto plazo:** ¿Solo España? ¿Qué ciudades priorizas en año 1? (Madrid, Barcelona, Valencia, Sevilla, otras)

2. **Tracción actual real:** ¿Cuántos usuarios registrados tienes? ¿Cuántos bookings se han realizado? ¿Hay eventos activos ahora mismo en la plataforma? (Sin datos reales, los materiales de outreach quedan genéricos y son menos creíbles)

3. **Modelo de ingresos preferido:** ¿Comisión por booking (B2C-first), SaaS para promotores (B2B-first), o híbrido? Esto cambia completamente el go-to-market.

4. **Recursos disponibles:** ¿Cuántas horas/semana puedes dedicar al outreach comercial? ¿Tienes equipo de ventas o lo llevas tú solo? ¿Hay presupuesto para herramientas de outreach (€50–€200/mes)?

5. **¿Tienes ya algún contacto o acuerdo con promotores o venues?** Aunque sea informal — un acuerdo de piloto en marcha cambia completamente la narrativa con futuros prospects y con inversores.

---

## APÉNDICE — Herramientas recomendadas para el outreach

| Herramienta | Uso | Precio | Alternativa gratuita |
|---|---|---|---|
| **Lemlist / Instantly** | Email outreach con personalización y seguimiento automático | €50–€100/mes | Gmail manual + Google Sheets |
| **LinkedIn Sales Navigator** | Búsqueda de contactos por cargo y empresa | €80/mes | LinkedIn gratuito (limitado) |
| **Loom** | Grabar demo de 90s para incluir en emails | Gratis (básico) | OBS + YouTube unlisted |
| **Calendly** | Reserva de demos sin fricción | Gratis (básico) | Google Calendar con link |
| **Notion / Google Sheets** | Gestión del pipeline de outreach | Gratis | — |
| **Apollo.io** | Búsqueda de emails verificados de empresas | Freemium | Hunter.io (freemium) |

> **Aviso RGPD:** Al usar herramientas como Apollo o Hunter para obtener emails, verificar que los contactos se capturan bajo interés legítimo documentado y que se ofrece siempre opción de baja. No usar en listas de personas físicas no profesionales.

---

*Documento generado: 2026-05-03 — Revisión recomendada tras completar el cuestionario de la sección 10.*
