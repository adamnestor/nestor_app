import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:8080/api/balance-adjustments";

export interface BalanceAdjustment {
  id?: number;
  date: string;
  amount: number;
}

interface UseBalanceAdjustmentsReturn {
  adjustments: BalanceAdjustment[];
  loading: boolean;
  error: string | null;
  createOrUpdateAdjustment: (date: string, amount: number) => Promise<boolean>;
  deleteAdjustment: (id: number) => Promise<boolean>;
  getMostRecentAdjustment: () => BalanceAdjustment | null;
  hasBalanceAdjustment: (date: string) => boolean;
  getEffectiveStartingBalance: (date: string) => number;
  refreshAdjustments: () => Promise<void>;
}

export const useBalanceAdjustments = (): UseBalanceAdjustmentsReturn => {
  const [adjustments, setAdjustments] = useState<BalanceAdjustment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all balance adjustments from API
  const fetchAdjustments = async (): Promise<void> => {
    try {
      setError(null);
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        setAdjustments(data);
      } else {
        setError("Failed to fetch balance adjustments");
        console.error("Failed to fetch balance adjustments");
      }
    } catch (error) {
      setError("Error fetching balance adjustments");
      console.error("Error fetching balance adjustments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create or update a balance adjustment
  const createOrUpdateAdjustment = async (
    date: string,
    amount: number
  ): Promise<boolean> => {
    try {
      setError(null);
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date, amount }),
      });

      if (response.ok) {
        await fetchAdjustments(); // Refresh the list
        return true;
      } else {
        setError("Failed to save balance adjustment");
        return false;
      }
    } catch (error) {
      setError("Error saving balance adjustment");
      console.error("Error saving balance adjustment:", error);
      return false;
    }
  };

  // Delete a balance adjustment
  const deleteAdjustment = async (id: number): Promise<boolean> => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchAdjustments(); // Refresh the list
        return true;
      } else {
        setError("Failed to delete balance adjustment");
        return false;
      }
    } catch (error) {
      setError("Error deleting balance adjustment");
      console.error("Error deleting balance adjustment:", error);
      return false;
    }
  };

  // Get the most recent balance adjustment (for pin emoji display)
  const getMostRecentAdjustment = (): BalanceAdjustment | null => {
    if (adjustments.length === 0) return null;

    // Adjustments are already sorted by date desc from the API
    return adjustments[0];
  };

  // Check if a specific date has the most recent balance adjustment
  const hasBalanceAdjustment = (date: string): boolean => {
    const mostRecent = getMostRecentAdjustment();
    return mostRecent?.date === date;
  };

  // Get effective starting balance for a given date
  const getEffectiveStartingBalance = (date: string): number => {
    // Find the most recent adjustment on or before the given date
    const applicableAdjustments = adjustments
      .filter((adj) => adj.date <= date)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (applicableAdjustments.length > 0) {
      return applicableAdjustments[0].amount;
    }

    return 2500; // Default starting balance
  };

  // Public refresh function
  const refreshAdjustments = async (): Promise<void> => {
    setLoading(true);
    await fetchAdjustments();
  };

  // Load adjustments on mount
  useEffect(() => {
    fetchAdjustments();
  }, []);

  return {
    adjustments,
    loading,
    error,
    createOrUpdateAdjustment,
    deleteAdjustment,
    getMostRecentAdjustment,
    hasBalanceAdjustment,
    getEffectiveStartingBalance,
    refreshAdjustments,
  };
};
