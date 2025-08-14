import React from "react";

interface HeaderButtonsProps {
  onAddClick: (type: "expense" | "income") => void;
}

const HeaderButtons: React.FC<HeaderButtonsProps> = ({ onAddClick }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        marginBottom: "40px",
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
  );
};

export default HeaderButtons;
