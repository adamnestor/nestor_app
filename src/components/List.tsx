import React, { useState } from "react";
import ListItem from "./ListItem";
import type { ListProps, ScheduledBudgetItem, ReorderDragData } from "../types";

interface ExtendedListProps extends ListProps {
  scheduledItems: ScheduledBudgetItem[];
  currentMonth: Date;
  onReorderItems: (
    reorderRequests: { id: number; displayOrder: number }[]
  ) => Promise<boolean>;
}

const List: React.FC<ExtendedListProps> = ({
  items,
  onEdit,
  onDelete,
  scheduledItems,
  currentMonth,
  onReorderItems,
}) => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDraggingReorder, setIsDraggingReorder] = useState<boolean>(false);

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // During reorder operations, always allow drop
    if (isDraggingReorder) {
      setDragOverIndex(index);
      e.dataTransfer.dropEffect = "move";
      return;
    }

    // Try to read drag data to determine if it's a reorder operation
    try {
      const types = e.dataTransfer.types;
      if (types.includes("application/json")) {
        setDragOverIndex(index);
        e.dataTransfer.dropEffect = "move";
        return;
      }
    } catch {
      // Fallback: if we can't read data, but we know we're dragging, allow it
    }

    e.dataTransfer.dropEffect = "none";
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Drop at index:", dropIndex);

    setDragOverIndex(null);
    setIsDraggingReorder(false);

    try {
      const dragDataString = e.dataTransfer.getData("application/json");
      console.log("Drag data:", dragDataString);

      const parsed = JSON.parse(dragDataString) as ReorderDragData;

      if (parsed.type !== "reorder") {
        console.log("Not a reorder operation, type:", parsed.type);
        return;
      }

      const { sourceIndex } = parsed;
      console.log("Source index:", sourceIndex, "Drop index:", dropIndex);

      if (sourceIndex === dropIndex) {
        console.log("No change needed - same position");
        return;
      }

      // Create new order array
      const newItems = [...items];
      const [movedItem] = newItems.splice(sourceIndex, 1);
      newItems.splice(dropIndex, 0, movedItem);

      console.log(
        "New order:",
        newItems.map((item) => item.name)
      );

      // Generate reorder requests with new display orders
      const reorderRequests = newItems.map((item, index) => ({
        id: item.id,
        displayOrder: index + 1, // 1-based ordering
      }));

      console.log("Reorder requests:", reorderRequests);

      // Call the reorder API
      const success = await onReorderItems(reorderRequests);
      if (!success) {
        console.error("Failed to reorder items");
      } else {
        console.log("Successfully reordered items");
      }
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only clear if leaving the entire list container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverIndex(null);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("Drag enter on list");
  };

  const handleReorderDragStart = () => {
    console.log("List: Reorder drag started");
    setIsDraggingReorder(true);
  };

  const handleReorderDragEnd = () => {
    console.log("List: Reorder drag ended");
    setIsDraggingReorder(false);
    setDragOverIndex(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px", // Smaller gap since we have visible drop zones
        alignItems: "center",
        position: "relative",
      }}
      onDragLeave={handleDragLeave}
      onDragEnter={handleDragEnter}
    >
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          {/* Drop zone above each item */}
          <div
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            style={{
              height: isDraggingReorder ? "20px" : "4px",
              width: "100%",
              maxWidth: "600px",
              backgroundColor:
                isDraggingReorder && dragOverIndex === index
                  ? "#8c52ff"
                  : isDraggingReorder
                  ? "rgba(140, 82, 255, 0.3)"
                  : "transparent",
              borderRadius: "10px",
              transition: "all 0.2s ease",
              opacity: isDraggingReorder ? 1 : 0,
              border:
                isDraggingReorder && dragOverIndex === index
                  ? "2px solid #8c52ff"
                  : "2px solid transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              color: "white",
              fontWeight: "600",
            }}
          >
            {isDraggingReorder && dragOverIndex === index && "Drop here"}
          </div>

          <ListItem
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
            scheduledItems={scheduledItems}
            currentMonth={currentMonth}
            itemIndex={index}
            onReorderDragStart={handleReorderDragStart}
            onReorderDragEnd={handleReorderDragEnd}
          />
        </React.Fragment>
      ))}

      {/* Drop zone at the end */}
      <div
        onDragOver={(e) => handleDragOver(e, items.length)}
        onDrop={(e) => handleDrop(e, items.length)}
        style={{
          height: isDraggingReorder ? "20px" : "4px",
          width: "100%",
          maxWidth: "450px",
          backgroundColor:
            isDraggingReorder && dragOverIndex === items.length
              ? "#8c52ff"
              : isDraggingReorder
              ? "rgba(140, 82, 255, 0.3)"
              : "transparent",
          borderRadius: "10px",
          transition: "all 0.2s ease",
          opacity: isDraggingReorder ? 1 : 0,
          border:
            isDraggingReorder && dragOverIndex === items.length
              ? "2px solid #8c52ff"
              : "2px solid transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          color: "white",
          fontWeight: "600",
        }}
      >
        {isDraggingReorder && dragOverIndex === items.length && "Drop here"}
      </div>
    </div>
  );
};

export default List;
