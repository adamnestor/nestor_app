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
import { useBalanceAdjustments } from "./hooks/useBalanceAdjustments";
import type { BudgetItem } from "./types";

const App: React.FC = () => {
  console.log("App component is rendering");
  // Custom hook handles all API calls and item state (now includes reordering)
  const {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    reorderItems,
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

  // Custom hook for balance adjustments (replaces React state)
  const {
    loading: adjustmentsLoading,
    error: adjustmentsError,
    createOrUpdateAdjustment,
    hasBalanceAdjustment,
  } = useBalanceAdjustments();

  console.log("Balance adjustments hook loaded:", {
    adjustmentsLoading,
    adjustmentsError,
    hasCreateFunction: !!createOrUpdateAdjustment,
  });

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

  // Current month state for tracking what's scheduled
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Dynamic starting balance that updates based on month carryover
  const [currentMonthStartingBalance, setCurrentMonthStartingBalance] =
    useState<number>(2500);

  // Load current month's scheduled items on component mount
  useEffect(() => {
    const currentDate = new Date();
    setCurrentMonth(currentDate);
    loadMonthItems(currentDate.getFullYear(), currentDate.getMonth() + 1);

    // IMPORTANT: Also call handleMonthChange to get the correct starting balance
    handleMonthChange(currentDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle balance adjustment (now saves to database)
  const handleSetBalance = async (
    date: string,
    amount: number
  ): Promise<void> => {
    console.log("handleSetBalance called with:", { date, amount }); // ADD THIS

    const success = await createOrUpdateAdjustment(date, amount);

    console.log("createOrUpdateAdjustment result:", success); // ADD THIS

    if (success) {
      console.log(
        `Balance adjusted to $${amount} as of ${date} - saved to database!`
      );
    } else {
      alert("Failed to save balance adjustment");
    }
  };

  // Handle month change from calendar (now passes adjustment parameters)
  // Handle month change from calendar (simplified - backend reads adjustments automatically)
  const handleMonthChange = async (newMonth: Date): Promise<void> => {
    setCurrentMonth(newMonth);
    loadMonthItems(newMonth.getFullYear(), newMonth.getMonth() + 1);

    // Get starting balance for this month - backend handles adjustments automatically
    try {
      const params = new URLSearchParams({
        year: newMonth.getFullYear().toString(),
        month: (newMonth.getMonth() + 1).toString(),
      });

      const response = await fetch(
        `http://localhost:8080/api/balance/month-start?${params}`
      );

      if (response.ok) {
        const data = await response.json();
        setCurrentMonthStartingBalance(data.startingBalance);
        console.log(
          `${newMonth.getFullYear()}-${newMonth.getMonth() + 1} starts with: $${
            data.startingBalance
          }`
        );
      } else {
        console.warn("API call failed, using default balance");
        setCurrentMonthStartingBalance(2500);
      }
    } catch (error) {
      console.error("Error fetching month starting balance:", error);
      setCurrentMonthStartingBalance(2500);
    }
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

  // Show loading screen if either main data or adjustments are loading
  if (loading || adjustmentsLoading) {
    return <LoadingScreen />;
  }

  // Show error state (prioritize main error over adjustments error)
  if (error) {
    return <ErrorScreen error={error} onRetry={refreshItems} />;
  }

  if (adjustmentsError) {
    console.warn("Balance adjustments error:", adjustmentsError);
    // Don't block the app for adjustments errors, just log them
  }

  // Main app render - Two Panel Layout with single background
  return (
    <div
      style={{
        height: "100vh", // Fixed viewport height
        width: "100vw",
        background: "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)",
        display: "flex",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxSizing: "border-box",
        overflow: "hidden", // Prevent main container from scrolling
      }}
    >
      {/* LEFT PANEL - Budget App (40%) - Scrollable */}
      <div
        style={{
          width: "40%",
          height: "100vh", // Fixed height
          padding: "40px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          boxSizing: "border-box",
          overflowY: "auto", // Enable vertical scrolling for this panel only
          overflowX: "hidden", // Prevent horizontal scrolling
          // Custom scrollbar styling for WebKit browsers
          scrollbarWidth: "thin", // Firefox
          scrollbarColor: "rgba(255, 255, 255, 0.3) transparent", // Firefox
        }}
        // Custom scrollbar for WebKit browsers (Chrome, Safari, Edge)
        ref={(el) => {
          if (el) {
            const style = document.createElement("style");
            style.textContent = `
              .left-panel::-webkit-scrollbar {
                width: 6px;
              }
              .left-panel::-webkit-scrollbar-track {
                background: transparent;
              }
              .left-panel::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
              }
              .left-panel::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
              }
            `;
            if (!document.querySelector("#custom-scrollbar-styles")) {
              style.id = "custom-scrollbar-styles";
              document.head.appendChild(style);
            }
            el.className = "left-panel";
          }
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingBottom: "40px", // Extra space at bottom for scroll comfort
          }}
        >
          <HeaderButtons
            onAddClick={handleAddClick}
            onBalanceClick={handleBalanceClick}
          />

          <List
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
            scheduledItems={scheduledItems}
            currentMonth={currentMonth}
            onReorderItems={reorderItems}
          />
        </div>
      </div>

      {/* RIGHT PANEL - Calendar (60%) - Fixed/Stationary */}
      <div
        style={{
          width: "60%",
          height: "100vh", // Fixed height
          padding: "30px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          overflow: "hidden", // No scrolling for calendar panel
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
            startingBalance={currentMonthStartingBalance}
            onDropItem={handleDropItem}
            onDateClick={handleDateClick}
            hasBalanceAdjustment={hasBalanceAdjustment}
            onMonthChange={handleMonthChange}
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
