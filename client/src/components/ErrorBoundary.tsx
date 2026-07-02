import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("Unhandled error:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-moss-950 px-6 text-center text-white">
          <img src="/svg/leaf.svg" alt="" className="h-10 w-10 opacity-70" />
          <h1 className="font-display text-2xl">Something went wrong</h1>
          <p className="max-w-md text-sm text-white/60">
            The page hit an unexpected error. Reload to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-leaf-500 px-4 py-2 text-sm font-semibold text-white hover:bg-leaf-600"
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
