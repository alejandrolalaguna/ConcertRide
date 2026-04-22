# ConcertRide — Roadmap de Features

> Las features están ordenadas por impacto en el negocio, no por complejidad técnica. Cada bloque incluye por qué es necesaria la feature, qué problema resuelve y el esfuerzo estimado de ingeniería.

---

## Bloque 0 — Fundamentos de negocio (pre-lanzamiento obligatorio)

Estas features deben existir antes de cualquier adquisición de usuarios reales. Sin ellas no hay datos, no hay dinero y no hay producto defendible.

---

### 0.1 — Confirmación de ride completado

**Problema:** Actualmente no hay forma de saber si un ride reservado se realizó realmente. El modelo de negocio entero depende de este dato.

**Solución:** Añadir un botón "Confirmar viaje completado" que activa el conductor al llegar al destino. El pasajero lo confirma por su lado. Si solo confirma uno, se marca como "completado unilateralmente" y se guarda para revisión.

**Por qué ahora:** Es el KPI #1 del negocio. Sin él no se puede medir nada, cobrar comisión ni detectar fraude.

**Esfuerzo:** 1 día (campo `completed_at` + `completion_confirmed_by` en el modelo Ride, dos botones en la UI).

---

### 0.2 — Analítica básica (Plausible)

**Problema:** No hay datos de ningún tipo sobre comportamiento de usuarios, fuentes de tráfico ni funnel de conversión.

**Solución:** Instalar Plausible Analytics. Un script tag, sin cookies, compatible GDPR por defecto, €9/mes.

**Eventos custom a trackear:**
- `ride_created` — conductor publica un ride
- `seat_requested` — pasajero solicita asiento
- `seat_confirmed` — conductor acepta solicitud
- `ride_completed` — confirmación bilateral
- `registration_completed` — nuevo usuario registrado

**Por qué ahora:** Sin datos no se puede optimizar el CAC, detectar el canal que mejor convierte ni justificar ninguna decisión de producto.

**Esfuerzo:** 2 horas.

---

### 0.3 — Sugerencia de precio basada en combustible

**Problema:** La API de precio del combustible existe y devuelve datos reales del MITECO, pero no se usa para nada útil. Los conductores fijan precios a ciegas.

**Solución:** Al crear un ride, mostrar al conductor: *"Basándonos en el precio actual del combustible (€1,72/L) y la distancia aproximada, el precio sugerido es €18 por asiento."* El conductor puede aceptarlo o modificarlo.

**Por qué ahora:** Tres efectos inmediatos: (1) los precios son más consistentes y razonables, lo que reduce el abandono del pasajero; (2) valida la disposición a pagar de ambos lados; (3) es la justificación de valor de la futura comisión ("usamos los datos para que el precio sea justo").

**Esfuerzo:** 1 día (cálculo distancia origen→venue usando coordenadas ya almacenadas + llamada a `/api/fuel-price` + UI en el formulario de creación de ride).

---

### 0.4 — UTM tracking en todos los enlaces de salida

**Problema:** No se puede atribuir ningún usuario a ningún canal de adquisición.

**Solución:** Añadir parámetros UTM a todos los enlaces compartibles (ride detail page, concert page, invitaciones de conductor). Ejemplo: `?utm_source=whatsapp&utm_medium=share&utm_campaign=primavera2026`.

**Por qué ahora:** Necesario desde el Día 1 de adquisición para saber qué canales funcionan.

**Esfuerzo:** 4 horas (helper de generación de URLs + integración con Plausible).

---

## Bloque 1 — Monetización (Mes 1–3)

---

### 1.1 — Integración de pagos (Stripe)

**Problema:** Sin pago en plataforma no hay comisión, no hay revenue share con partners y no hay modelo de negocio escalable.

**Solución:** Stripe Connect para marketplaces:
- El pasajero paga al reservar el asiento (tarjeta, Apple Pay, Google Pay)
- ConcertRide retiene el 12–15% de comisión
- El conductor recibe el resto automáticamente cuando el ride se confirma como completado
- Reembolso automático si el conductor cancela

**Flujo de datos:**
1. Pasajero reserva → Stripe crea un PaymentIntent (estado: `authorized`)
2. Ride completado → Stripe captura y hace el payout al conductor
3. Cancelación del conductor → Stripe reembolsa automáticamente

**Por qué en Bloque 1:** Es el prerrequisito de todo lo demás. Sin esto no hay negocio.

**Esfuerzo:** 5–7 días (Stripe Connect onboarding para conductores, webhooks de Stripe, UI de pago en la reserva, gestión de disputas básica).

---

### 1.2 — Panel de ganancias del conductor

**Problema:** Sin visibilidad de lo que ha ganado, un conductor no tiene motivación para seguir usando la plataforma.

**Solución:** Sección "Mis ganancias" en el perfil del conductor:
- Total ganado (histórico y este mes)
- Rides completados
- Valoración media
- Próximos rides con plazas disponibles

**Por qué en Bloque 1:** La retención del conductor es el KPI más importante. Sin ella el marketplace se vacía.

