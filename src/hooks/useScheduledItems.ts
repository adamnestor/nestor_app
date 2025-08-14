import { useState } from "react";
import type { ScheduledBudgetItem } from "../types";

const API_BASE_URL = "http://localhost:8080/api/scheduled-items";

interface CreateScheduledItemData {
  budgetItemId: number;
  date: string; // 'YYYY-MM-DD' format
  amount?: number;
  name?: string;
}

interface UseScheduledItemsReturn {
  scheduledItems: ScheduledBudgetItem[];
  loading: boolean;
  error: string | null;
  loadMonthItems: (year: number, month: number) => Promise<void>;
  createScheduledItem: (itemData: CreateScheduledItemData) => Promise<boolean>;
  updateScheduledItem: (
    id: number,
    itemData: CreateScheduledItemData
  ) => Promise<boolean>;
  deleteScheduledItem: (id: number) => Promise<boolean>;
  getItemsForDate: (date: string) => ScheduledBudgetItem[];
}

export const useScheduledItems = (): UseScheduledItemsReturn => {
  const [scheduledItems, setScheduledItems] = useState<ScheduledBudgetItem[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load scheduled items for a specific month
  const loadMonthItems = async (year: number, month: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/month?year=${year}&month=${month}`
      );
      if (response.ok) {
        const data = await response.json();
        setScheduledItems(data);
      } else {
        setError("Failed to load scheduled items");
        console.error("Failed to load scheduled items");
      }
    } catch (error) {
      setError("Error loading scheduled items");
      console.error("Error loading scheduled items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create new scheduled item (drag & drop result)
  const createScheduledItem = async (
    itemData: CreateScheduledItemData
  ): Promise<boolean> => {
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
        // Refresh current month's items
        const currentDate = new Date();
        await loadMonthItems(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1
        );
        return true;
      } else {
        setError("Failed to create scheduled item");
        return false;
      }
    } catch (error) {
      setError("Error creating scheduled item");
      console.error("Error creating scheduled item:", error);
      return false;
    }
  };

  // Update existing scheduled item
  const updateScheduledItem = async (
    id: number,
    itemData: CreateScheduledItemData
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
        // Refresh current month's items
        const currentDate = new Date();
        await loadMonthItems(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1
        );
        return true;
      } else {
        setError("Failed to update scheduled item");
        return false;
      }
    } catch (error) {
      setError("Error updating scheduled item");
      console.error("Error updating scheduled item:", error);
      return false;
    }
  };

  // Delete scheduled item
  const deleteScheduledItem = async (id: number): Promise<boolean> => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh current month's items
        const currentDate = new Date();
        await loadMonthItems(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1
        );
        return true;
      } else {
        setError("Failed to delete scheduled item");
        return false;
      }
    } catch (error) {
      setError("Error deleting scheduled item");
      console.error("Error deleting scheduled item:", error);
      return false;
    }
  };

  // Helper function to get items for a specific date
  const getItemsForDate = (date: string): ScheduledBudgetItem[] => {
    return scheduledItems.filter((item) => item.date === date);
  };

  return {
    scheduledItems,
    loading,
    error,
    loadMonthItems,
    createScheduledItem,
    updateScheduledItem,
    deleteScheduledItem,
    getItemsForDate,
  };
};
