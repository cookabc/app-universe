import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Application render failure", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="app-main">
          <section
            className="app-error-state"
            aria-labelledby="app-error-title"
          >
            <p className="app-error-kicker">Application error</p>
            <h1 id="app-error-title">Capability Atlas hit a render failure.</h1>
            <p>{this.state.error.message}</p>
            <a href="/skill-showcase">Return home</a>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
