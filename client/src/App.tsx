import { Container, Tabs, Table, Avatar } from "@radix-ui/themes";
import { formatDate } from "./utils";
import { useEffect, useState } from "react";
import "./App.css";
import type { UserWithRole, PagedData } from "./types";

import { useUsers } from "./hooks/useUsers";
import { useRoles } from "./hooks/useRoles";

function App() {
  const { users, loading: userLoading, error: userError } = useUsers();
  const { roles, loading: roleLoading, error: roleError } = useRoles();

  const [usersWithRoles, setUsersWithRoles] =
    useState<PagedData<UserWithRole> | null>(null);

  useEffect(() => {
    if (users && roles) {
      const usersWithRoleNames = users.data.map((user) => {
        const role = roles.data.find((role) => role.id === user.roleId);
        return {
          ...user,
          roleName: role ? role.name : "Unknown Role",
        };
      });
      setUsersWithRoles({ ...users, data: usersWithRoleNames });
    }
  }, [users, roles]);

  // if (userLoading || roleLoading) return <div>Loading...</div>;
  if (userError) return <div>Error: {userError}</div>;
  if (roleError) return <div>Error: {roleError}</div>;

  console.log("User Data:", users);
  console.log("Role Data:", roles);

  return (
    <Container>
      <Tabs.Root defaultValue="users" orientation="horizontal">
        <Tabs.List>
          <Tabs.Trigger value="users" disabled={userLoading}>
            Users
          </Tabs.Trigger>
          <Tabs.Trigger value="roles" disabled={roleLoading}>
            Roles
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="users">
          {userLoading && <div>Loading users...</div>}
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Joined</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {usersWithRoles && usersWithRoles.data.length === 0 && (
                <Table.Row>
                  <Table.Cell>No users found.</Table.Cell>
                </Table.Row>
              )}
              {usersWithRoles?.data.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>
                    <Avatar
                      src={user.photo}
                      radius="full"
                      size={"1"}
                      fallback={`${user.first.charAt(0)}${user.last ? user.last.charAt(0) : ""}`}
                    />
                    {user.first}
                    {user.last ? ` ${user.last}` : ""}
                  </Table.Cell>
                  <Table.Cell>{user.roleName}</Table.Cell>
                  <Table.Cell>{formatDate(user.createdAt)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Tabs.Content>
        <Tabs.Content value="roles">this is the roles tab</Tabs.Content>
      </Tabs.Root>
    </Container>
  );
}

export default App;
