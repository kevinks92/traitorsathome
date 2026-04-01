import React from "react";
import ReactDOM from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import TraitorsGame from "./TraitorsGame.jsx";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(err) {
    return { error: err };
  }
  componentDidCatch(err, info) {
    console.error("[ErrorBoundary]", err, info?.componentStack);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ background: "#0e0612", color: "#c9a84c", fontFamily: "serif", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🕯️</div>
          <div style={{ fontSize: "1.2rem", marginBottom: 8 }}>Something went wrong</div>
          <div style={{ fontSize: ".8rem", color: "#888", marginBottom: 24, maxWidth: 320, lineHeight: 1.6 }}>{String(this.state.error)}</div>
          <button onClick={() => this.setState({ error: null })} style={{ background: "rgba(201,168,76,.15)", border: "1px solid rgba(201,168,76,.4)", color: "#c9a84c", padding: "10px 24px", borderRadius: 4, fontFamily: "serif", fontSize: "1rem", cursor: "pointer" }}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <ErrorBoundary>
        <TraitorsGame />
      </ErrorBoundary>
    </ConvexProvider>
  </React.StrictMode>
);
