import React from "react";
import type { BudgetItem } from "../types";

interface AddFormModalProps {
  showForm: boolean;
  formType: "expense" | "income" | "";
  editingItem: BudgetItem | null;
  formName: string;
  formAmount: string;
  onNameChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const AddFormModal: React.FC<AddFormModalProps> = ({
  showForm,
  formType,
  editingItem,
  formName,
  formAmount,
  onNameChange,
  onAmountChange,
  onClose,
  onSubmit,
}) => {
  if (!showForm) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "40px",
          width: "90%",
          maxWidth: "400px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        <h2
          style={{
            margin: "0 0 24px 0",
            fontSize: "24px",
            fontWeight: "700",
            color: "#2d3748",
            textAlign: "center",
          }}
        >
          {editingItem ? "Edit" : "Add"}{" "}
          {formType === "expense" ? "Expense" : "Income"}
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "16px",
                fontWeight: "500",
                color: "#4a5568",
              }}
            >
              Name
            </label>
            <input
              type="text"
              placeholder={`Enter ${formType} name`}
              value={formName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onNameChange(e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "16px",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                e.currentTarget.style.borderColor =
                  formType === "expense" ? "#8c52ff" : "#ff66c4";
                e.currentTarget.style.outline = "none";
              }}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "16px",
                fontWeight: "500",
                color: "#4a5568",
              }}
            >
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onAmountChange(e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "16px",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                e.currentTarget.style.borderColor =
                  formType === "expense" ? "#8c52ff" : "#ff66c4";
                e.currentTarget.style.outline = "none";
              }}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "12px 24px",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                background: "white",
                color: "#4a5568",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = "#f7fafc";
              }}
              onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              Cancel
            </button>

            <button
              onClick={onSubmit}
              style={{
                flex: 1,
                padding: "12px 24px",
                border: "none",
                borderRadius: "12px",
                background:
                  formType === "expense"
                    ? "linear-gradient(135deg, #8c52ff 0%, #5ce1e6 100%)"
                    : "linear-gradient(135deg, #ff66c4 0%, #ffde59 100%)",
                color: "white",
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
              {editingItem
                ? "Save Changes"
                : `Add ${formType === "expense" ? "Expense" : "Income"}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFormModal;
