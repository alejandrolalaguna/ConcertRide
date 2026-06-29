# Plan de mejora ConcertRide — Junio 2026

> Estratega de producto/growth · basado en datos reales de producción (junio 2026)
> Fase: **muy temprana** — 45 usuarios reales, **0 transacciones** en toda la historia del producto.

---

## TL;DR (léelo aunque no leas el resto)

ConcertRide tiene **demanda en construcción y oferta cero**. El registro funciona (×2.4 en 3 semanas, 69% verifican email), pero el marketplace nunca ha tenido un solo viaje publicado ni una sola reserva. **No es un problema de tráfico ni de SEO: es un problema de arranque de oferta (cold-start del lado conductor).**

El objetivo de las próximas 4 semanas no es crecer usuarios. Es **fabricar a mano la primera docena de viajes reales** para que la demanda existente (interés en conciertos, favoritos, alertas) tenga algo que reservar. Todo lo demás es secundario hasta que exista oferta.

**La métrica única que importa este mes: número de viajes publicados con al menos 1 plaza ofertada. Hoy = 0. Meta a 4 semanas = ≥10.**

---

## 1. Diagnóstico — qué dicen los números

### Lo que va BIEN ✅

| Señal | Dato | Lectura |
|---|---|---|
| Adquisición | 3 → 18 → 45 usuarios (abr/may/jun) | Crecimiento real ×2.4 en 3 semanas. El top del embudo no está roto. |
| Verificación email | 31/45 = **69%** | Tasa sana para producto temprano. El email de bienvenida+verify funciona y la gente lee. |
| Catálogo | 878 conciertos, 181 recintos | **No falta oferta de eventos.** El "qué" sobra; falta el "cómo llego". |
| Infra lista | Resend con 14+ plantillas, `festival_demand` waitlist, alertas, chat, carné | La plomería existe. No hay que construir, hay que **activar y cablear**. |

La semana W26 cae a 2 registros, pero con solo 4 semanas de muestra y números de un dígito **no es una tendencia, es ruido**. No optimices contra eso todavía.

### Lo que está ROTO 🔴

1. **OFERTA = 0. Este es EL problema.** 0 viajes publicados, 0 reservas, en toda la vida del producto. Un marketplace de carpooling sin conductores no es un marketplace: es un catálogo de conciertos con un botón de "reservar" que no lleva a nada. Cada usuario que llega buscando viaje encuentra el vacío → no vuelve.

2. **Embudo de activación colapsa tras el registro.**
   ```
   45 registrados
   ├── 31 verifican email        (69%)
   ├──  5 marcan interés          (11%)
   ├──  4 marcan favorito         ( 9%)
   ├──  0 publican viaje          ( 0%)  ◄── cold-start de oferta
   └──  0 piden reserva           ( 0%)  ◄── no hay nada que reservar
   ```
   De 45 personas, **40 (89%) no han hecho NADA** más allá de registrarse (y quizá verificar). No es que la gente rechace el producto: es que **no hay un siguiente paso obvio que tenga payoff**.

3. **`home_city` casi vacío: 4/45 = 9%.** Sin ciudad de origen, el matching origen→festival —el corazón del producto— no puede funcionar. No puedes mostrar "viajes desde tu ciudad" ni notificar "alguien va a tu festival desde cerca" si no sabes de dónde sale el 91% de los usuarios.

4. **2 carnés pendientes de revisar = 2 conductores potenciales esperando, parados.** Estas son las personas más valiosas del producto ahora mismo (intención de ser conductor demostrada) y están en cola. Cada día que esperan es riesgo de fuga.

5. **Cero retención / cero recurrencia.** No hay señal de que nadie vuelva. Sin un primer "momento aha" (reservar o publicar un viaje real), no hay nada a lo que volver.

### Diagnóstico en una frase

> Tenemos un funnel de descubrimiento que mete gente, un catálogo de eventos enorme, e infraestructura de notificación completa — pero **el marketplace está vacío del lado de la oferta**, y sin un primer viaje real, ni la activación ni la retención pueden empezar.

---

## 2. El problema del huevo y la gallina (cold-start de oferta)

**Regla de oro de los marketplaces:** subvenciona el lado escaso. Aquí el lado escaso, con diferencia, es **la oferta (conductores)**. Hay 13 señales de interés, 7 favoritos y 3 alertas — eso es demanda latente, suficiente para justificar un puñado de viajes. **Lo que falta es alguien que publique.**

No resuelvas esto con producto ni con escala. Resuélvelo **a mano, concierto a concierto**, hasta que arranque el efecto de red. Esto se llama "Do Things That Don't Scale" y es lo correcto para 45 usuarios.

