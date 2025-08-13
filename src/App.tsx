import React, { useState, useEffect } from "react";
import List from "./components/List";
import type { BudgetItem } from "./types";

const API_BASE_URL = "http://localhost:8080/api/items";

const App: React.FC = () => {
  // State for items - now loaded from backend
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<"expense" | "income" | "">("");
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);

  // Form input states
  const [formName, setFormName] = useState<string>("");
  const [formAmount, setFormAmount] = useState<string>("");

  // Load all items from backend on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async (): Promise<void> => {
    try {
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        console.error("Failed to fetch items");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = (type: "expense" | "income"): void => {
    setFormType(type);
    setFormName("");
    setFormAmount("");
    setEditingItem(null);
    setShowAddForm(true);
  };

  const handleCloseForm = (): void => {
    setShowAddForm(false);
    setFormType("");
    setFormName("");
    setFormAmount("");
    setEditingItem(null);
  };

  const handleEdit = (id: number): void => {
    const itemToEdit = items.find((item) => item.id === id);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setFormType(itemToEdit.type);
      setFormName(itemToEdit.name);
      setFormAmount(itemToEdit.amount.toString());
      setShowAddForm(true);
    }
  };

  const handleSubmitForm = async (): Promise<void> => {
    // Validation
    if (!formName.trim() || !formAmount.trim()) {
      alert("Please fill in both name and amount");
      return;
    }

    const amount = parseFloat(formAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const itemData = {
      name: formName.trim(),
      amount: amount,
      type: formType as "expense" | "income",
    };

    try {
      if (editingItem) {
        // Update existing item
        const response = await fetch(`${API_BASE_URL}/${editingItem.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemData),
        });

        if (response.ok) {
          await fetchItems(); // Refresh the list
          handleCloseForm();
        } else {
          alert("Failed to update item");
        }
      } else {
        // Create new item
        const response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemData),
        });

        if (response.ok) {
          await fetchItems(); // Refresh the list
          handleCloseForm();
        } else {
          alert("Failed to create item");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while saving the item");
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await fetchItems(); // Refresh the list
        } else {
          alert("Failed to delete item");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("An error occurred while deleting the item");
      }
    }
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
          color: "#4a5568",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)",
        padding: "40px 20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Header Buttons */}
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
            onClick={() => handleAddClick("expense")}
            style={{
              background: "linear-gradient(135deg, #8c52ff 0%, #5ce1e6 100%)",
              border: "none",
              borderRadius: "50px",
              padding: "16px 32px",
              color: "white",
              fontSize: "18px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
              transition: "all 0.3s ease",
              minWidth: "160px",
            }}
            onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 12px 30px rgba(102, 126, 234, 0.4)";
            }}
            onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 25px rgba(102, 126, 234, 0.3)";
            }}
          >
            Add Expense
          </button>

          <button
            onClick={() => handleAddClick("income")}
            style={{
              background: "linear-gradient(135deg, #ff66c4 0%, #ffde59 100%)",
              border: "none",
              borderRadius: "50px",
              padding: "16px 32px",
              color: "white",
              fontSize: "18px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 8px 25px rgba(240, 147, 251, 0.3)",
              transition: "all 0.3s ease",
              minWidth: "160px",
            }}
            onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 12px 30px rgba(240, 147, 251, 0.4)";
            }}
            onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 25px rgba(240, 147, 251, 0.3)";
            }}
          >
            Add Income
          </button>
        </div>

        {/* Items List */}
        <List items={items} onEdit={handleEdit} onDelete={handleDelete} />

        {/* Add Form Modal */}
        {showAddForm && (
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
                      setFormName(e.target.value)
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
                        formType === "expense" ? "#667eea" : "#f5576c";
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
                      setFormAmount(e.target.value)
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
                        formType === "expense" ? "#667eea" : "#f5576c";
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
                    onClick={handleCloseForm}
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
                    onClick={handleSubmitForm}
                    style={{
                      flex: 1,
                      padding: "12px 24px",
                      border: "none",
                      borderRadius: "12px",
                      background:
                        formType === "expense"
                          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
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
        )}
      </div>
    </div>
  );
};

export default App;
