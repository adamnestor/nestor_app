export interface BudgetItem {
  id: number;
  name: string;
  amount: number;
  type: "expense" | "income";
}

export interface ScheduledBudgetItem {
  id: number;
  budgetItemId: number;
  date: string; // 'YYYY-MM-DD' format
  amount?: number; // Optional override
  name?: string; // Optional override
  // We'll get the original item details through budgetItemId
  budgetItem?: BudgetItem; // Populated from backend
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
