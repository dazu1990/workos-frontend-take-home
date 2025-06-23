export const useDeleteUser = () => {
  const deleteUser = async (userId: string) => {
    const response = await fetch(`http://localhost:3002/users/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete user with ID ${userId}`);
    }
    return response.json();
  };
  return { deleteUser };
};
