import { useState, useEffect } from "react";
import type { User, PagedData } from "../types";
export const useUsers = () => {
  const [users, setUsers] = useState<PagedData<User> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const cached = localStorage.getItem("users");
      if (cached) {
        setUsers(JSON.parse(cached));
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:3002/users");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setUsers(result);
      localStorage.setItem("users", JSON.stringify(result));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Run once on mount
  useEffect(() => {
    fetchData();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchData, // Bonus: manual refetch function
  };
};
