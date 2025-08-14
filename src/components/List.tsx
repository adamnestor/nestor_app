import React from "react";
import ListItem from "./ListItem";
import type { ListProps, ScheduledBudgetItem } from "../types";

interface ExtendedListProps extends ListProps {
  scheduledItems: ScheduledBudgetItem[];
  currentMonth: Date;
}

const List: React.FC<ExtendedListProps> = ({
  items,
  onEdit,
  onDelete,
  scheduledItems,
  currentMonth,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        alignItems: "center",
      }}
    >
      {items.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          scheduledItems={scheduledItems}
          currentMonth={currentMonth}
        />
      ))}
    </div>
  );
};

export default List;
