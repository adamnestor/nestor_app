import React from "react";
import ListItem from "./ListItem";
import type { ListProps } from "../types";

const List: React.FC<ListProps> = ({ items, onEdit, onDelete }) => {
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
        />
      ))}
    </div>
  );
};

export default List;
