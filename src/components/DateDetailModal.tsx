import React, { useState } from "react";
import { Edit2, Trash2, X } from "lucide-react";
import type { ScheduledBudgetItem } from "../types";

interface DateDetailModalProps {
  showModal: boolean;
  selectedDate: string;
  scheduledItems: ScheduledBudgetItem[];
  onClose: () => void;
  onEditItem: (id: number, updates: { amount?: number; name?: string }) => void;
  onDeleteItem: (id: number) => void;
}

const DateDetailModal: React.FC<DateDetailModalProps> = ({
  showModal,
  selectedDate,
  scheduledItems,
  onClose,
  onEditItem,
  onDeleteItem,
}) => {
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editAmount, setEditAmount] = useState<string>("");

  if (!showModal) return null;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEditClick = (item: ScheduledBudgetItem): void => {
    setEditingItem(item.id);
    setEditName(item.name || item.budgetItem?.name || "");
    setEditAmount((item.amount || item.budgetItem?.amount || 0).toString());
  };

  const handleSaveEdit = (itemId: number): void => {
    const amount = parseFloat(editAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    onEditItem(itemId, {
      name: editName.trim() || undefined,
      amount: amount,
    });

    setEditingItem(null);
    setEditName("");
    setEditAmount("");
  };

  const handleCancelEdit = (): void => {
    setEditingItem(null);
    setEditName("");
    setEditAmount("");
  };

  const handleDeleteClick = (itemId: number, itemName: string): void => {
    if (
      confirm(`Are you sure you want to delete "${itemName}" from this date?`)
    ) {
      onDeleteItem(itemId);
    }
  };

  const getTotalForDate = (): number => {
    return scheduledItems.reduce((total, item) => {
      const amount = item.amount || item.budgetItem?.amount || 0;
      const type = item.budgetItem?.type || "expense";
      return type === "income" ? total + amount : total - amount;
    }, 0);
  };

  const total = getTotalForDate();

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
          maxWidth: "500px",
          maxHeight: "80vh",
          overflowY: "auto",
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
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "16px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#2d3748",
                margin: "0 0 4px 0",
              }}
            >
              {formatDate(selectedDate)}
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#718096",
                margin: "0",
              }}
            >
              {scheduledItems.length} item
              {scheduledItems.length !== 1 ? "s" : ""} scheduled
            </p>
          </div>

          <button
            onClick={onClose}
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

        {/* Items List */}
        {scheduledItems.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#718096",
            }}
          >
            <p>No items scheduled for this date.</p>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>
              Drag items from the left panel to schedule them!
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {scheduledItems.map((item) => {
              const isEditing = editingItem === item.id;
              const displayName =
                item.name || item.budgetItem?.name || "Unknown";
              const displayAmount = item.amount || item.budgetItem?.amount || 0;
              const itemType = item.budgetItem?.type || "expense";

              return (
                <div
                  key={item.id}
                  style={{
                    background: "#f7fafc",
                    borderRadius: "12px",
                    padding: "16px",
                    border: `2px solid ${
                      itemType === "expense" ? "#8c52ff" : "#ff66c4"
                    }20`,
                  }}
                >
                  {isEditing ? (
                    // Edit Mode
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Item name"
                        style={{
                          padding: "8px 12px",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                          fontSize: "14px",
                        }}
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        placeholder="Amount"
                        style={{
                          padding: "8px 12px",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                          fontSize: "14px",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          onClick={handleCancelEdit}
                          style={{
                            padding: "6px 12px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            background: "white",
                            color: "#718096",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          style={{
                            padding: "6px 12px",
                            border: "none",
                            borderRadius: "6px",
                            background:
                              itemType === "expense" ? "#8c52ff" : "#ff66c4",
                            color: "white",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#2d3748",
                            margin: "0 0 4px 0",
                          }}
                        >
                          {displayName}
                        </h4>
                        <p
                          style={{
                            fontSize: "14px",
                            color:
                              itemType === "expense" ? "#8c52ff" : "#ff66c4",
                            fontWeight: "600",
                            margin: "0",
                          }}
                        >
                          ${displayAmount.toFixed(2)} ({itemType})
                        </p>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "4px",
                        }}
                      >
                        <button
                          onClick={() => handleEditClick(item)}
                          style={{
                            background: "none",
                            border: "none",
                            padding: "6px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "background-color 0.2s ease",
                          }}
                          onMouseOver={(
                            e: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            e.currentTarget.style.backgroundColor = "#e2e8f0";
                          }}
                          onMouseOut={(
                            e: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          <Edit2 size={16} color="#718096" />
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteClick(item.id, displayName)
                          }
                          style={{
                            background: "none",
                            border: "none",
                            padding: "6px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "background-color 0.2s ease",
                          }}
                          onMouseOver={(
                            e: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            e.currentTarget.style.backgroundColor = "#fed7d7";
                          }}
                          onMouseOut={(
                            e: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          <Trash2 size={16} color="#e53e3e" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {scheduledItems.length > 0 && (
          <div
            style={{
              marginTop: "24px",
              padding: "16px",
              background: total >= 0 ? "#f0fff4" : "#fef5e7",
              borderRadius: "8px",
              border: `1px solid ${total >= 0 ? "#9ae6b4" : "#feb2b2"}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#2d3748",
                }}
              >
                Net Impact:
              </span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: total >= 0 ? "#059669" : "#dc2626",
                }}
              >
                {total >= 0 ? "+" : ""}${total.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateDetailModal;
