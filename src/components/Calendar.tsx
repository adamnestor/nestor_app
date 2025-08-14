import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ScheduledBudgetItem, BudgetItem } from "../types";

interface CalendarProps {
  scheduledItems?: ScheduledBudgetItem[];
  startingBalance?: number;
  onDropItem?: (budgetItem: BudgetItem, date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  scheduledItems = [],
  startingBalance = 0,
  onDropItem,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const goToPreviousMonth = (): void => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = (): void => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getDateString = (day: number): string => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${year}-${month}-${dayStr}`;
  };

  const getItemsForDate = (day: number): ScheduledBudgetItem[] => {
    const dateStr = getDateString(day);
    return scheduledItems.filter((item) => item.date === dateStr);
  };

  const calculateRunningBalance = (throughDay: number): number => {
    let balance = startingBalance; // Start with the starting balance
    for (let day = 1; day <= throughDay; day++) {
      const dayItems = getItemsForDate(day);
      dayItems.forEach((scheduledItem) => {
        const amount =
          scheduledItem.amount ?? scheduledItem.budgetItem?.amount ?? 0;
        const type = scheduledItem.budgetItem?.type ?? "expense";
        if (type === "income") {
          balance += amount;
        } else {
          balance -= amount;
        }
      });
    }
    return balance;
  };

  const getIndicatorDot = (
    items: ScheduledBudgetItem[]
  ): React.ReactElement | null => {
    if (items.length === 0) return null;

    const hasExpense = items.some(
      (item) => item.budgetItem?.type === "expense"
    );
    const hasIncome = items.some((item) => item.budgetItem?.type === "income");

    let dotColor = "#8c52ff"; // Default purple for expenses
    if (hasIncome && hasExpense) {
      // Gradient dot for both
      dotColor = "#8c52ff";
    } else if (hasIncome) {
      dotColor = "#ff66c4"; // Pink for income
    }

    return (
      <div
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: dotColor,
          marginLeft: "4px",
        }}
      />
    );
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          style={{
            padding: "8px",
            minHeight: "60px",
          }}
        />
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayItems = getItemsForDate(day);
      const runningBalance = calculateRunningBalance(day);
      const indicatorDot = getIndicatorDot(dayItems);
      const dateString = getDateString(day);

      // Drag & Drop Handlers
      const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Allow drop
        e.dataTransfer.dropEffect = "copy";
      };

      const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        // Reset visual feedback
        e.currentTarget.style.backgroundColor = isToday(day)
          ? "#8c52ff"
          : "transparent";
        e.currentTarget.style.border = "2px dashed transparent";

        try {
          const budgetItemData = e.dataTransfer.getData("application/json");
          const budgetItem = JSON.parse(budgetItemData);

          if (onDropItem) {
            onDropItem(budgetItem, dateString);
          }
        } catch (error) {
          console.error("Error parsing dropped data:", error);
        }
      };

      const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.style.backgroundColor = isToday(day)
          ? "#8c52ff"
          : "#e2e8f0";
        e.currentTarget.style.border = "2px dashed #8c52ff";
      };

      const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.style.backgroundColor = isToday(day)
          ? "#8c52ff"
          : "transparent";
        e.currentTarget.style.border = "2px dashed transparent";
      };

      days.push(
        <div
          key={day}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          style={{
            padding: "8px",
            minHeight: "60px",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            backgroundColor: isToday(day) ? "#8c52ff" : "transparent",
            color: isToday(day) ? "white" : "#2d3748",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            border: "2px dashed transparent",
          }}
          onMouseOver={(e: React.MouseEvent<HTMLDivElement>) => {
            if (!isToday(day)) {
              e.currentTarget.style.backgroundColor = "#e2e8f0";
            }
          }}
          onMouseOut={(e: React.MouseEvent<HTMLDivElement>) => {
            if (!isToday(day)) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          {/* First Line: Date + Dot */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "2px",
            }}
          >
            <span
              style={{
                fontSize: "16px",
                fontWeight: isToday(day) ? "600" : "500",
              }}
            >
              {day}
            </span>
            {indicatorDot}
          </div>

          {/* Second Line: Running Balance */}
          <div
            style={{
              fontSize: "10px",
              fontWeight: "500",
              color:
                runningBalance > 0
                  ? isToday(day)
                    ? "#c6f6d5"
                    : "#059669"
                  : runningBalance < 0
                  ? isToday(day)
                    ? "#fed7d7"
                    : "#dc2626"
                  : isToday(day)
                  ? "#e2e8f0"
                  : "#718096",
            }}
          >
            {runningBalance < 0
              ? `-$${Math.abs(runningBalance).toFixed(0)}`
              : `$${runningBalance.toFixed(0)}`}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        maxWidth: "100%",
      }}
    >
      {/* Month Navigation Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={goToPreviousMonth}
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
          <ChevronLeft size={20} color="#4a5568" />
        </button>

        <h2
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#2d3748",
            margin: "0",
          }}
        >
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>

        <button
          onClick={goToNextMonth}
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
          <ChevronRight size={20} color="#4a5568" />
        </button>
      </div>

      {/* Day Headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "1px",
          marginBottom: "12px",
        }}
      >
        {dayNames.map((day) => (
          <div
            key={day}
            style={{
              padding: "8px",
              textAlign: "center",
              fontSize: "12px",
              fontWeight: "600",
              color: "#718096",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "1px",
        }}
      >
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;
