# ConcertRide — Estrategia GTM

> Estado del producto a fecha de análisis: MVP pre-revenue. Sin pasarela de pago, sin analítica, sin sistema de referidos. Los rides se pagan en efectivo. Datos de seed únicamente. Toda la estrategia está secuenciada para ajustarse a esta realidad.

---

## Modelos de ingresos

### Modelo principal (lanzamiento): Comisión sobre rides — diferida

El modelo cash-only actual es válido para la fase de validación. **No añadir Stripe en Fase 1.** Primero se recopilan datos de volumen de rides y se demuestra demanda real; la comisión en plataforma se introduce en Fase 2.

- Comisión objetivo: **12–15%** sobre el precio del trayecto
- Ingreso por ride: **€1,80–3,75** (tarifa media €15–25)
- Paga: el pasajero en el momento de reserva (una vez integrado el pago)

### Modelo secundario (Mes 6+): Licencia B2B a festivales y salas

Venta de visibilidad e integración logística a organizadores de eventos. Tarifa fija por evento (€500–2.000) independiente del volumen de rides. Menor riesgo que la comisión en negociaciones tempranas porque no depende de la conversión.

### Modelo terciario (Mes 12+): Rides destacados / posicionamiento patrocinado

Los promotores pagan para que su concierto aparezca primero en el feed de matching y en campañas de email/push. Sin cambios de ingeniería — solo un flag en el modelo de datos y un acuerdo comercial.

### Modelos descartados en esta fase
- **Licencia de datos:** requiere infraestructura de cumplimiento GDPR que no existe
- **Seguros:** overhead regulatorio desproporcionado para el tamaño actual
- **Suscripciones premium:** base de usuarios insuficiente

---

## Fase 1 — Validación (Meses 0–3)

**Objetivo:** 500 rides completados (no reservados, completados).

### Audiencia objetivo: conductores primero

Los conductores son la restricción de oferta. Un pasajero sin ride disponible se va para siempre; un conductor sin pasajeros simplemente no sale. **Hay que invertir el playbook habitual de marketplaces: reclutar conductores antes que pasajeros.**

### Canales de adquisición de conductores (por coste/esfuerzo)

| Prioridad | Canal | Coste | Acción |
|---|---|---|---|
| 1 | Grupos de Facebook ("Viaje a Primavera Sound", "Conciertos Madrid") | €0 | Publicar como fundador, no como anuncio |
| 2 | Reddit España (r/spain, r/madrid, r/barcelona) | €0 | Anunciar como herramienta de comunidad |
| 3 | Secciones de comentarios de Songkick/Bandsintown | €0 | Outreach manual a personas que ya hablan de logística |
| 4 | Google Ads ("viaje compartido concierto [ciudad]") | €200/mes | CPC estimado €0,30–0,80, keywords sin competencia |

### Adquisición de pasajeros: dejar que siga a los conductores

Una vez que hay 3–5 rides disponibles para un evento, lanzar un post de Instagram para ese evento + ciudad. El timing contextual (1 semana antes del concierto) es la palanca clave.

### Primeros 1.000 usuarios desde

Dos festivales:
- **Primavera Sound** (Barcelona, junio) — alta densidad, asistentes de otras ciudades que necesitan transporte, comunidad online activa
- **Mad Cool** (Madrid, julio) — mismo perfil

### Sin partnerships en Fase 1

Las conversaciones con partners tardan 3–6 meses. Usar ese tiempo para construir el volumen de rides que hace creíble el pitch de partnership.

### Métricas a trackear (instalar analítica antes de nada)

**Herramienta recomendada:** Plausible Analytics (€9/mes, compatible GDPR, sin banner de cookies).

| Métrica | Definición |
|---|---|
| Ride creation rate | Rides creados / usuarios registrados conductores |
| Seat request rate | Solicitudes de asiento / rides disponibles |
| Ride completion rate | Rides completados / rides creados |
| CAC por canal | Coste por usuario activado, desglosado por fuente (UTM en todos los enlaces) |
| D7 / D30 driver retention | ¿Publica el conductor un segundo ride en 7 / 30 días? |

