import React from 'react';

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  AppErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  private handleReload = () => {
    window.location.hash = '#/';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 parchment-canvas text-[#5A4126]">
          <div className="max-w-md w-full parchment-card border-2 border-[#8E0F14]/35 p-8 rounded-sm text-center space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8E0F14]">
              Le R · Maraval - Oran
            </p>
            <h1 className="font-editorial text-2xl font-bold text-[#5A4126]">
              Impossible d’afficher la carte
            </h1>
            <p className="text-sm text-[#6B5535] leading-relaxed">
              Une erreur inattendue est survenue lors du chargement. Rechargez la page pour consulter le menu.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="min-h-[42px] px-5 py-2 bg-[#8E0F14] hover:bg-[#700B0F] text-[#FBF1DA] text-sm font-medium rounded-sm transition-colors"
              >
                Recharger la page
              </button>
              <a
                href="#/menu"
                onClick={() => this.setState({ hasError: false })}
                className="inline-flex items-center min-h-[42px] px-5 py-2 border border-[#5A4126]/40 bg-[#F5E6C5]/70 text-sm font-medium text-[#5A4126] rounded-sm"
              >
                Voir le menu
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
