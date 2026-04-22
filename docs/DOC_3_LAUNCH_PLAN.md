# ConcertRide — Plan de Lanzamiento al Mercado

> Este documento define cuándo lanzar, qué debe estar implementado antes, cómo ejecutar el lanzamiento y a quién contactar en qué orden.

---

## Criterios de lanzamiento — "La lista de salida"

**No lanzar hasta que TODOS los siguientes ítems estén marcados.**

### Producto (obligatorio)
- [ ] **Confirmación de ride completado** (campo `completed_at`, botón bilateral) — sin esto no hay KPI
- [ ] **Plausible Analytics instalado** — sin datos desde el Día 1 se pierde información irrecuperable
- [ ] **Sugerencia de precio por combustible** — reduce el abandono de pasajeros por precios absurdos
- [ ] **Stripe integrado** — sin cobro en plataforma, ningún partnership tiene sentido y no hay modelo de negocio
- [ ] **Panel de ganancias del conductor** — sin esto los conductores no tienen razón para volver
- [ ] **Sistema de referidos de conductores** — el canal de adquisición más barato y el único que escala sin ads
- [ ] **Verificación básica de conductor** (carnet de conducir) — requisito mínimo de seguridad antes de escalar
- [ ] **Notificaciones push activas** — al menos: solicitud aceptada, mensaje nuevo, ride inminente
- [ ] **UTM tracking en todos los enlaces compartibles**

### Operaciones (obligatorio)
- [ ] **Política de privacidad y términos de uso** actualizados con el flujo de pago (Stripe procesa datos financieros)
- [ ] **Proceso de resolución de disputas** definido (¿qué pasa si el conductor no aparece? ¿si el pasajero no paga?)
- [ ] **Cuenta de soporte activa** (email o WhatsApp Business) — los primeros usuarios necesitan respuesta en <2h
- [ ] **5+ rides pre-cargados** para los eventos del lanzamiento antes de abrir el registro público

### Marketing (obligatorio)
- [ ] **Landing page SEO-optimizada** para "viaje compartido concierto [ciudad]" y "ConcertRide"
- [ ] **Perfil de Instagram creado** con al menos 5 posts publicados (no lanzar desde cero)
- [ ] **Lista de espera pre-lanzamiento** con mínimo 200 emails captados

---

## Fecha objetivo de lanzamiento

**Semana del 2 de junio de 2026** — exactamente 3 semanas antes de Primavera Sound (12–15 junio, Barcelona).

### Por qué esta fecha
- Primavera Sound es el mayor festival de música en España por asistencia foránea. Miles de personas de Madrid, Valencia, Sevilla y del extranjero necesitan transporte a Barcelona esa semana.
- 3 semanas de antelación es el punto óptimo: suficiente tiempo para que los conductores publiquen rides y los pasajeros los encuentren, pero lo suficientemente cerca del evento para que la urgencia sea real.
- La conversación online sobre Primavera empieza en mayo — el SEO y los posts sociales tienen tiempo de indexar.

### Calendario de preparación

| Semana | Acciones |
|---|---|
| **18–25 mayo** | Implementar Bloque 0 completo + Stripe básico |
| **25 mayo–1 junio** | Landing page SEO, perfil Instagram, lista de espera, reclutar 10 conductores verificados para Primavera Sound |
| **2–8 junio** | Lanzamiento suave (soft launch) — solo conductores, sin campaña pública |
| **9 junio** | Lanzamiento público — abrir pasajeros, activar campañas |
| **12–15 junio** | Primavera Sound — equipo en modo monitoring, soporte activo |
| **16–30 junio** | Análisis post-evento, iteración antes de Mad Cool |
| **1–5 julio** | Mad Cool Festival (Madrid) — segunda oleada de lanzamiento |

---

## El lanzamiento en detalle — ¿Qué hacer exactamente?

### Semana -3: Soft launch (solo conductores)

**Objetivo:** Tener rides publicados antes de que lleguen los pasajeros. El marketplace vacío es el peor primer impacto.

**Acciones:**