---

## Fase 2 — Escala inicial (Meses 3–12)

**Objetivo de ingresos:** €5.000–15.000/mes en el Mes 12 (2.500–4.000 rides/mes a 12% de comisión sobre €15 de tarifa media).

**Prerrequisito:** Integrar Stripe antes del Mes 3. Sin pago en plataforma no hay comisión cobrable y los partnerships B2B no tienen un mecanismo limpio de revenue share.

### Targets de partnership (por prioridad)

| Prioridad | Partner | Por qué | Propuesta |
|---|---|---|---|
| 1 | **Primavera Sound / Sónar** | Barcelona, tech-friendly, 50k+ asistentes de otras ciudades | Landing co-branded "ConcertRide oficial" + email blast a compradores de entradas |
| 2 | **Songkick España** | Ya indexado en el pipeline de ingestion (stub Tier 3), el flujo discovery→ride es el más natural | Embed o deeplink bajo cada evento de España |
| 3 | **Mad Cool / FIB** | Festivales clave Madrid/Valencia, alta asistencia foránea | Mismo modelo que #1 — badge de "partner oficial de transporte" |
| 4 | **Ticketmaster ES** | Ya es la fuente de datos — pitch "añade transporte al checkout" | Revenue share en rides reservados desde sus emails de confirmación |
| 5 | **Wegow** | Plataforma española de venta de entradas, con sede en Madrid, 2M+ usuarios mensuales, más ágil que Ticketmaster | Widget embed en páginas de eventos |

> **Por qué Wegow antes que Ticketmaster como quick win:** Un partnership con Ticketmaster requiere conversaciones a nivel corporativo en EEUU y revisión legal. Wegow es madrileña, responde rápido y busca activamente diferenciarse de Ticketmaster. Menor esfuerzo, más rápido.

### Canales orgánicos secundarios

- **SEO:** Apuntar a "viaje compartido concierto [artista]" y "cómo ir a [festival] desde [ciudad]" — queries de cola larga sin competencia con intención de compra clara. Ningún competidor de ConcertRide rankea en ellas.
- **Referidos de conductores:** "Invita a un amigo a conducir, gana €5 cuando complete su primer ride." Crecimiento de oferta barato.
- **UGC en Instagram/TikTok:** Contactar con 5–10 microinfluencers (10k–50k seguidores) del mundo musical español. No para anuncios — ofrecerles estado de conductor verificado a cambio de un post antes de un festival importante.

---

## Fase 3 — Marketplace (Mes 12+)

**Habilitar:** Un portal de autoservicio para partners donde salas y promotores puedan:
- Registrar su evento (o se auto-importa desde la ingestion de Ticketmaster)
- Configurar una página de rides co-branded
- Ver dashboard de volumen de rides y revenue share

### Expansión geográfica

**No expandir hasta tener 10.000+ rides/mes en España.** La expansión prematura divide la densidad de oferta y destruye el efecto de red en ambos mercados.

| Mercado | Cuándo | Por qué |
|---|---|---|
| **Portugal** | Primera expansión | Mismo idioma, mercado adyacente, menor CAC |
| **Alemania** | Segunda expansión | Mayor cultura de festivales en la UE (Lollapalooza Berlin, Melt, c/o pop) |
| **México / Buenos Aires** | Mes 18+ | Ventaja del español, pero pagos locales (OXXO, Mercado Pago) añaden complejidad |

---

## Equipo de ventas y operaciones

### Meses 0–6 (founder-led)
- 1 fundador gestiona todo el outreach de BD personalmente
- CRM: Notion o HubSpot free tier — registrar cada contacto de festival/sala
- Analítica: Plausible (web) + dashboard propio con eventos de la API

### Meses 6–12
- Contratar 1 BD contractor a tiempo parcial (perfil con background en industria musical española) — €1.500–2.500/mes
- Responsable del pipeline de festivales y salas
- El fundador gestiona los partnerships tecnológicos (Songkick, Ticketmaster, Wegow)

