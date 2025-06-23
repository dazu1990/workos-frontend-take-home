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
import { useEditRole } from "../../../hooks/useEditRole";

export const RolesTable = () => {
  const { roles, loading: roleLoading, error: roleError } = useRoles();
  const { editRole } = useEditRole();

  const [rolesToDisplay, setRolesToDisplay] = useState<PagedData<Role> | null>(
    roles
  );
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [changedRole, setChangedRole] = useState<Role | null>(null);

  useEffect(() => {
    if (roles) {
      setRolesToDisplay(roles);
    }
  }, [roles]);

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
          <Flex gap={"3"} direction="column">
            <Box>
              <Label htmlFor="edit-role-name">Name</Label>
              <TextField.Root
                id="edit-role-name"
                name="edit-role-name"
                onChange={(e) => {
                  if (activeRole) {
                    setChangedRole({
                      ...activeRole,
                      name: e.target.value,
                      description:
                        changedRole?.description || activeRole.description,
                    });
                  }
                }}
                defaultValue={activeRole ? activeRole.name : ""}
                autoFocus
              ></TextField.Root>
            </Box>
            <Box>
              <Label htmlFor="edit-role-description">Description: </Label>
              <TextField.Root
                id="edit-role-description"
                name="edit-role-description"
                onChange={(e) => {
                  if (activeRole) {
                    setChangedRole({
                      ...activeRole,
                      name: changedRole?.name || activeRole.name,
                      description: e.target.value,
                    });
                  }
                }}
                defaultValue={activeRole ? activeRole.description : ""}
              ></TextField.Root>
            </Box>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button
                variant="surface"
                color="gray"
                onClick={() => {
                  setActiveRole(null);
                  setChangedRole(null);
                }}
                highContrast
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button
                variant="classic"
                onClick={() => {
                  if (activeRole) {
                    editRole(activeRole.id, { ...changedRole });
                    setActiveRole(null);
                    setChangedRole(null);
                  }
                }}
              >
                Save Changes
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </AlertDialog.Root>
  );
};
