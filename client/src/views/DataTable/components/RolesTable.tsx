import {
  Table,
  Avatar,
  TextField,
  IconButton,
  Button,
  Flex,
  Popover,
  Box,
} from "@radix-ui/themes";
import { MagnifyingGlassIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { formatDate } from "../../../utils";
import { useEffect, useState } from "react";
import type { Role, PagedData } from "../../../types";

import { useRoles } from "../../../hooks/useRoles";

export const RolesTable = () => {
  const { roles, loading: roleLoading, error: roleError } = useRoles();

  const [rolesToDisplay, setRolesToDisplay] = useState<PagedData<Role> | null>(
    roles
  );

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
    <>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Created At</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>.</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        {roleLoading && (
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
                      onClick={() => editRoleName(role.id)}
                    >
                      <Button size="1" variant="ghost">
                        Edit Role
                      </Button>
                      <Button
                        size="1"
                        variant="ghost"
                        onClick={() => deleteRole(role.id)}
                      >
                        Delete Role
                      </Button>
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
                >
                  Previous
                </Button>
                <Button
                  variant="solid"
                  size="1"
                  onClick={() => {
                    // Handle button click
                  }}
                >
                  Next
                </Button>
              </Flex>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </>
  );
};