### Mes 12+
- 1 account manager a tiempo completo para onboarding de partners
- 1 persona de operaciones/soporte (disputas de rides, verificación de conductores)
- Comenzar a construir documentación de la API para partners

---

## Posicionamiento competitivo

| Vs. | Mensaje |
|---|---|
| **Blablacar** | Blablacar es para el trayecto de trabajo del lunes. ConcertRide es para la noche que realmente vale la pena. |
| **Uber** | Uber te deja en la puerta. ConcertRide te lleva con gente que ya tiene la setlist memorizada. |
| **Songkick / Bandsintown** | Ellos te dicen que el concierto existe. Nosotros te llevamos allí. |

---

## Mitigación de riesgos

### Riesgo 1: Desequilibrio oferta-demanda destruye la retención temprana
El modo de fallo más probable. Un pasajero reserva un ride, el conductor cancela, el pasajero no vuelve nunca.
→ **Mitigación:** En Fase 1, garantizar manualmente la oferta para los eventos objetivo. Reclutar 10+ conductores comprometidos para Primavera Sound antes de abrir las inscripciones de pasajeros.

### Riesgo 2: El modelo cash-only oculta la economía real
No hay datos sobre si los conductores cobran realmente o si el efectivo cambia de manos.
→ **Mitigación:** Añadir un botón de confirmación de "ride completado" a la app inmediatamente. Es la señal mínima viable de monetización incluso antes de Stripe.

### Riesgo 3: El churn event-driven (40–60% mensual) hace que el CAC sea brutal
Los usuarios que van a 1 concierto al año tienen valor de repetición cercano a cero.
→ **Mitigación:** Priorizar la adquisición de conductores sobre la de pasajeros. Los conductores van a múltiples eventos (se auto-seleccionan por alta frecuencia de conciertos). 1 conductor adquirido = 8–12 rides. 1 pasajero adquirido = 2–4 rides. La economía unitaria es 3–4x mejor por el lado de la oferta.

### Riesgo 4: Dependencia de Ticketmaster
La ingestion es 100% Ticketmaster. Si cambian los términos de la API o añaden throttling, el catálogo de conciertos se rompe.
→ **Mitigación:** Desbloquear los adaptadores de Dice y Bandsintown antes del Mes 6. Ya están en stubs. Es una tarea de ingeniería de 2–3 días.

### Riesgo 5: Los plazos de partnership superan el runway
Los deals con festivales y salas tardan más de lo que esperan los fundadores.
→ **Mitigación:** No incluir ingresos B2B en las proyecciones de los Meses 1–6. Tratar todos los B2B como upside; construir el negocio sobre ingresos de comisión de volumen orgánico de rides.

---

## Proyecciones financieras

| Métrica | Objetivo |
|---|---|
| Tarifa media por ride | €15–25 |
| Tasa de comisión (take rate) | 12–15% |
| Ingreso por ride | €1,80–3,75 |
| Rides/mes en Mes 12 | 10.000 |
| Ingreso mensual en Mes 12 | €18k–37,5k |
| CAC conductor | €2–5 |
| CAC pasajero | €1–2 |
| Rides por conductor en su vida útil | 8–12 |
| Rides por pasajero en su vida útil | 2–4 |
| Churn mensual | 40–60% (event-driven) |

### Supuestos más frágiles (validar primero)

1. **¿Están los conductores dispuestos a fijar un precio y aceptar desconocidos para un trayecto corto de concierto?** Esta es la transferencia de confianza social de Blablacar — no está garantizada en la cultura de conciertos española. Validar entrevistando a 20 conductores antes de construir cualquier otra cosa.
2. **¿Es €15–25 el rango de precios correcto?** La API de precio del combustible existe pero nadie la usa para sugerir precios a los conductores. Añadir una funcionalidad de sugerencia de precio ("basándonos en los costes de combustible, precio sugerido: €18") y medir si los conductores la aceptan — esto también justifica la comisión.
3. **¿Amortiza el CAC activado por concierto?** El modelo solo funciona si los usuarios adquiridos vuelven para múltiples eventos. Trackear esto desde el Día 1 — es el número único que determina si esto es un negocio viable o una promoción de temporada.
