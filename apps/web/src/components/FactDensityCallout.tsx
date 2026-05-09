interface Fact {
  // Short label, e.g. "Desde", "Comisión", "CO₂".
  label: string;
  // Headline value, e.g. "3 €/asiento", "0 %", "−75 % vs taxi".
  value: string;
  // Optional sub-context, kept short for quotability.
  detail?: string;
}

interface Props {
  facts: Fact[];
  // Visible heading; AI extractors prefer a labelled list.
  heading?: string;
  className?: string;
}

// A fact-density callout sits above any comparison table to give AI
// extractors a scannable, citable block. Each fact is encoded with
// `data-cite` so structured-data parsers can pull individual values
// without re-parsing prose. Visually it doubles as a confidence
// signal for human readers.
export function FactDensityCallout({ facts, heading = "Datos clave", className }: Props) {
  if (!facts.length) return null;
  return (
    <aside
      aria-label={heading}
      className={`border-2 border-cr-primary/40 bg-gradient-to-br from-cr-primary/5 via-cr-bg to-cr-bg p-4 ${className ?? ""}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cr-primary">
        ⚡ {heading}
      </p>
      <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {facts.map((f) => (
          <div key={f.label} data-cite={`${f.label}:${f.value}`} className="border-l-2 border-cr-primary/40 pl-3">
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-muted">
              {f.label}
            </dt>
            <dd className="mt-0.5 font-display text-xl uppercase leading-tight text-cr-text">
              {f.value}
            </dd>
            {f.detail && (
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-cr-text-dim">
                {f.detail}
              </p>
            )}
          </div>
        ))}
      </dl>
    </aside>
  );
}
