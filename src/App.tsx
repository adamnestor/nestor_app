import React, { useState, useEffect } from "react";
import List from "./components/List";
import AddFormModal from "./components/AddFormModal";
import HeaderButtons from "./components/HeaderButtons";
import LoadingScreen from "./components/LoadingScreen";
import ErrorScreen from "./components/ErrorScreen";
import Calendar from "./components/Calendar";
import DateDetailModal from "./components/DateDetailModal";
import StartingBalanceModal from "./components/StartingBalanceModal";
import { useBudgetItems } from "./hooks/useBudgetItems";
import { useScheduledItems } from "./hooks/useScheduledItems";
import type { BudgetItem } from "./types";

// Interface for balance adjustments
interface BalanceAdjustment {
  date: string;
  amount: number;
}

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
  const {
    scheduledItems,
    loadMonthItems,
    createScheduledItem,
    updateScheduledItem,
    deleteScheduledItem,
  } = useScheduledItems();

  // Form state
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<"expense" | "income" | "">("");
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [formName, setFormName] = useState<string>("");
  const [formAmount, setFormAmount] = useState<string>("");

  // Date detail modal state
  const [showDateDetail, setShowDateDetail] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Starting balance modal state
  const [showBalanceModal, setShowBalanceModal] = useState<boolean>(false);

  // Balance adjustments state - stored in memory for this session
  const [balanceAdjustments, setBalanceAdjustments] = useState<
    BalanceAdjustment[]
  >([]);

  // Default starting balance
  const [baseStartingBalance] = useState<number>(2500);

  // Load current month's scheduled items on component mount
  useEffect(() => {
    const currentDate = new Date();
    loadMonthItems(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, [loadMonthItems]);

  // Calculate effective starting balance for a given date
  const getEffectiveStartingBalance = (forDate: string): number => {
    // Find the most recent balance adjustment on or before the given date
    const applicableAdjustments = balanceAdjustments
      .filter((adj) => adj.date <= forDate)
      .sort((a, b) => b.date.localeCompare(a.date)); // Sort by date descending

    if (applicableAdjustments.length > 0) {
      return applicableAdjustments[0].amount;
    }

    return baseStartingBalance;
  };

  // Check if a date has the most recent balance adjustment (only show pin on latest)
  const hasBalanceAdjustment = (date: string): boolean => {
    if (balanceAdjustments.length === 0) return false;

    // Find the most recent adjustment date
    const mostRecentAdjustment = balanceAdjustments.sort((a, b) =>
      b.date.localeCompare(a.date)
    )[0];

    // Only show pin on the most recent adjustment date
    return mostRecentAdjustment.date === date;
  };

  // Handle balance adjustment
  const handleSetBalance = (date: string, amount: number): void => {
    const newAdjustment: BalanceAdjustment = { date, amount };

    // Remove any existing adjustment for this date and add the new one
    const updatedAdjustments = balanceAdjustments
      .filter((adj) => adj.date !== date)
      .concat(newAdjustment)
      .sort((a, b) => a.date.localeCompare(b.date)); // Sort by date ascending

    setBalanceAdjustments(updatedAdjustments);
    console.log(`Balance adjusted to $${amount} as of ${date}`);
  };

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

  // Handle date click to show detail modal
  const handleDateClick = (date: string): void => {
    setSelectedDate(date);
    setShowDateDetail(true);
  };

  const handleCloseDateDetail = (): void => {
    setShowDateDetail(false);
    setSelectedDate("");
  };

  // Handle editing scheduled items from date detail modal
  const handleEditScheduledItem = async (
    id: number,
    updates: { amount?: number; name?: string }
  ): Promise<void> => {
    const existingItem = scheduledItems.find((item) => item.id === id);

    if (!existingItem) {
      alert("Item not found");
      return;
    }

    const success = await updateScheduledItem(id, {
      budgetItemId: existingItem.budgetItemId,
      date: selectedDate,
      ...updates,
    });

    if (!success) {
      alert("Failed to update item");
    }
  };

  // Handle deleting scheduled items from date detail modal
  const handleDeleteScheduledItem = async (id: number): Promise<void> => {
    const success = await deleteScheduledItem(id);
    if (!success) {
      alert("Failed to delete item");
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

  // Handle balance button click
  const handleBalanceClick = (): void => {
    setShowBalanceModal(true);
  };

  const handleCloseBalanceModal = (): void => {
    setShowBalanceModal(false);
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
      {/* LEFT PANEL - Budget App (35%) */}
      <div
        style={{
          width: "35%",
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
          <HeaderButtons
            onAddClick={handleAddClick}
            onBalanceClick={handleBalanceClick}
          />

          <List items={items} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>

      {/* RIGHT PANEL - Calendar (65%) */}
      <div
        style={{
          width: "65%",
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
            startingBalance={getEffectiveStartingBalance("2024-01-01")} // Use first day of year as reference
            onDropItem={handleDropItem}
            onDateClick={handleDateClick}
            getEffectiveStartingBalance={getEffectiveStartingBalance}
            hasBalanceAdjustment={hasBalanceAdjustment}
          />
        </div>
      </div>

      {/* Modals (overlay both panels) */}
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

      <DateDetailModal
        showModal={showDateDetail}
        selectedDate={selectedDate}
        scheduledItems={scheduledItems.filter(
          (item) => item.date === selectedDate
        )}
        onClose={handleCloseDateDetail}
        onEditItem={handleEditScheduledItem}
        onDeleteItem={handleDeleteScheduledItem}
      />

      <StartingBalanceModal
        showModal={showBalanceModal}
        onClose={handleCloseBalanceModal}
        onSetBalance={handleSetBalance}
      />
    </div>
  );
};

export default App;
