/**
 * joinPhrase — une dos fragmentos de texto sin repetir la palabra que ya está
 * al final del primero.
 *
 * §AJ (2026-09-20). Varios generadores de `keywords` concatenaban un nombre y
 * una ciudad asumiendo que nunca coincidían:
 *   `${landing.originCity} ${landing.festival.city}`   → "Madrid Madrid"
 *   `${festival.shortName} ${festival.city}`           → "B-Side Madrid Madrid"
 * Ocurre cuando el origen de la ruta ES la ciudad del festival, o cuando el
 * shortName del festival ya termina con su ciudad. Medido sobre dist/: 154
 * ficheros con al menos una repetición ("Madrid Madrid" 86, "Granada Granada"
 * 34, "Sevilla Sevilla" 21, …).
 *
 * Alcance real del defecto: solo afecta a `<meta name="keywords">`, que Google
 * ignora desde 2009 — por eso es P3, no P1. Se arregla igualmente porque otros
 * buscadores y los extractores de LLM sí leen ese atributo, y porque el mismo
 * patrón de concatenación se copia con facilidad a copy visible (§AH.4 fue
 * exactamente eso: "Renfe Renfe" acabó en las meta descriptions).
 *
 * Deliberadamente NO se hace un reemplazo global de "X X" en el HTML final:
 * existen nombres propios legítimos con la palabra repetida — CentroCentro
 * Cibeles ("Centro Centro", 608 ocurrencias), Metrovalencia, Metrosur. La
 * deduplicación se hace en el punto de unión, donde se sabe qué son las dos
 * partes, nunca a ciegas sobre el resultado.
 */
export function joinPhrase(head: string, tail: string): string {
  const a = head.trim();
  const b = tail.trim();
  if (!a) return b;
  if (!b) return a;
  // Comparación insensible a mayúsculas y acentos para que "Málaga"/"malaga"
  // cuenten como la misma palabra.
  const norm = (s: string) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const na = norm(a);
  const nb = norm(b);
  // Caso 1: el primero ya TERMINA con el segundo → "B-Side Madrid" + "Madrid".
  if (na.endsWith(nb)) return a;
  // Caso 2: el segundo ya EMPIEZA por el primero → "Granada" + "Granada Música
  // y Danza". Se devuelve el segundo, que es el fragmento más informativo.
  // Este caso se escapó en la primera pasada del fix (solo cubría el sufijo) y
  // seguía produciendo "carpooling Granada Granada Música y Danza" en las
  // keywords de los festivales cuyo shortName empieza por su propia ciudad
  // (Granada, Bilbao, Burgos, Madrid, Murcia…).
  if (nb.startsWith(na)) return b;
  return `${a} ${b}`;
}
