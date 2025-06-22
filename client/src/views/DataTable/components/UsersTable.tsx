import {
  Table,
  Avatar,
  TextField,
  IconButton,
  Button,
  Flex,
  Popover,
  Box,
  Dialog,
  Text,
} from "@radix-ui/themes";
import {
  MagnifyingGlassIcon,
  DotsHorizontalIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { formatDate } from "../../../utils";
import { useEffect, useState } from "react";
import type { UserWithRole, PagedData } from "../../../types";
import { DeleteConfirmation } from "./DeleteConfirmDialog";
import { useUsers } from "../../../hooks/useUsers";
import { useRoles } from "../../../hooks/useRoles";

export const UsersTable = () => {
  const { users, loading: userLoading, error: userError } = useUsers();
  const { roles, loading: roleLoading, error: roleError } = useRoles();
  const [activeUser, setActiveUser] = useState<UserWithRole | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [usersToDisplay, setUsersToDisplay] =
    useState<PagedData<UserWithRole> | null>(null);

  const addRolesToUsers = () => {
    if (!users || !roles) return null;

    const usersWithRoleNames = users.data.map((user) => {
      const role = roles.data.find((role) => role.id === user.roleId);
      return {
        ...user,
        roleName: role ? role.name : "Unknown Role",
      };
    });

    return { ...users, data: usersWithRoleNames };
  };

  const removeUserFromDisplay = (userId: string) => {
    setUsersToDisplay((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        data: prev.data.filter((user) => user.id !== userId),
        next: prev.next ?? null,
        prev: prev.prev ?? null,
        pages: prev.pages ?? null,
      };
    });
  };

  const handleUserDeletion = (userId: string) => {
    // This function would typically make an API call to delete the user
    fetch(`http://localhost:3002/users/${userId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          console.error(`Failed to delete user with ID ${userId}`);
        } else {
          console.log(`User with ID ${userId} deleted successfully`);
          removeUserFromDisplay(userId);
        }
      })
      .catch((error) => {
        console.error(`Error deleting user with ID ${userId}:`, error);
      });
  };

  useEffect(() => {
    if (users && roles) {
      const usersWithRoleNames = addRolesToUsers();

      const filteredUsers = filterBySearchTerm(usersWithRoleNames, searchTerm);

      setUsersToDisplay(filteredUsers);
    }
  }, [users, roles, searchTerm]);

  const filterBySearchTerm = (
    inputUsers: PagedData<UserWithRole> | null,
    searchTerm: string
  ): PagedData<UserWithRole> | null => {
    if (!searchTerm) return inputUsers;
    const filteredUsers = inputUsers?.data.filter((user) =>
      `${user.first} ${user.last || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    if (!inputUsers) return null;
    return {
      ...inputUsers,
      data: filteredUsers || [],
    };
  };

  return (
    <Dialog.Root>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Joined</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>.</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        {(userLoading || roleLoading) && (
          <Table.Body>
            {Array.from({ length: 10 }).map((_, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <Flex gap={"3"}>
                    <Avatar radius="full" size={"1"} fallback="U" />
                    ...
                  </Flex>
                </Table.Cell>
                <Table.Cell> - </Table.Cell>
                <Table.Cell> - </Table.Cell>
                <Table.Cell>
                  <IconButton
                    variant="ghost"
                    radius="full"
                    color="gray"
                    size="1"
                    disabled={true}
                  >
                    <DotsHorizontalIcon />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        )}

        <Table.Body>
          {usersToDisplay && usersToDisplay.data.length === 0 && (
            <Table.Row>
              <Table.Cell>No users found.</Table.Cell>
            </Table.Row>
          )}
          {usersToDisplay?.data.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell>
                <Flex gap={"3"}>
                  <Avatar
                    src={user.photo}
                    radius="full"
                    size={"1"}
                    fallback={`${user.first.charAt(0)}${user.last ? user.last.charAt(0) : ""}`}
                  />
                  {user.first}
                  {user.last ? ` ${user.last}` : ""}
                </Flex>
              </Table.Cell>
              <Table.Cell>{user.roleName}</Table.Cell>
              <Table.Cell>{formatDate(user.createdAt)}</Table.Cell>
              <Table.Cell>
                <Popover.Root>
                  <Popover.Trigger>
                    <IconButton
                      variant="ghost"
                      radius="full"
                      color="gray"
                      size="1"
                    >
                      <DotsHorizontalIcon />
                    </IconButton>
                  </Popover.Trigger>
                  <Popover.Content>
                    <Flex
                      direction="column"
                      gap="2"
                      justify={"start"}
                      align={"start"}
                    >
                      <Button size="1" variant="ghost">
                        Edit User
                      </Button>
                      <Dialog.Trigger>
                        <Button
                          size="1"
                          variant="ghost"
                          onClick={() => setActiveUser(user)}
                        >
                          Delete User
                        </Button>
                      </Dialog.Trigger>
                    </Flex>
                  </Popover.Content>
                </Popover.Root>
              </Table.Cell>
            </Table.Row>
          ))}
          <Table.Row>
            <Table.Cell colSpan={4}>
              <Flex justify="end" align="center" gap={"2"}>
                <Button
                  variant="outline"
                  size="1"
                  onClick={() => {
                    // Handle button click
                  }}
                  disabled={!usersToDisplay?.prev}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  color="gray"
                  size="1"
                  onClick={() => {
                    // Handle button click
                  }}
                  disabled={!usersToDisplay?.next}
                >
                  Next
                </Button>
              </Flex>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
      <DeleteConfirmation
        deletedType={`user`}
        deletedLabel={
          activeUser ? `${activeUser.first} ${activeUser.last}` : ""
        }
        onDelete={() => activeUser && handleUserDeletion(activeUser.id)}
        onCancel={() => setActiveUser(null)}
      />
    </Dialog.Root>
  );
};
