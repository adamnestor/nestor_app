import React, { useState } from "react";
import { DollarSign, X } from "lucide-react";

interface StartingBalanceModalProps {
  showModal: boolean;
  onClose: () => void;
  onSetBalance: (date: string, amount: number) => void;
}

const StartingBalanceModal: React.FC<StartingBalanceModalProps> = ({
  showModal,
  onClose,
  onSetBalance,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Default to today
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [amount, setAmount] = useState<string>("");

  if (!showModal) return null;

  const handleSubmit = (): void => {
    const balanceAmount = parseFloat(amount);

    if (isNaN(balanceAmount)) {
      alert("Please enter a valid amount");
      return;
    }

    onSetBalance(selectedDate, balanceAmount);

    // Reset form
    setAmount("");
    setSelectedDate(() => {
      const today = new Date();
      return today.toISOString().split("T")[0];
    });
    onClose();
  };

  const handleCancel = (): void => {
    // Reset form
    setAmount("");
    setSelectedDate(() => {
      const today = new Date();
      return today.toISOString().split("T")[0];
    });
    onClose();
  };

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
        zIndex: 2000,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "32px",
          width: "90%",
          maxWidth: "400px",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <DollarSign size={24} color="#2d3748" />
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#2d3748",
                margin: "0",
              }}
            >
              Set Starting Balance
            </h2>
          </div>

          <button
            onClick={handleCancel}
            style={{
              background: "none",
              border: "none",
              padding: "8px",
              borderRadius: "50%",
              cursor: "pointer",
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
            <X size={20} color="#718096" />
          </button>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: "14px",
            color: "#718096",
            marginBottom: "24px",
            lineHeight: "1.5",
          }}
        >
          Set your account balance as of a specific date. Running balances will
          be calculated from this point forward.
        </p>

        {/* Form */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Date Input */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#4a5568",
              }}
            >
              Effective Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSelectedDate(e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                e.currentTarget.style.borderColor = "#667eea";
                e.currentTarget.style.outline = "none";
              }}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            />
          </div>

          {/* Amount Input */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#4a5568",
              }}
            >
              Starting Balance
            </label>
            <div
              style={{
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#718096",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                $
              </span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAmount(e.target.value)
                }
                placeholder="2500.00"
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 32px",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.outline = "none";
                }}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              />
            </div>
          </div>

          {/* Warning */}
          <div
            style={{
              background: "#fef5e7",
              border: "1px solid #feb2b2",
              borderRadius: "8px",
              padding: "12px",
              fontSize: "12px",
              color: "#744210",
            }}
          >
            <strong>Note:</strong> This will recalculate running balances from
            the selected date forward. Previous dates will keep their existing
            balances.
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "8px",
            }}
          >
            <button
              onClick={handleCancel}
              style={{
                flex: 1,
                padding: "12px 24px",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                background: "white",
                color: "#4a5568",
                fontSize: "14px",
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
              onClick={handleSubmit}
              disabled={!amount}
              style={{
                flex: 1,
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                background: amount
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "#e2e8f0",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: amount ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                if (amount) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                if (amount) {
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              Set Balance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartingBalanceModal;
