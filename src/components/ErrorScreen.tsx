import React from "react";

interface ErrorScreenProps {
  error: string;
  onRetry?: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onRetry }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "18px",
        color: "#e5e7eb",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        gap: "20px",
      }}
    >
      <div>Error: {error}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: "12px 24px",
            background: "linear-gradient(135deg, #8c52ff 0%, #5ce1e6 100%)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
          onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorScreen;