1. **Reclutar 15–20 conductores para Primavera Sound manualmente:**
   - Publicar en 5 grupos de Facebook específicos: "Viaje a Primavera Sound 2026", "Primavera Sound carpooling", grupos de fans de los artistas del cartel (Charli XCX, Fontaines D.C., etc.)
   - Mensaje directo a personas que en años anteriores preguntaron en esos grupos por transporte
   - Ofrecer: badge de "Conductor Fundador", comisión 0% en los primeros 3 rides, soporte prioritario

2. **Reclutar en Reddit:**
   - Post en r/primaverasound, r/spain, r/barcelona: "Estamos lanzando ConcertRide para Primavera, buscamos conductores que ya vengan de [Madrid/Valencia/Sevilla] — primeros 20 registros con comisión 0%"
   - Tono: comunidad, no publicidad

3. **Activar lista de espera:**
   - Formulario simple en la landing: nombre, email, ciudad de origen, festival de interés
   - Meta: 200 emails antes del lanzamiento público

### Semana -1: Preparación del lanzamiento público

4. **Email a lista de espera:**
   - Asunto: "ConcertRide ya está en marcha — rides disponibles para Primavera Sound"
   - Contenido: los rides disponibles desde su ciudad, CTA directa a reservar

5. **Posts de Instagram (3 posts la semana del lanzamiento):**
   - Post 1: "¿Cómo vas a Primavera Sound?" — pregunta de comunidad, no publicidad
   - Post 2: Presentación del producto — screenshot de un ride real, precio, driver verificado
   - Post 3: "Quedan X plazas desde Madrid" — urgencia real

6. **Google Ads — encender la primera semana:**
   - Campaña 1: "viaje compartido primavera sound" + variantes de ciudad
   - Campaña 2: "como ir a primavera sound desde madrid/valencia/sevilla"
   - Budget: €300 para la semana del lanzamiento
   - Targeting: España, móvil principalmente, 20–35 años

### Día de lanzamiento público (9 junio)

7. **Email blast a lista de espera** con todos los rides disponibles por ciudad
8. **Story de Instagram en tiempo real:** "ConcertRide ya está vivo — aquí están los primeros rides"
9. **Post en Reddit** con update: "lanzamos hoy, rides disponibles, AMA"
10. **DM personalizado** a los primeros 50 inscritos de la lista de espera (manual, no automatizado)

### Durante Primavera Sound (12–15 junio)

11. **Monitorización activa** de rides y solicitudes — responder incidencias en <30 minutos
12. **Contenido en tiempo real:** Stories del equipo en el festival, entrevistas a usuarios
13. **Recoger testimonios** de conductores y pasajeros para usarlos en la segunda oleada (Mad Cool)

---

## Empresas a contactar — por orden de prioridad

### Grupo A — Contactar inmediatamente (antes del lanzamiento)

Estos partners pueden amplificar el lanzamiento si se les contacta con 6+ semanas de antelación.

#### 1. Primavera Sound / Primavera Pro
- **Contacto:** Equipo de partnerships y patrocinios
- **Email:** partnerships@primaverasound.com (público en su web)
- **Propuesta:** "ConcertRide como partner oficial de transporte para Primavera Sound 2026. Sin coste para el festival — ponemos el logo en la web, ellos mencionan ConcertRide en el email de confirmación de entradas."
- **Qué ofrecemos:** Página co-branded, badge "partner oficial", datos de volumen de rides post-evento
- **Qué pedimos:** 1 mención en el email de confirmación de entradas (llega a ~60.000 personas) + link en su web de "Cómo llegar"

#### 2. Wegow
- **Por qué primero:** Plataforma española, sede en Madrid, equipo comercial accesible, 2M+ usuarios/mes, buscan activamente diferenciarse de Ticketmaster
- **Contacto:** Buscar en LinkedIn "Wegow partnerships" o "Wegow business development"
- **Propuesta:** Widget de ConcertRide embebido en las páginas de conciertos de artistas con >500 asistentes en España. Revenue share del 8% sobre rides generados desde su plataforma.
- **Qué ofrecemos:** Widget listo para integrar (2 líneas de código), revenue share, datos de conversión
- **Qué pedimos:** Espacio en las páginas de eventos + mención en newsletter