### Táctica A — Activar a los 2 conductores que YA están esperando (HOY)

Hay **2 carnés pendientes de revisar**. Son leads de oferta calientes.
1. **Revisa los 2 carnés hoy mismo** (panel admin). El email `sendLicenseReviewResultEmail` ya está construido: al aprobar, el conductor recibe el correo "Carnet verificado ✅ → Publica tu primer viaje". Eso es exactamente el CTA que necesitamos.
2. Para el carné rechazado y los 2 pendientes, **escribe un email personal 1:1** (no plantilla) ofreciendo ayuda para publicar su primer viaje: "¿A qué concierto vas? Te lo dejo publicado en 2 min y solo confirmas." Pago en mano, 0% comisión — recuérdaselo.
3. **SLA de revisión de carné: <24h** mientras estés en esta fase. Cada carné pendiente es un conductor potencial congelado.

### Táctica B — Seed manual de oferta concentrada (esta semana)

No siembres 50 viajes dispersos. **Concentra la oferta donde ya hay señales de demanda.**
1. Cruza las **13 señales de interés + 7 favoritos + 3 alertas** → identifica los 2-3 conciertos/festivales con más concentración.
2. Para esos 2-3 eventos, **consigue 1-2 conductores reales** (los recién verificados, el equipo fundador con carné, amigos/embajadores que ya iban a ir en coche). Que publiquen un viaje real, con plazas reales, a precio real (3-22 €).
3. **Mejor 5 viajes reales en 2 festivales que 30 viajes falsos repartidos.** La liquidez se siente cuando una ruta concreta tiene oferta, no cuando el total es alto. Nunca publiques viajes fantasma que no existen: rompe la confianza el día que alguien intenta reservar.

> Cumplimiento de marca: NO se permiten cuentas/viajes falsos presentados como de terceros. "Seed" = viajes reales conducidos por personas reales del equipo/embajadores que de verdad asisten al evento.

### Táctica C — Incentivos sin comisión (la comisión ya es 0%)

El diferenciador (0% comisión, pago en mano) ya es el incentivo económico. Refuérzalo y añade incentivos no monetarios:
- **"Primer conductor de [Festival]"**: badge/destacado en la página del festival para quien publica el primer viaje de una ruta. Estatus > dinero a esta escala.
- **Subvención puntual de gasolina** para los primeros ~10 viajes (un Bizum de 10-15 € del equipo al conductor tras completar viaje real con pasajero). Es el coste de adquisición de tu primer inventario; es barato.
- **Visibilidad SEO**: los viajes publicados aparecen en las páginas programáticas de ruta/festival que ya rankean → el conductor obtiene alcance gratis. Díselo: "tu viaje sale en Google".

### Táctica D — Bajar fricción para publicar a casi cero

- **Revisa si publicar requiere carné verificado de forma dura.** En `PublishRidePage.tsx` hoy solo se muestra un banner si `!user.license_verified` (no parece bloqueo duro). Decide explícitamente: permite **redactar/guardar borrador sin carné**, pero exige verificación para **activar** el viaje. Que nadie choque con un muro antes de ver el valor.
- **"Publica el primer viaje" como CTA de primera clase** en concierto/festival sin oferta: hoy el usuario que no encuentra viaje ve vacío. Conviértelo: "Aún no hay viajes a [Festival]. ¿Vas en coche? Publica el tuyo y comparte gastos →".
- **Pre-rellena el formulario de publicación** desde el contexto: si vienen de `/festivales/:slug` o `/concerts/:id`, el concierto ya debería estar seleccionado (el campo `?concert=` ya existe en `PublishRidePage`). Si tienen `home_city`, pre-rellena `origin_city`.

### Métrica de éxito de esta sección
- **# viajes publicados reales** (no seed-fantasma): 0 → ≥10 en 4 semanas.
- **# rutas (origen→evento) con ≥1 plaza disponible**: 0 → ≥5.

---

## 3. Activación — de registro a primera acción

El salto que falla es **registro → primera acción con valor**. Tenemos toda la infra de email (Resend, 14+ plantillas) pero las campañas de activación dependen de que `RESEND_API_KEY` esté puesta en prod y de cablear nudges en los momentos correctos.

> **Verificación previa (P0, 5 min):** confirma que `RESEND_API_KEY` está configurada como secret en el Worker de producción. Si no lo está, `sendEmail()` es un no-op silencioso y **ningún email transaccional se está enviando** — lo que explicaría buena parte de la activación plana. Esto se comprueba antes que cualquier otra cosa de esta sección.

