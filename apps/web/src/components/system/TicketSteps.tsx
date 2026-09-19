import type { ReactNode } from "react";

export interface TicketStep {
  n: string;
  title: ReactNode;
  body: ReactNode;
  /** id del elemento (ancla para HowTo.url). */
  id?: string;
  /** Campos del ticket que se rellenan al llegar a este paso. */
  fills?: TicketFieldKey[];
}

export type TicketFieldKey = "from" | "to" | "when" | "price" | "seat";

export interface TicketFields {
  from: string;
  to: string;
  when: string;
  price: string;
  seat: string;
}

interface Props {
  steps: TicketStep[];
  fields: TicketFields;
  /** Rótulo del ticket (p. ej. "Boarding pass · pasajero"). */
  ticketLabel?: string;
  /** Nivel del título de cada paso. */
  as?: "h3" | "h4";
  /** Acento de los números (lima por defecto; naranja para el bloque de conductor). */
  accent?: "primary" | "secondary";
  className?: string;
}

const LABELS: Record<TicketFieldKey, string> = {
  from: "Desde",
  to: "Hasta",
  when: "Cuándo",
  price: "Precio",
  seat: "Plaza",
};

/**
 * El ticket se rellena solo.
 *
 * Split de dos columnas: pasos en registro a la izquierda; a la derecha un
 * ticket pegajoso cuyos campos se van rellenando a medida que el scroll
 * enciende cada paso (fx/scan.ts, `data-scan="ticket"`). Sin JS o con
 * reduced-motion el ticket aparece completo: el HTML ya es el estado final.
 * Todo el texto de los pasos está en el DOM desde el servidor.
 */
export function TicketSteps({ steps, fields, ticketLabel = "ConcertRide · Boarding pass", as: Tag = "h3", accent = "primary", className = "" }: Props) {
  const accentCls = accent === "secondary" ? "text-cr-secondary" : "text-cr-primary";
  return (
    <div data-scan="ticket" className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start ${className}`}>
      <ol className="lg:col-span-7 cr-register">
        {steps.map((s, i) => (
          <li
            key={s.n}
            id={s.id}
            data-step={i}
            data-step-fills={(s.fills ?? []).join(" ")}
            className="cr-register__row !grid-cols-[3rem_1fr] lg:!grid-cols-[4rem_1fr] !items-start !py-6 pl-3"
          >
            <span className={`cr-label ${accentCls} pt-1.5`}>{s.n}</span>
            <div className="min-w-0 flex flex-col gap-2">
              <Tag className="font-display text-display-s">{s.title}</Tag>
              <p className="cr-prose text-sm md:text-base text-cr-text-muted leading-relaxed">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="lg:col-span-5 lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
        <div data-ticket className="bg-cr-surface border border-cr-border shadow-float" aria-hidden="true">
          <div className={`h-[3px] ${accent === "secondary" ? "bg-cr-secondary" : "bg-cr-primary"}`} />
          <div className="p-5 sm:p-6 flex flex-col gap-5">
            <p className={`cr-label ${accentCls}`}>{ticketLabel}</p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
              {(["from", "to", "when", "price", "seat"] as TicketFieldKey[]).map((k) => (
                <div key={k} className={`cr-ticket-field flex flex-col gap-1 ${k === "to" ? "col-span-2" : ""}`} data-field={k}>
                  <dt className="cr-label text-cr-text-muted">{LABELS[k]}</dt>
                  <dd className={`${k === "to" ? "font-display text-display-s sm:text-[1.75rem] leading-[0.95]" : "text-base font-medium"} text-cr-text cr-tabular`}>
                    {fields[k]}
                  </dd>
                  <span className="cr-ticket-field__blank" aria-hidden="true" />
                </div>
              ))}
            </dl>
            <div className="flex items-end gap-[3px] h-7 pt-1" aria-hidden="true">
              {BARS.map((w, i) => (
                <span key={i} className="bg-cr-text/80 block h-full" style={{ width: w }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const BARS = [2, 1, 3, 1, 2, 2, 1, 4, 1, 2, 1, 3, 2, 1, 1, 3, 2, 4, 1, 2, 1, 1, 3, 2, 1, 2, 4, 1, 3, 1, 2, 2];
