import { useState, useEffect } from "react";
import type { Role, PagedData } from "../types";
export const useRoles = () => {
  const [roles, setRoles] = useState<PagedData<Role> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const cached = localStorage.getItem("roles");
      if (cached) {
        setRoles(JSON.parse(cached));
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:3002/roles");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setRoles(result);
      localStorage.setItem("roles", JSON.stringify(result));
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
    roles,
    loading,
    error,
    refetch: fetchData, // Bonus: manual refetch function
  };
};