### 3.1 Capturar `home_city` (el desbloqueo más barato de todos)

Solo 4/45 la rellenan. Sin ella, no hay matching. Tácticas en orden de impacto:
1. **Onboarding post-verificación de 1 paso:** tras verificar email, lleva a una pantalla única "¿Desde dónde sueles salir a conciertos?" con un selector de ciudad (ya existe `SPANISH_CITIES`). Una sola pregunta, skippable, pero por defecto presente.
2. **Banner persistente "Completa tu ciudad"** en home/feed para quien no la tenga, con la promesa concreta: "Dinos tu ciudad y te avisamos cuando alguien organice viaje a tus conciertos desde cerca."
3. **Inferencia suave**: si el usuario marca interés en conciertos de una misma ciudad, sugiere esa como `home_city` ("¿Sales desde Valencia?"). Confirmación de 1 clic.

Meta: `home_city` de 9% → **≥50%** de usuarios verificados.

### 3.2 Secuencia de activación por email (cablear sobre Resend)

Tenemos las plantillas pero falta la **secuencia de nudges con disparadores temporales**. Propuesta (todos cancelables, respetando preferencias):

| Día | Disparador | Email | Objetivo |
|---|---|---|---|
| 0 | Registro | Welcome + verify (✅ ya existe) | Verificar |
| 1 | Verificado, sin `home_city` | "¿Desde dónde sales a conciertos?" (NUEVO, ligero) | Capturar `home_city` |
| 2 | Sin interés marcado | "Estos conciertos están cerca de ti" (usa catálogo + ciudad) | Primera señal de interés |
| 4 | Interés marcado, sin viaje cerca | "Aún no hay viaje a [X]. ¿Vas en coche? Publica el tuyo" | Convertir demanda en oferta |
| 7 | Inactivo total | Re-engagement: 1 concierto top + 1 CTA claro | Reactivar |

> Mantener **frecuencia baja** (máx ~2 emails/semana por usuario) y agrupar. A 45 usuarios cada email lo lees tú casi 1:1 — escríbelos como si fueran personales.

### 3.3 Nudges in-app contextuales

- **Estado vacío con acción** en cada concierto/festival sin viajes (ver Táctica D).
- **Recordatorio de carné** para quien marcó interés repetidamente: "Conviértete en conductor verificado y organiza el viaje."
- **Conectar `festival_demand` ↔ publicación**: cuando alguien se apunta a la waitlist de un festival, muéstrale ahí mismo "o sé tú quien conduce".

### Métrica de éxito
- Activación (registro → ≥1 acción de valor: interés/favorito/publicar/reservar): hoy ~11% → meta **≥35%**.

---

## 4. Aprovechar el SEO/tráfico programático

Hay miles de páginas (festivales, rutas, ciudades, artistas, recintos) que rankean. **El tráfico de descubrimiento existe; el problema es que no convierte porque al llegar no hay oferta ni un siguiente paso claro.** No toques el SEO técnico (está muy maduro); cablea **conversión**.

### 4.1 Capturar demanda en CADA página de festival/ruta (`festival_demand`)

La tabla `festival_demand` ya modela exactamente esto (`festival_slug`, `origin_city`, `email`, `notified_at`). Asegúrate de que:
1. **Toda página de festival/ruta sin oferta muestra un capturador de demanda visible:** "Avísame cuando haya viaje a [Festival] desde [mi ciudad]". Pide email + ciudad. Esto convierte una visita sin login en una señal de demanda accionable — **y en un futuro destinatario del `sendDemandMatchEmail`**.
2. **El email se pre-rellena** si hay sesión; si no, captura email anónimo (lead).
3. **`origin_city` se captura aquí también** — es tu segunda fuente de `home_city` además del onboarding.

### 4.2 Cerrar el bucle demanda → oferta → notificación

Este es el bucle que hace que el SEO pague:
1. Usuario llega por SEO a `/rutas/madrid-mad-cool` → no hay viaje → se apunta a `festival_demand` (email + Madrid).
2. Cuando un conductor publica un viaje Madrid→Mad Cool → **dispara `sendDemandMatchEmail`** a todos los de esa waitlist (`festival_slug` + `origin_city` match) → marca `notified_at`.
3. El conductor ve "5 personas esperan viaje a Mad Cool desde Madrid" **antes** de publicar → prueba social que le empuja a publicar (cierra también la sección 2).

