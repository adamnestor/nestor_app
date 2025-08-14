import React, { useState, useEffect } from "react";
import List from "./components/List";
import AddFormModal from "./components/AddFormModal";
import HeaderButtons from "./components/HeaderButtons";
import LoadingScreen from "./components/LoadingScreen";
import ErrorScreen from "./components/ErrorScreen";
import Calendar from "./components/Calendar";
import { useBudgetItems } from "./hooks/useBudgetItems";
import { useScheduledItems } from "./hooks/useScheduledItems";
import type { BudgetItem } from "./types";

const App: React.FC = () => {
  // Custom hook handles all API calls and item state
  const {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refreshItems,
  } = useBudgetItems();

  // Custom hook for scheduled items (calendar data)
  const { scheduledItems, loadMonthItems, createScheduledItem } =
    useScheduledItems();

  // Form state
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<"expense" | "income" | "">("");
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [formName, setFormName] = useState<string>("");
  const [formAmount, setFormAmount] = useState<string>("");

  // Load current month's scheduled items on component mount
  useEffect(() => {
    const currentDate = new Date();
    loadMonthItems(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, [loadMonthItems]);

  // Handle drag & drop from budget items to calendar
  const handleDropItem = async (
    budgetItem: BudgetItem,
    date: string
  ): Promise<void> => {
    try {
      const success = await createScheduledItem({
        budgetItemId: budgetItem.id,
        date: date,
        // Use original amount and name (no overrides for MVP)
      });

      if (success) {
        console.log(`Successfully scheduled "${budgetItem.name}" for ${date}`);
      } else {
        alert("Failed to schedule item");
      }
    } catch (error) {
      console.error("Error scheduling item:", error);
      alert("An error occurred while scheduling the item");
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

    let success = false;

    if (editingItem) {
      success = await updateItem(editingItem.id, itemData);
      if (!success) {
        alert("Failed to update item");
        return;
      }
    } else {
      success = await createItem(itemData);
      if (!success) {
        alert("Failed to create item");
        return;
      }
    }

    // Close form on success
    handleCloseForm();
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (confirm("Are you sure you want to delete this item?")) {
      const success = await deleteItem(id);
      if (!success) {
        alert("Failed to delete item");
      }
    }
  };

  // Show loading screen
  if (loading) {
    return <LoadingScreen />;
  }

  // Show error state
  if (error) {
    return <ErrorScreen error={error} onRetry={refreshItems} />;
  }

  // Main app render - Two Panel Layout with single background
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)",
        display: "flex",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxSizing: "border-box",
      }}
    >
      {/* LEFT PANEL - Budget App (25%) */}
      <div
        style={{
          width: "25%",
          minHeight: "100vh",
          padding: "40px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <HeaderButtons onAddClick={handleAddClick} />

          <List items={items} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>

      {/* RIGHT PANEL - Calendar (75%) */}
      <div
        style={{
          width: "75%",
          minHeight: "100vh",
          padding: "40px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
          }}
        >
          <Calendar
            scheduledItems={scheduledItems}
            startingBalance={2500}
            onDropItem={handleDropItem}
          />
        </div>
      </div>

      {/* Modal (overlays both panels) */}
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
  );
};

export default App;
