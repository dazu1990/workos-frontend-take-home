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
  AlertDialog,
  Text,
  Strong,
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
import { useDeleteUser } from "../../../hooks/useDeleteUser";

export const UsersTable = () => {
  const {
    users,
    loading: userLoading,
    error: userError,
    refetch: refetchUsers,
  } = useUsers();
  const {
    roles,
    loading: roleLoading,
    error: roleError,
    refetch: refetchRoles,
  } = useRoles();
  const { deleteUser } = useDeleteUser();
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

  const handleUserDeletion = async (userId: string) => {
    try {
      await deleteUser(userId);
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("roles");
      localStorage.removeItem("users");
      setActiveUser(null);
      refetchUsers();
      refetchRoles();
    }
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
    <AlertDialog.Root>
      <Flex py="5">
        <Box flexGrow={`1`} pr={"2"}>
          <TextField.Root
            placeholder="Search by name..."
            aria-label="Search users by name"
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" aria-hidden="true" />
            </TextField.Slot>
          </TextField.Root>
        </Box>
        <Button
          variant="solid"
          aria-label="Add User"
          onClick={() => {
            // Handle adding a new user
            console.log("Add User button clicked");
          }}
        >
          <PlusIcon aria-hidden="true" /> Add User
        </Button>
      </Flex>
      <Table.Root variant="surface" aria-label="Users table">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Joined</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell aria-label="Actions"></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        {(userLoading || roleLoading) && !usersToDisplay && (
          <Table.Body>
            {Array.from({ length: 10 }).map((_, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <Flex gap={"3"}>
                    <Avatar
                      radius="full"
                      size={"1"}
                      fallback="U"
                      aria-label="User avatar"
                    />
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
                    aria-label="More actions"
                  >
                    <DotsHorizontalIcon aria-hidden="true" />
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
          {userError && (
            <Table.Row>
              <Table.Cell>
                <Text as="span" color="red">
                  <Strong>{userError}</Strong>
                </Text>
              </Table.Cell>
            </Table.Row>
          )}
          {roleError && (
            <Table.Row>
              <Table.Cell>
                <Text as="span" color="red">
                  <Strong>{roleError}</Strong>
                </Text>
              </Table.Cell>
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
                    aria-label={`Avatar for ${user.first}${user.last ? ` ${user.last}` : ""}`}
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
                      aria-label={`Actions for ${user.first}${user.last ? ` ${user.last}` : ""}`}
                    >
                      <DotsHorizontalIcon aria-hidden="true" />
                    </IconButton>
                  </Popover.Trigger>
                  <Popover.Content>
                    <Flex
                      direction="column"
                      gap="2"
                      justify={"start"}
                      align={"start"}
                    >
                      <Button
                        size="1"
                        variant="ghost"
                        color="gray"
                        aria-label={`Edit ${user.first}${user.last ? ` ${user.last}` : ""}`}
                      >
                        <Text as="span" highContrast>
                          Edit User
                        </Text>
                      </Button>
                      <AlertDialog.Trigger>
                        <Button
                          size="1"
                          variant="ghost"
                          color="gray"
                          onClick={() => setActiveUser(user)}
                          aria-label={`Delete ${user.first}${user.last ? ` ${user.last}` : ""}`}
                        >
                          <Text as="span" highContrast>
                            Delete User
                          </Text>
                        </Button>
                      </AlertDialog.Trigger>
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
                    alert("Previous button not implemented yet");
                  }}
                  disabled={!usersToDisplay?.prev}
                  aria-label="Previous page"
                >
                  <Text
                    as="span"
                    highContrast={!usersToDisplay?.prev ? false : true}
                  >
                    Previous
                  </Text>
                </Button>
                <Button
                  variant="outline"
                  color="gray"
                  size="1"
                  onClick={() => {
                    alert("Next button not implemented yet");
                  }}
                  disabled={!usersToDisplay?.next}
                  aria-label="Next page"
                >
                  <Text
                    as="span"
                    highContrast={!usersToDisplay?.next ? false : true}
                  >
                    Next
                  </Text>
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
    </AlertDialog.Root>
  );
};