> **Verifica que este disparo está cableado.** Si publicar un viaje no dispara `sendDemandMatchEmail` contra `festival_demand`, ese es el cable más valioso que puedes conectar este mes: convierte SEO en notificación en reserva.

### 4.3 Mostrar demanda agregada como prueba social (sin PII)

En páginas de festival/ruta: "**N personas buscan viaje a [Festival]**" (contador de `festival_demand`). Esto:
- Da urgencia al visitante ("no estoy solo, esto se mueve").
- Da una razón al conductor para publicar (hay clientes esperando).
- No expone datos personales (solo el agregado).

### Métrica de éxito
- Conversión visita-SEO → señal de demanda capturada (`festival_demand` o registro): instrumenta y mide. Meta inicial: capturar el origen de cada visitante que muestra intención.
- # entradas en `festival_demand`: instrumentar y crecer.

---

## 5. Retención / recurrencia

Los festivales son estacionales y de baja frecuencia (vas a 1-3 al año). La retención **no** vendrá de "volver mañana"; vendrá de **estar presente cuando llega el siguiente evento relevante**. El producto debe convertirse en el canal por defecto de "¿cómo llego a mi próximo concierto?".

### Palancas (priorizadas para fase temprana)

1. **Alertas por artista/ciudad/festival como motor de retorno.** Ya hay alertas (3 activas) y `sendCountdownReminderEmail` / `sendDemandMatchEmail`. El gancho: el usuario sigue a su artista/festival → cuando hay concierto o viaje nuevo, recibe email → vuelve. **Empuja agresivamente a seguir artistas/festivales durante el onboarding** ("Sigue a tus artistas y te avisamos de viajes").
2. **El bucle de demanda match (§4.2) ES retención.** Apuntarse a `festival_demand` y recibir "ya hay viaje a tu festival" trae de vuelta al usuario en el momento exacto de máxima intención.
3. **Post-viaje → reseña → reputación → siguiente viaje.** `sendReviewPromptEmail` ya existe. Cuando haya viajes reales, cierra el bucle: viaje completado → pide reseña → la reputación del conductor sube → más reservas → conductor publica más. Esto es el verdadero motor de recurrencia, pero **solo arranca tras el primer viaje real** (de ahí la prioridad absoluta de la sección 2).
4. **Recap estacional / "tu próximo festival":** a futuro, email periódico ligero con los festivales que se acercan en la(s) ciudad(es) del usuario. No antes de tener oferta.

### Realismo de fase
No inviertas en retención sofisticada (rachas, gamificación, push masivo) hasta tener oferta y primeras transacciones. **Hoy la mejor inversión en retención es resolver la sección 2.** Un usuario que reserva un viaje real y le va bien vuelve solo; uno que llega y ve vacío, no.

### Métrica de éxito
- % usuarios que siguen ≥1 artista/festival (proxy de retorno futuro).
- Retorno a 30 días una vez exista oferta (instrumentar; sin datos aún para fijar meta).

---

## 6. Métricas a vigilar y matriz de prioridades

### Estrella polar y métricas de vigilancia

| Nivel | Métrica | Hoy | Meta 4 sem |
|---|---|---|---|
| ⭐ **Estrella polar** | **# viajes publicados reales** | 0 | ≥10 |
| Liquidez | # rutas origen→evento con plaza disponible | 0 | ≥5 |
| Liquidez | # reservas solicitadas | 0 | ≥3 |
| Activación | % registro → primera acción de valor | ~11% | ≥35% |
| Datos | % usuarios con `home_city` | 9% | ≥50% |
| Oferta | Carnés pendientes / SLA revisión | 2 / sin SLA | 0 / <24h |
| Conversión SEO | entradas en `festival_demand` | (medir) | crecer |
| Salud top funnel | registros/semana, % verificación | 45 / 69% | mantener |

> Regla anti-vanidad: **no celebres más registros mientras la oferta sea 0.** Más gente entrando a un marketplace vacío solo aumenta la decepción agregada. La métrica que manda es oferta/liquidez.

### Matriz de prioridades (impacto × esfuerzo)

