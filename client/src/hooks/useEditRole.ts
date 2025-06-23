import type { Role } from "../types";
export const useEditRole = () => {
  const editRole = async (roleId: string, updatedRole: Partial<Role>) => {
    const response = await fetch(`http://localhost:3002/roles/${roleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRole),
    });
    if (!response.ok) {
      throw new Error(`Failed to edit role with ID ${roleId}`);
    }
    return response.json();
  };
  return { editRole };
};
