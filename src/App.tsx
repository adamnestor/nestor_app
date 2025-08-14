import React, { useState, useEffect } from "react";
import List from "./components/List";
import AddFormModal from "./components/AddFormModal";
import HeaderButtons from "./components/HeaderButtons";
import LoadingScreen from "./components/LoadingScreen";
import type { BudgetItem } from "./types";

const API_BASE_URL = "http://localhost:8080/api/items";

const App: React.FC = () => {
  // State management
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<"expense" | "income" | "">("");
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [formName, setFormName] = useState<string>("");
  const [formAmount, setFormAmount] = useState<string>("");

  // Load items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  // API Functions
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

  // Form Handlers
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData),
        });

        if (response.ok) {
          await fetchItems();
          handleCloseForm();
        } else {
          alert("Failed to update item");
        }
      } else {
        // Create new item
        const response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData),
        });

        if (response.ok) {
          await fetchItems();
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
          await fetchItems();
        } else {
          alert("Failed to delete item");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("An error occurred while deleting the item");
      }
    }
  };

  // Show loading screen
  if (loading) {
    return <LoadingScreen />;
  }

  // Main app render
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
        <HeaderButtons onAddClick={handleAddClick} />

        <List items={items} onEdit={handleEdit} onDelete={handleDelete} />

        <AddFormModal
          showForm={showAddForm}
          formType={formType}
          editingItem={editingItem}
          formName={formName}
          formAmount={formAmount}
          onNameChange={setFormName}
          onAmountChange={setFormAmount}
          onClose={handleCloseForm}
          onSubmit={handleSubmitForm}
        />
      </div>
    </div>
  );
};

export default App;
