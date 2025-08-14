import React from "react";

interface HeaderButtonsProps {
  onAddClick: (type: "expense" | "income") => void;
  onBalanceClick: () => void;
}

const HeaderButtons: React.FC<HeaderButtonsProps> = ({
  onAddClick,
  onBalanceClick,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginBottom: "40px",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Add buttons row */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => onAddClick("expense")}
          style={{
            background: "linear-gradient(135deg, #8c52ff 0%, #5ce1e6 100%)",
            border: "none",
            borderRadius: "50px",
            padding: "16px 32px",
            color: "white",
            fontSize: "18px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 8px 25px rgba(140, 82, 255, 0.3)",
            transition: "all 0.3s ease",
            minWidth: "160px",
          }}
          onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 12px 30px rgba(140, 82, 255, 0.4)";
          }}
          onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 8px 25px rgba(140, 82, 255, 0.3)";
          }}
        >
          Add Expense
        </button>

        <button
          onClick={() => onAddClick("income")}
          style={{
            background: "linear-gradient(135deg, #ff66c4 0%, #ffde59 100%)",
            border: "none",
            borderRadius: "50px",
            padding: "16px 32px",
            color: "white",
            fontSize: "18px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 8px 25px rgba(255, 102, 196, 0.3)",
            transition: "all 0.3s ease",
            minWidth: "160px",
          }}
          onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 12px 30px rgba(255, 102, 196, 0.4)";
          }}
          onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 8px 25px rgba(255, 102, 196, 0.3)";
          }}
        >
          Add Income
        </button>
      </div>

      {/* Balance adjustment button */}
      <button
        onClick={onBalanceClick}
        style={{
          background: "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "25px",
          padding: "8px 20px",
          color: "white",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "pointer",
          transition: "all 0.3s ease",
          opacity: "0.8",
        }}
        onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.opacity = "0.8";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        💰 Set Starting Balance
      </button>
    </div>
  );
};

export default HeaderButtons;