**Esfuerzo:** 1 día (consulta sobre rides completados + UI simple).

---

### 1.3 — Sistema de referidos de conductores

**Problema:** El CAC del conductor es el más crítico. Sin un mecanismo viral la adquisición de oferta depende 100% de paid ads.

**Solución:**
- Cada conductor tiene un código/enlace de referido único
- Cuando un conductor referido completa su primer ride, el conductor que refirió recibe €5 de crédito (descontado de la comisión del siguiente ride)
- UI: badge "Has referido X conductores" en el perfil

**Por qué en Bloque 1:** El CAC del conductor vía referidos estimado es <€1 vs. €2–5 via paid. Es el canal más eficiente posible.

**Esfuerzo:** 2 días (campo `referred_by` en User, lógica de crédito en el payout de Stripe, página de referidos).

---

## Bloque 2 — Retención y confianza (Mes 3–6)

---

### 2.1 — Verificación de identidad del conductor (DNI/carnet)

**Problema:** Cualquier persona puede registrarse como conductor sin acreditar que tiene carnet de conducir. Esto es un riesgo legal y de confianza para los pasajeros.

**Solución:** Integrar Stripe Identity (o similar) para verificación de documentos:
- El conductor sube foto del carnet de conducir + selfie
- Verificación automática en <2 minutos
- Badge "Conductor verificado" visible en el perfil y en los ride cards

**Por qué en Bloque 2:** Necesario antes de escalar. Sin esto el producto no es seguro para crecer. Los festivals y venues no se asociarán con una plataforma sin verificación básica.

**Esfuerzo:** 3 días (integración Stripe Identity + UI de onboarding conductor + badge en perfil).

---

### 2.2 — Notificaciones push (PWA)

**Problema:** El PWA ya tiene service worker configurado pero no se usan notificaciones push. Los usuarios se pierden eventos críticos (solicitud aceptada, mensaje nuevo, ride inminente).

**Solución:** Web Push Notifications via la Web Push API:
- "Tu solicitud de asiento ha sido aceptada"
- "Tienes un mensaje nuevo de [conductor]"
- "Tu ride a [concierto] es mañana — confirma la hora de salida"
- "Nuevo ride disponible para [concierto] desde [ciudad]" (para pasajeros que han marcado interés)

**Por qué en Bloque 2:** La tasa de apertura de push notifications es 4–8x mayor que la de email. Es el canal de retención más eficiente sin coste de envío.

**Esfuerzo:** 3 días (Web Push API + lógica de suscripción en frontend + triggers en eventos de backend).

---

### 2.3 — Demand alerts (alertas de demanda)

**Problema:** El campo `demand_count` ya existe en el modelo Concert pero solo se muestra. No se usa para nada accionable.

**Solución:** Cuando un usuario pulsa "Me interesa" en un concierto sin rides disponibles:
1. Se registra la señal de demanda (ya existe)
2. Cuando se crea un ride para ese concierto desde la misma ciudad del usuario, se le notifica automáticamente (push + email)

**Por qué en Bloque 2:** Cierra el loop de supply-demand. Convierte la frustración de "no hay rides" en una oportunidad de retención.

**Esfuerzo:** 1 día (trigger en `POST /api/rides` que busca demanda pendiente para ese concierto + ciudad y dispara notificación).

---

### 2.4 — Perfil de conductor enriquecido

**Problema:** El modelo User ya tiene campos (car_model, car_color, vibe, playlist_url) pero la UI de perfil es básica.

**Solución:** Página de perfil de conductor con:
- Foto del coche
- Playlist de Spotify embebida (campo ya existe en rides)
- Historial de rides completados (público, anónimo)
- Reviews con foto del reviewer
- Badge de conductor verificado
- "X personas han viajado con este conductor"

**Por qué en Bloque 2:** La conversión pasajero→reserva está bloqueada por la desconfianza. Un perfil rico reduce el tiempo de decisión.

**Esfuerzo:** 2 días (UI únicamente, todos los datos existen en el modelo).

---

## Bloque 3 — Crecimiento y partnerships (Mes 6–9)

---

### 3.1 — Widget embebible para partners

**Problema:** Sin un widget, los festivals y salas solo pueden enlazar a ConcertRide. Eso genera fricción y baja conversión.

**Solución:** Un iFrame embebible que los partners añaden a su web:
```html
<iframe src="https://concertride.es/widget/concert/[id]" width="100%" height="400"></iframe>
```
Muestra: rides disponibles para ese concierto, botón "Reservar asiento", branding co-branded.

**Por qué en Bloque 3:** Es el producto que los festivals y salas en realidad compran. Sin él, el partnership es solo un link.

**Esfuerzo:** 3 días (endpoint público `/widget/concert/:id` + componente React embebible + configuración de CORS para dominios partner).

---

### 3.2 — API pública para partners (tier básico)

**Problema:** Los partners tecnológicos (Songkick, Wegow, Ticketmaster) necesitan una API para integración profunda.

**Solución:** API REST autenticada con API key:
- `GET /api/partner/concerts` — conciertos con rides disponibles
- `GET /api/partner/concerts/:id/rides` — rides para un concierto
- `POST /api/partner/rides/deeplink` — genera un deeplink rastreado

