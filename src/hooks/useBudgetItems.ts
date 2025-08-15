import { useState, useEffect } from "react";
import type { BudgetItem } from "../types";

const API_BASE_URL = "http://localhost:8080/api/items";

interface CreateItemData {
  name: string;
  amount: number;
  type: "expense" | "income";
}

interface ReorderRequest {
  id: number;
  displayOrder: number;
}

interface UseBudgetItemsReturn {
  items: BudgetItem[];
  loading: boolean;
  error: string | null;
  createItem: (itemData: CreateItemData) => Promise<boolean>;
  updateItem: (id: number, itemData: CreateItemData) => Promise<boolean>;
  deleteItem: (id: number) => Promise<boolean>;
  reorderItems: (reorderRequests: ReorderRequest[]) => Promise<boolean>;
  refreshItems: () => Promise<void>;
}

export const useBudgetItems = (): UseBudgetItemsReturn => {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all items from API
  const fetchItems = async (): Promise<void> => {
    try {
      setError(null);
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        setError("Failed to fetch items");
        console.error("Failed to fetch items");
      }
    } catch (error) {
      setError("Error fetching items");
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create new item
  const createItem = async (itemData: CreateItemData): Promise<boolean> => {
    try {
      setError(null);
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (response.ok) {
        await fetchItems(); // Refresh the list
        return true;
      } else {
        setError("Failed to create item");
        return false;
      }
    } catch (error) {
      setError("Error creating item");
      console.error("Error creating item:", error);
      return false;
    }
  };

  // Update existing item
  const updateItem = async (
    id: number,
    itemData: CreateItemData
  ): Promise<boolean> => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (response.ok) {
        await fetchItems(); // Refresh the list
        return true;
      } else {
        setError("Failed to update item");
        return false;
      }
    } catch (error) {
      setError("Error updating item");
      console.error("Error updating item:", error);
      return false;
    }
  };

  // Reorder items
  const reorderItems = async (
    reorderRequests: ReorderRequest[]
  ): Promise<boolean> => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/reorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reorderRequests),
      });

      if (response.ok) {
        await fetchItems(); // Refresh the list to get updated order
        return true;
      } else {
        setError("Failed to reorder items");
        return false;
      }
    } catch (error) {
      setError("Error reordering items");
      console.error("Error reordering items:", error);
      return false;
    }
  };

  // Delete item
  const deleteItem = async (id: number): Promise<boolean> => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchItems(); // Refresh the list
        return true;
      } else {
        setError("Failed to delete item");
        return false;
      }
    } catch (error) {
      setError("Error deleting item");
      console.error("Error deleting item:", error);
      return false;
    }
  };

  // Public refresh function
  const refreshItems = async (): Promise<void> => {
    setLoading(true);
    await fetchItems();
  };

  // Load items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    reorderItems,
    refreshItems,
  };
};
