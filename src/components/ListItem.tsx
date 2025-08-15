import React, { useMemo, useState } from "react";
import { Edit2, Trash2, GripVertical } from "lucide-react";
import type {
  ListItemProps,
  ScheduledBudgetItem,
  ReorderDragData,
} from "../types";

interface ExtendedListItemProps extends ListItemProps {
  scheduledItems: ScheduledBudgetItem[];
  currentMonth: Date;
  itemIndex: number;
  onReorderDragStart: () => void;
  onReorderDragEnd: () => void;
}

const ListItem: React.FC<ExtendedListItemProps> = ({
  item,
  onEdit,
  onDelete,
  scheduledItems,
  currentMonth,
  itemIndex,
  onReorderDragStart,
  onReorderDragEnd,
}) => {
  const [isReorderDragging, setIsReorderDragging] = useState(false);

  // Memoized calculation to check if this item has been scheduled in the current month
  const hasInstanceThisMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const monthPrefix = `${year}-${month}`;

    return scheduledItems.some(
      (scheduledItem) =>
        scheduledItem.budgetItemId === item.id &&
        scheduledItem.date.startsWith(monthPrefix)
    );
  }, [scheduledItems, currentMonth, item.id]);

  // Handle reorder drag (from grip handle)
  const handleReorderDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("Reorder drag start for item:", item.name);

    const reorderData: ReorderDragData = {
      type: "reorder",
      item,
      sourceIndex: itemIndex,
    };

    e.dataTransfer.setData("application/json", JSON.stringify(reorderData));
    e.dataTransfer.effectAllowed = "move";

    setIsReorderDragging(true);
    onReorderDragStart();
  };

  const handleReorderDragEnd = () => {
    console.log("Reorder drag end for item:", item.name);
    setIsReorderDragging(false);
    onReorderDragEnd();
  };

  // Handle calendar drag (from main item body)
  const handleCalendarDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("Calendar drag start for item:", item.name);

    // Prevent calendar drag if currently doing reorder drag
    if (isReorderDragging) {
      e.preventDefault();
      return;
    }

    // For backward compatibility, set the old format that calendar expects
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "copy";

    // Create a custom drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.opacity = "0.8";
    dragImage.style.transform = "rotate(-5deg)";
    dragImage.style.pointerEvents = "none";

    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(
      dragImage,
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );

    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 0);
  };

  const handleCalendarDragEnd = () => {
    console.log("Calendar drag end for item:", item.name);
  };

  return (
    <div
      style={{
        background:
          item.type === "expense"
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        borderRadius: "50px",
        padding: "3px",
        width: "100%",
        maxWidth: "600px",
        transition: "all 0.3s ease",
        opacity: isReorderDragging ? 0.5 : 1,
        transform: isReorderDragging ? "rotate(5deg)" : "none",
      }}
      onMouseOver={(e: React.MouseEvent<HTMLDivElement>) => {
        if (!isReorderDragging) {
          const target = e.currentTarget;
          target.style.transform = "translateY(-2px)";
          target.style.filter = "brightness(1.1)";
        }
      }}
      onMouseOut={(e: React.MouseEvent<HTMLDivElement>) => {
        if (!isReorderDragging) {
          const target = e.currentTarget;
          target.style.transform = "translateY(0)";
          target.style.filter = "brightness(1)";
        }
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
        {/* Left side: Grip handle for reordering */}
        <div
          draggable={true}
          onDragStart={handleReorderDragStart}
          onDragEnd={handleReorderDragEnd}
          style={{
            cursor: isReorderDragging ? "grabbing" : "ns-resize",
            padding: "8px 4px",
            marginRight: "8px",
            borderRadius: "6px",
            transition: "background-color 0.2s ease",
            border: "2px dashed transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "24px",
            backgroundColor: "#f8f9fa",
          }}
          onMouseOver={(e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.backgroundColor = "#e9ecef";
            e.currentTarget.style.borderColor = "#8c52ff";
            e.currentTarget.style.cursor = "ns-resize";
          }}
          onMouseOut={(e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.backgroundColor = "#f8f9fa";
            e.currentTarget.style.borderColor = "transparent";
          }}
          title="Drag to reorder items"
        >
          <GripVertical size={16} color="#495057" />
        </div>

        {/* Center: Item content (draggable to calendar) */}
        <div
          draggable={true}
          onDragStart={handleCalendarDragStart}
          onDragEnd={handleCalendarDragEnd}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flex: 1,
            cursor: "grab",
            padding: "4px 8px",
            borderRadius: "4px",
            transition: "background-color 0.2s ease",
          }}
          onMouseOver={(e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.backgroundColor = "#f9fafb";
          }}
          onMouseOut={(e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title="Drag to schedule on calendar"
        >
          <span
            style={{
              fontSize: "18px",
              fontWeight: "500",
              color: "#2d3748",
              pointerEvents: "none",
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
              ✅
            </span>
          )}
        </div>

        {/* Right side: Amount and action buttons */}
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
              pointerEvents: "none",
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
                e.stopPropagation();
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
                e.stopPropagation();
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
