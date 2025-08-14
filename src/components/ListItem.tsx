import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { ListItemProps } from "../types";

const ListItem: React.FC<ListItemProps> = ({ item, onEdit, onDelete }) => {
  return (
    <div
      style={{
        background:
          item.type === "expense"
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        borderRadius: "50px",
        padding: "3px",
        width: "100%",
        maxWidth: "450px",
        transition: "all 0.3s ease",
      }}
      onMouseOver={(e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        target.style.transform = "translateY(-2px)";
        target.style.filter = "brightness(1.1)";
      }}
      onMouseOut={(e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        target.style.transform = "translateY(0)";
        target.style.filter = "brightness(1)";
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "47px",
          padding: "18px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            fontSize: "18px",
            fontWeight: "500",
            color: "#2d3748",
          }}
        >
          {item.name}
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: item.type === "expense" ? "#667eea" : "#f5576c",
            }}
          >
            ${item.amount.toFixed(2)}
          </span>

          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            <button
              onClick={() => onEdit(item.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.2s ease",
              }}
              onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = "#f7fafc";
              }}
              onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Edit2 size={18} color="#718096" />
            </button>

            <button
              onClick={() => onDelete(item.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.2s ease",
              }}
              onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = "#fed7d7";
              }}
              onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Trash2 size={18} color="#e53e3e" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
