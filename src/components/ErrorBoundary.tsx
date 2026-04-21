import React from "react";

interface State {
  hasError: boolean;
}

interface Props {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-black">
          <div className="text-center p-8 space-y-4">
            <p className="text-gold-primary font-black text-xl">系統錯誤</p>
            <p className="text-gray-500 text-sm">請重新整理頁面</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-3 bg-gold-primary text-black font-black rounded-xl"
            >
              重試
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