#### 3. Songkick España
- **Por qué:** 10M+ usuarios globales, fuerte en España, discovery puro → la integración "descubre el concierto + reserva el ride" es el funnel más natural
- **Contacto:** partnerships@songkick.com
- **Propuesta:** Deeplink "Organiza tu transporte" bajo cada evento de España que enlaza a ConcertRide con el concierto pre-seleccionado
- **Qué ofrecemos:** Revenue share por cada ride generado desde Songkick, datos de conversión, badge "Songkick partner"
- **Qué pedimos:** Link/botón en la página de cada concierto en España

---

### Grupo B — Contactar en Mes 2–3 (post-validación con datos)

Estos partners requieren que llegues con datos reales de rides completados para que el pitch sea creíble.

#### 4. Mad Cool Festival
- **Cuándo contactar:** Semana del 16 de junio (después de Primavera Sound, con datos en mano)
- **Propuesta:** "En Primavera Sound gestionamos X rides desde Y ciudades. Para Mad Cool queremos ser el partner oficial de transporte."
- **Contacto:** info@madcoolfestival.es / LinkedIn

#### 5. FIB (Benicàssim)
- **Por qué:** Festival de referencia para asistentes de toda España, fuerte componente de viaje desde otras ciudades
- **Cuándo contactar:** Julio (con datos de Primavera + Mad Cool)
- **Contacto:** info@fiberfib.com

#### 6. Sónar (Barcelona)
- **Por qué:** Festival de electrónica de referencia en Europa, perfil de usuario tech-savvy compatible con ConcertRide
- **Cuándo contactar:** Agosto (con 2 meses de datos)
- **Contacto:** press@sonar.es / partnerships@sonar.es

#### 7. Resident Advisor
- **Por qué:** Referencia en electrónica, LATAM + España, lectores con alta propensión a viajar a eventos
- **Propuesta:** "ConcertRide widget o link en cada evento de España en RA"
- **Contacto:** advertising@residentadvisor.net

---

### Grupo C — Contactar en Mes 6+ (cuando el producto esté más maduro)

#### 8. Ticketmaster España
- **Por qué en Mes 6:** Requiere proceso legal largo y contacto con equipos en EEUU. El pitch necesita datos de escala (10k+ rides) para que sea relevante para ellos.
- **Propuesta:** "Add transportation to checkout" — botón en la confirmación de entradas
- **Cómo contactar:** LinkedIn (buscar "Ticketmaster Spain partnerships") + asistir a sus eventos de industria

#### 9. Live Nation España
- **Por qué:** Promotora detrás de los mayores tours en España. Un deal con Live Nation activa decenas de eventos simultáneamente.
- **Cuándo:** Cuando tengas 3 festivales con datos positivos como caso de estudio

#### 10. Blablacar (partnership, no competencia)
- **Por qué contactarles:** Propuesta: "Blablacar para distancias largas, ConcertRide para el último tramo hasta el festival." Pueden referir usuarios desde ciudades pequeñas donde ConcertRide no tiene oferta.
- **Cuándo:** Mes 9+ cuando tengas tracción suficiente para que les interese

---

## Publicidad — canales y mensajes

### Publicidad orgánica (€0)

**Instagram / TikTok:**
- Tono: comunidad musical, no startup tech
- Contenido: testimonios reales de conductores y pasajeros, behind-the-scenes de festivals
- Frecuencia: 3 posts/semana en temporada alta (mayo–septiembre), 1/semana en temporada baja
- Hashtags principales: #PrimaveraSound, #MadCool, #Sónar + ciudad de origen

**SEO — páginas objetivo a crear antes del lanzamiento:**
- `/viaje-primavera-sound-barcelona` — "Cómo ir a Primavera Sound en coche compartido"
- `/viaje-mad-cool-madrid` — idem
- `/viaje-compartido-concierto-[ciudad]` — una página por las 5 ciudades principales
- Blog: "Guía de transporte a los festivales de España 2026"

**Reddit:**
- Presencia activa en r/primaverasound, r/spain, r/madrid, r/barcelona, r/musica
- Regla: 80% contribución a la comunidad, 20% mención del producto

### Publicidad de pago

**Google Ads — presupuesto mensual: €300–500**

| Campaña | Keywords | CPC estimado | Conversión esperada |
|---|---|---|---|
| Primavera Sound | "viaje compartido primavera sound", "transporte primavera sound" | €0,40–0,70 | Alta (intent puro) |
| Mad Cool | "como ir mad cool madrid", "viaje mad cool" | €0,30–0,60 | Alta |
| Generic | "viaje compartido concierto [ciudad]" | €0,20–0,40 | Media |