| Prio | Acción | Impacto | Esfuerzo |
|---|---|---|---|
| **P0** | Verificar `RESEND_API_KEY` en prod (¿se envían emails?) | Alto | Bajo |
| **P0** | Revisar los 2 carnés pendientes + email 1:1 a esos conductores | Alto | Bajo |
| **P0** | Seed manual de 5-10 viajes reales en 2-3 eventos con demanda | Alto | Medio |
| **P0** | Cablear `festival_demand` → `sendDemandMatchEmail` al publicar | Alto | Medio |
| **P1** | Captura de `home_city` (onboarding 1-paso + banner) | Alto | Bajo |
| **P1** | Estado-vacío con CTA "Publica el primer viaje" en festival/ruta sin oferta | Alto | Bajo |
| **P1** | Capturador de demanda visible en páginas de festival/ruta SEO | Alto | Medio |
| **P1** | SLA <24h revisión de carné + permitir borrador sin verificación | Medio | Bajo |
| **P1** | Secuencia de activación por email (días 1/2/4/7) | Medio | Medio |
| **P2** | Prueba social "N buscan viaje a X" (agregado `festival_demand`) | Medio | Bajo |
| **P2** | Empuje a seguir artistas/festivales en onboarding (retención futura) | Medio | Bajo |
| **P2** | Bucle reseña post-viaje (activar cuando haya viajes reales) | Medio | Bajo |
| **P2** | Recap estacional / dashboard de oferta por ruta | Bajo (ahora) | Medio |

---

## 7. Quick wins ejecutables esta semana

Orden recomendado. Todos son de impacto alto y esfuerzo bajo-medio.

1. **[30 min] Verificar que los emails salen.** Comprueba `RESEND_API_KEY` como secret del Worker en prod. Si falta, ponla. Sin esto, media activación de este plan no existe. (`apps/api/src/lib/email.ts` no-opea sin la clave.)
2. **[1 h] Vaciar la cola de carnés.** Revisa y aprueba/rechaza los 2 pendientes. Al aprobar, el correo "Publica tu primer viaje" se dispara solo (`sendLicenseReviewResultEmail`).
3. **[1 h] 3 emails 1:1 personales** a los conductores con carné (aprobado/pendiente/rechazado): "Te ayudo a publicar tu primer viaje, ¿a qué concierto vas?". Conseguir 1-2 publicaciones reales esta semana.
4. **[2-3 h] Estado-vacío accionable** en páginas de concierto/festival sin viajes: "Aún no hay viajes a [X]. ¿Vas en coche? Publica el tuyo →" (pre-rellena `?concert=` que ya soporta `PublishRidePage`).
5. **[2-3 h] Onboarding de 1 pregunta** post-verificación capturando `home_city` (selector con `SPANISH_CITIES`). El desbloqueo de datos más barato.
6. **[medio día] Cablear el bucle demanda→oferta:** al publicar un viaje, disparar `sendDemandMatchEmail` a las coincidencias de `festival_demand` y marcar `notified_at`. Verifica si ya existe; si no, conéctalo.
7. **[1 h] Identificar los 2-3 eventos con más demanda** cruzando interés (13) + favoritos (7) + alertas (3) y concentrar ahí la siembra de oferta y los emails personales.

---

## Riesgos y cosas que NO hacer

- **NO** subas el gasto en adquisición/SEO nuevo hasta que la oferta deje de ser 0. Meter más gente a un marketplace vacío quema confianza.
- **NO** crees viajes fantasma presentados como de terceros. Seed = viajes reales de personas reales que asisten. Un primer intento de reserva fallido contra un viaje falso es una herida difícil de curar.
- **NO** construyas push masivo, gamificación ni features de retención pesados ahora. Es prematuro a 45 usuarios y 0 transacciones.
- **Cuidado con interpretar W26=2 como caída.** Es ruido a esta escala; no reorientes la estrategia por una semana de un dígito.
- Respeta restricciones de marca y ToS de Ticketmaster en cualquier copy/email nuevo (sin "BlaBlaCar" → "plataformas de carpooling generalistas"; contacto único `help@concertride.me`; atribución TM intacta).

---

## Resumen ejecutivo en 3 frases

1. El producto adquiere y verifica usuarios bien, pero **el marketplace está vacío del lado de la oferta (0 viajes, 0 reservas)** — ese es el único problema que importa este mes.
2. La salida es **bootstrapping manual de oferta**: activar los conductores que ya esperan, sembrar 5-10 viajes reales en los 2-3 eventos con más demanda, y cerrar el bucle `festival_demand → sendDemandMatchEmail` para que el tráfico SEO existente se convierta en reservas.
3. En paralelo, los quick wins baratos —verificar que los emails salen, capturar `home_city`, y estados-vacío accionables— desbloquean la activación; **todo lo demás (retención avanzada, más SEO, push) espera a que exista la primera docena de viajes reales.**

---

*Documento basado exclusivamente en las estadísticas de producción aportadas (junio 2026) y en la infraestructura verificada en el código (`apps/api/src/lib/email.ts`, `festival_demand`, `home_city`, flujo de carné y publicación). No contiene datos inventados.*
