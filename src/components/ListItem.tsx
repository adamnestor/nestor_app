import React, { useMemo } from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { ListItemProps, ScheduledBudgetItem } from "../types";

interface ExtendedListItemProps extends ListItemProps {
  scheduledItems: ScheduledBudgetItem[];
  currentMonth: Date;
}

const ListItem: React.FC<ExtendedListItemProps> = ({
  item,
  onEdit,
  onDelete,
  scheduledItems,
  currentMonth,
}) => {
  // Memoized calculation to check if this item has been scheduled in the current month
  const hasInstanceThisMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const monthPrefix = `${year}-${month}`;

    console.log(
      "Checking month prefix:",
      monthPrefix,
      "for item:",
      item.name,
      "scheduled items:",
      scheduledItems.length
    );

    return scheduledItems.some(
      (scheduledItem) =>
        scheduledItem.budgetItemId === item.id &&
        scheduledItem.date.startsWith(monthPrefix)
    );
  }, [scheduledItems, currentMonth, item.id, item.name]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Set the data to be transferred (the budget item)
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "copy";

    // Create a custom drag image that's less transparent
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.opacity = "0.8"; // Less transparent (default is around 0.5)
    dragImage.style.transform = "rotate(-5deg)"; // Optional: slight rotation for visual feedback
    dragImage.style.pointerEvents = "none";

    // Temporarily add to DOM to render, then remove
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(
      dragImage,
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );

    // Clean up after a brief moment
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 0);

    // Change cursor during drag
    e.currentTarget.style.cursor = "grabbing";
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // Reset cursor after drag
    e.currentTarget.style.cursor = "grab";
  };

  return (
    <div
      draggable={true} // Make the item draggable
      onDragStart={handleDragStart} // Handle drag start
      onDragEnd={handleDragEnd} // Handle drag end
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
        cursor: "grab", // Show grab cursor
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              fontWeight: "500",
              color: "#2d3748",
              pointerEvents: "none", // Prevent text selection during drag
            }}
          >
            {item.name}
          </span>

          {/* Calendar icon if scheduled this month */}
          {hasInstanceThisMonth && (
            <span
              style={{
                fontSize: "14px",
                opacity: "0.7",
              }}
              title="Scheduled this month"
            >
              📅
            </span>
          )}
        </div>

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
              pointerEvents: "none", // Prevent text selection during drag
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
              onClick={(e) => {
                e.stopPropagation(); // Prevent drag when clicking buttons
                onEdit(item.id);
              }}
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
              onClick={(e) => {
                e.stopPropagation(); // Prevent drag when clicking buttons
                onDelete(item.id);
              }}
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
