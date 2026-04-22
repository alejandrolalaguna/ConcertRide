import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    // Log for Cloudflare / browser console. Swap for Sentry once wired.
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  private reload = () => {
    window.location.reload();
  };

  private goHome = () => {
    window.location.assign("/");
  };

  override render() {
    if (!this.state.error) return this.props.children;

    return (
      <main
        id="main"
        role="alert"
        className="min-h-dvh bg-cr-bg text-cr-text flex items-center justify-center px-6 py-16"
      >
        <div className="w-full max-w-lg space-y-6">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-secondary">
            Error inesperado
          </p>
          <h1 className="font-display text-4xl md:text-5xl uppercase leading-[0.95]">
            Algo falló en la pista.
          </h1>
          <p className="font-sans text-sm text-cr-text-muted">
            Hemos registrado el fallo. Puedes recargar la página o volver al inicio para continuar.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={this.reload}
              className="bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100"
            >
              Recargar
            </button>
            <button
              type="button"
              onClick={this.goHome}
              className="bg-transparent text-cr-text font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-cr-border hover:border-cr-primary hover:text-cr-primary px-6 py-3 transition-colors duration-150"
            >
              Ir al inicio
            </button>
          </div>

          {import.meta.env.DEV && (
            <pre className="mt-8 max-h-64 overflow-auto border border-cr-border bg-cr-surface p-3 font-mono text-[11px] text-cr-secondary whitespace-pre-wrap break-words">
              {this.state.error.stack ?? this.state.error.message}
            </pre>
          )}
        </div>
      </main>
    );
  }
}
