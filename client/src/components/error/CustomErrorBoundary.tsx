import React, { Component, ReactNode } from "react";
import ErrorBoundary from "./ErrorBoundary";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class CustomErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state to trigger a re-render with the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to a reporting service
    console.error("Caught error:", error, errorInfo);
  }

  resetErrorBoundary = () => {
    // Reset the error state to retry rendering the children
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Render your ErrorBoundary component as the fallback
      return <ErrorBoundary error={this.state.error} reset={this.resetErrorBoundary} />;
    }
    return this.props.children;
  }
}

export default CustomErrorBoundary;