**Por qué en Bloque 3:** Desbloquea los partnerships B2B más valiosos. Songkick y Wegow necesitan una API, no un widget.

**Esfuerzo:** 2 días (middleware de autenticación por API key + rutas partner + rate limiting).

---

### 3.3 — Ingestion multi-source (Dice + Bandsintown)

**Problema:** El catálogo de conciertos es 100% Ticketmaster. Un cambio en su API o un festival que no usa TM deja huecos visibles en el producto.

**Solución:** Implementar los adaptadores ya stubbeados:
- **Dice** (Tier 1): Partner API con DICE_PARTNER_KEY — muchos festivales europeos usan Dice
- **Bandsintown** (Tier 3): API pública para lookups de artistas — enriquecimiento y dedup

**Por qué en Bloque 3:** Robustez del catálogo antes de lanzamientos con partners. Un partner que ve conciertos faltantes no renueva.

**Esfuerzo:** 2–3 días por adaptador (la interfaz ya está definida en `types.ts`).

---

### 3.4 — Panel de partner (self-serve)

**Problema:** Cada nuevo partnership requiere intervención manual del equipo. No escala.

**Solución:** Portal web donde venues y promotores pueden:
- Reclamar su concierto / festival
- Activar el widget para sus eventos
- Ver métricas: rides creados, asientos reservados, usuarios únicos
- Configurar su revenue share

**Por qué en Bloque 3:** Pasa de "1-to-1 sales" a "self-serve marketplace". Es el salto de Fase 2 a Fase 3.

**Esfuerzo:** 1 semana (nuevo rol `partner` en User, dashboard con métricas, configuración de widget).

---

## Bloque 4 — Experiencia avanzada (Mes 9–12)

---

### 4.1 — Matching automático de rides

**Problema:** Los pasajeros tienen que buscar manualmente entre rides disponibles filtrando por ciudad y fecha.

**Solución:** Matching proactivo:
- Al registrarse o marcar interés en un concierto, el usuario indica su ciudad de origen
- El sistema notifica automáticamente cuando aparece un ride compatible (mismo concierto, misma ciudad de origen ±50km)
- Deeplink directo a la reserva

**Por qué en Bloque 4:** Reduce el tiempo entre "usuario interesado" y "asiento reservado". Aumenta la conversión sin aumentar el CAC.

**Esfuerzo:** 2 días (job en background que corre al crear un ride + consulta de demanda pendiente + notificación).

---

### 4.2 — Rides recurrentes para conductores frecuentes

**Problema:** Un conductor que va a todos los conciertos de un festival de 3 días tiene que crear 3 rides separados.

**Solución:** Opción "Crear rides para todos los días del festival" que duplica automáticamente el ride para cada fecha del evento multi-día.

**Por qué en Bloque 4:** Reduce la fricción para los conductores más valiosos (los que van a múltiples eventos seguidos tienen el LTV más alto).

**Esfuerzo:** 1 día (lógica de duplicación de ride + UI de checkbox "festival multi-día").

---

### 4.3 — Chat mejorado con media sharing

**Problema:** El chat actual es texto plano. Los coordinadores de rides comparten fotos de punto de encuentro, Google Maps links, etc. por WhatsApp fuera de la plataforma.

**Solución:** Añadir soporte para:
- Links con preview automático
- Compartir ubicación en tiempo real (Web Geolocation API)
- Foto del punto de encuentro

**Por qué en Bloque 4:** Retiene la conversación dentro de la plataforma, lo que aumenta la confianza y reduce la tasa de no-shows.

**Esfuerzo:** 3 días.

---

### 4.4 — Programa de conductores premium

**Problema:** Los mejores conductores (>20 rides, rating >4.8) son los activos más valiosos del marketplace pero no reciben ningún trato diferencial.

**Solución:** Tier "ConcertRide Pro" para conductores:
- Badge visible en el perfil y ride cards
- Comisión reducida: 8% vs. 12% estándar
- Posicionamiento prioritario en resultados de búsqueda
- Acceso anticipado a conciertos nuevos ingestionados

**Por qué en Bloque 4:** Retiene a los conductores con mayor LTV y crea un objetivo aspiracional para los nuevos.

**Esfuerzo:** 1 día (campo `is_pro` en User + lógica de elegibilidad + UI de badge).

---

## Resumen por bloques

| Bloque | Periodo | Features | Impacto principal |
|---|---|---|---|
| **0** | Pre-lanzamiento | Confirmación ride, Plausible, sugerencia precio, UTM | Visibilidad y datos básicos |
| **1** | Mes 1–3 | Stripe, panel conductor, referidos | Monetización |
| **2** | Mes 3–6 | Verificación identidad, push notifications, demand alerts, perfil enriquecido | Confianza y retención |
| **3** | Mes 6–9 | Widget partner, API pública, Dice+Bandsintown, panel partner | Partnerships y escala |
| **4** | Mes 9–12 | Matching automático, rides recurrentes, chat mejorado, conductores premium | Experiencia avanzada |
