/**
 * Raíl de avance: un filete vertical de 1 px con relleno lima que crece con el
 * scroll. Es el contrapeso obligatorio de cualquier sección que ancle el
 * scroll (pin). El relleno lo mueve fx/scan.ts a través de `data-rail-fill`
 * dentro de un contenedor `data-rail-stage`.
 *
 * Sin JS (Nivel B o reduced-motion) se ve como un filete quieto: sigue
 * orientando porque separa las columnas.
 */
export function ProgressRail({ className = "" }: { className?: string }) {
  return (
    <div className={`cr-rail ${className}`} aria-hidden="true">
      <div className="cr-rail__fill" data-rail-fill />
    </div>
  );
}
