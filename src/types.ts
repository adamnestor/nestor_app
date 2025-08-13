export interface BudgetItem {
  id: number;
  name: string;
  amount: number;
  type: "expense" | "income";
}

export interface ListItemProps {
  item: BudgetItem;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export interface ListProps {
  items: BudgetItem[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}
