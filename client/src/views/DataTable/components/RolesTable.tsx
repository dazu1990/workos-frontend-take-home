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
  PlusIcon,
} from "@radix-ui/react-icons";
import { formatDate } from "../../../utils";
import { useEffect, useState } from "react";
import type { Role, PagedData } from "../../../types";
import { DeleteConfirmation } from "./DeleteConfirmDialog";

import { useRoles } from "../../../hooks/useRoles";
import { useEditRole } from "../../../hooks/useEditRole";

export const RolesTable = () => {
  const { roles, loading: roleLoading, error: roleError, refetch } = useRoles();
  const { editRole } = useEditRole();

  const [rolesToDisplay, setRolesToDisplay] = useState<PagedData<Role> | null>(
    roles
  );
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [changedRole, setChangedRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (roles) {
      if (!searchTerm) {
        setRolesToDisplay(roles);
        return;
      }
      // Filter roles based on search term
      const filteredRoles = roles.data.filter((role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      // Create a new PagedData object to maintain structure
      const rolesData: PagedData<Role> = {
        data: filteredRoles,
        next: roles.next,
        prev: roles.prev,
        pages: roles.pages,
      };
      setRolesToDisplay(rolesData);
    }
  }, [roles, searchTerm]);

  return (
    <AlertDialog.Root>
      <Flex py="5">
        <Box flexGrow={`1`} pr={"2"}>
          <TextField.Root
            placeholder="Search Roles..."
            aria-label="Search roles by name"
            onChange={(e) => setSearchTerm(e.target.value)}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" aria-hidden="true" />
            </TextField.Slot>
          </TextField.Root>
        </Box>
        <Button
          variant="solid"
          aria-label="Add Role"
          onClick={() => {
            // Handle adding a new user
            console.log("Add Role button clicked");
          }}
        >
          <PlusIcon aria-hidden="true" /> Add Role
        </Button>
      </Flex>
      <Dialog.Root>
        <Table.Root variant="surface" aria-label="Roles table">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Created At</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell aria-label="Actions"></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          {roleLoading && !rolesToDisplay && (
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
                        aria-label={`Actions for ${role.name}`}
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
                        <Dialog.Trigger>
                          <Button
                            size="1"
                            variant="ghost"
                            color="gray"
                            onClick={() => setActiveRole(role)}
                            aria-label={`Edit ${role.name}`}
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
                            aria-label={`Delete ${role.name}`}
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
                    aria-label="Previous page"
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
                    aria-label="Next page"
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
        <Dialog.Content maxWidth="520px" aria-label="Edit role dialog">
          <Dialog.Title>Edit {activeRole?.name} Role</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            You can edit the details of the role here. Make sure to save your
            changes.
          </Dialog.Description>
          <Flex gap={"3"} direction="column">
            <Box>
              <label
                htmlFor="edit-role-name"
                style={{ display: "block", marginBottom: 4 }}
              >
                Name
              </label>
              <TextField.Root
                id="edit-role-name"
                name="edit-role-name"
                aria-label="Role name"
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
            {/* <Box>
              <label htmlFor="edit-role-description" style={{ display: "block", marginBottom: 4 }}>
                Description
              </label>
              <TextField.Root
                id="edit-role-description"
                name="edit-role-description"
                aria-label="Role description"
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
            </Box> */}
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
                aria-label="Cancel editing role"
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button
                variant="classic"
                aria-label="Save role changes"
                onClick={async () => {
                  if (activeRole) {
                    await editRole(activeRole.id, { ...changedRole });
                    setActiveRole(null);
                    setChangedRole(null);
                    localStorage.removeItem("roles");
                    refetch(); // Trigger refetch after edit
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