**Meta Ads (Instagram) — presupuesto mensual: €200–300**
- Targeting: España, 20–34 años, intereses en música + festivales específicos del cartel
- Formato: Reels de 15s mostrando un ride real (no animaciones, no stock photos)
- Solo activar 2 semanas antes del festival objetivo, no de forma continua

**Spotify Ads — presupuesto: €150/mes**
- Targeting: usuarios que siguen artistas del cartel de Primavera Sound / Mad Cool
- Audio ad de 30s: "¿Vas al concierto de [artista]? Encuentra tu ride en ConcertRide"
- Solo en temporada alta

### Influencers y microinfluencers

**Perfil objetivo:** Creadores de contenido de música en España, 10k–100k seguidores, audiencia española, asisten regularmente a festivales.

**Lista inicial a contactar:**
- Cuentas de Instagram/TikTok especializadas en festivales españoles (buscar hashtag #primaverasound2026)
- Bloggers musicales que ya cubren Primavera Sound, Mad Cool, Sónar
- DJs residentes de clubs españoles (asisten a festivales como artistas y asistentes)

**Propuesta:** No pago en efectivo. Oferta: conductor verificado gratis + acceso anticipado + comisión 0% en sus primeros 5 rides, a cambio de 1 post/story honesto antes del festival.

---

## Métricas de éxito del lanzamiento

### Métricas del primer evento (Primavera Sound)

| Métrica | Mínimo aceptable | Objetivo |
|---|---|---|
| Conductores registrados | 15 | 30 |
| Rides creados | 20 | 50 |
| Asientos reservados | 40 | 150 |
| Rides completados | 15 | 40 |
| Ride completion rate | 60% | 80% |
| Valoración media post-ride | 4.0 | 4.5 |
| Usuarios que vuelven para Mad Cool | 10% | 25% |

### Señal de continuidad

Si después de Primavera Sound al menos **el 20% de los conductores** publican un ride para el siguiente evento sin ser contactados manualmente, el producto tiene tracción orgánica real y se puede acelerar la inversión en adquisición.

Si ese número está por debajo del 10%, hay que entender por qué antes de gastar en publicidad.

---

## Presupuesto estimado de lanzamiento

| Partida | Mes 1 | Mes 2 | Mes 3 | Total trimestre |
|---|---|---|---|---|
| Google Ads | €300 | €400 | €300 | €1.000 |
| Meta Ads (Instagram) | €200 | €300 | €200 | €700 |
| Spotify Ads | €0 | €150 | €150 | €300 |
| Plausible Analytics | €9 | €9 | €9 | €27 |
| Stripe fees (estimado) | €50 | €200 | €400 | €650 |
| Incentivos conductores fundadores | €200 | €100 | €0 | €300 |
| Microinfluencers (producto) | €0 | €0 | €0 | €0 |
| **Total** | **€759** | **€1.159** | **€1.059** | **€2.977** |

> Inversión mínima viable de lanzamiento: **~€3.000 en el primer trimestre.**

---

## Qué NO hacer en el lanzamiento

- **No lanzar sin rides disponibles.** Un pasajero que llega a la web y no ve rides para su ciudad se va para siempre. Garantiza la oferta antes de abrir la demanda.
- **No intentar cubrir todos los festivales el primer mes.** Primavera Sound primero, Mad Cool segundo. La densidad de oferta en un solo evento vale más que tener 2 rides en 10 festivales.
- **No gastar en ads sin tener el tracking funcionando.** Si Plausible no está instalado y los UTMs no están en todos los enlaces, cualquier euro gastado en publicidad es dinero tirado.
- **No prometer partnerships antes de tener datos.** Un festival que pide datos y recibe "estamos en lanzamiento" cierra la conversación. Llegar con datos de Primavera Sound (aunque sean 40 rides) es infinitamente más poderoso que cualquier deck.
- **No lanzar en agosto.** Agosto en España es temporada muerta de conciertos urbanos. Si el lanzamiento se retrasa, esperar a septiembre (vuelta a la temporada + Bilbao BBK, Tomavistas, etc.).
