import {
  Table,
  Avatar,
  TextField,
  IconButton,
  Button,
  Flex,
  Popover,
  Box,
  Text,
  Dialog,
  AlertDialog,
} from "@radix-ui/themes";
import {
  MagnifyingGlassIcon,
  DotsHorizontalIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";
import { formatDate } from "../../../utils";
import { useEffect, useState } from "react";
import type { Role, PagedData } from "../../../types";
import { DeleteConfirmation } from "./DeleteConfirmDialog";

import { useRoles } from "../../../hooks/useRoles";
import { Label } from "@radix-ui/themes/components/context-menu";

export const RolesTable = () => {
  const { roles, loading: roleLoading, error: roleError } = useRoles();

  const [rolesToDisplay, setRolesToDisplay] = useState<PagedData<Role> | null>(
    roles
  );
  const [activeRole, setActiveRole] = useState<Role | null>(null);

  useEffect(() => {
    if (roles) {
      setRolesToDisplay(roles);
    }
  }, [roles]);

  const editRoleName = (roleId: string) => {
    // This function would typically make an API call to edit the role
    fetch(`http://localhost:3002/role/${roleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "New Role Name" }),
    })
      .then((response) => {
        if (!response.ok) {
          console.error(`Failed to edit role with ID ${roleId}`);
        } else {
          console.log(`Role with ID ${roleId} edited successfully`);
          // Update the local state to reflect the changes
          setRolesToDisplay((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              data: prev.data.map((role) =>
                role.id === roleId ? { ...role, name: "New Role Name" } : role
              ),
            };
          });
        }
      })
      .catch((error) => {
        console.error(`Error deleting user with ID ${roleId}:`, error);
      });
  };

  return (
    <AlertDialog.Root>
      <Dialog.Root>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Created At</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          {roleLoading && (
            <Table.Body>
              {Array.from({ length: 10 }).map((_, index) => (
                <Table.Row key={index}>
                  <Table.Cell> - </Table.Cell>
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
            {rolesToDisplay && rolesToDisplay.data.length === 0 && (
              <Table.Row>
                <Table.Cell>No roles found.</Table.Cell>
              </Table.Row>
            )}
            {rolesToDisplay?.data.map((role) => (
              <Table.Row key={role.id}>
                <Table.Cell>{role.name}</Table.Cell>
                <Table.Cell>{role.description}</Table.Cell>
                <Table.Cell>{formatDate(role.createdAt)}</Table.Cell>
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
                        <Dialog.Trigger>
                          <Button
                            size="1"
                            variant="ghost"
                            color="gray"
                            onClick={() => setActiveRole(role)}
                          >
                            Edit Role
                          </Button>
                        </Dialog.Trigger>
                        <AlertDialog.Trigger>
                          <Button
                            size="1"
                            variant="ghost"
                            color="gray"
                            onClick={() => setActiveRole(role)}
                          >
                            Delete Role
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
                      // Handle button click
                    }}
                    disabled={!rolesToDisplay?.prev}
                  >
                    <Text
                      as="span"
                      highContrast={!rolesToDisplay?.prev ? false : true}
                    >
                      Previous
                    </Text>
                  </Button>
                  <Button
                    variant="outline"
                    color="gray"
                    size="1"
                    onClick={() => {
                      // Handle button click
                    }}
                    disabled={!rolesToDisplay?.next}
                  >
                    <Text
                      as="span"
                      highContrast={!rolesToDisplay?.next ? false : true}
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
          deletedType={`role`}
          deletedLabel={activeRole ? `${activeRole.name}` : ""}
          onDelete={() =>
            alert("Delete role functionality not implemented yet")
          }
          onCancel={() => setActiveRole(null)}
        />
        <Dialog.Content maxWidth="520px">
          <Dialog.Title>Edit Role</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Edit the details of the role.
          </Dialog.Description>

          <TextField.Root
            placeholder={activeRole ? activeRole.name : "Role Name"}
            id="edit-role-name"
            name="edit-role-name"
          >
            <Label>Role Name</Label>
            <TextField.Slot>
              <Pencil1Icon />
            </TextField.Slot>
          </TextField.Root>
        </Dialog.Content>
      </Dialog.Root>
    </AlertDialog.Root>
  );
};
