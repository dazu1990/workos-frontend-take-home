import { Container, Tabs } from "@radix-ui/themes";
import { useState } from "react";
import "./App.css";

import { useUsers } from "./hooks/useUsers";
import { useRoles } from "./hooks/useRoles";

function App() {
  const { users, loading: userLoading, error: userError } = useUsers();
  const { roles, loading: roleLoading, error: roleError } = useRoles();

  if (userLoading || roleLoading) return <div>Loading...</div>;
  if (userError) return <div>Error: {userError}</div>;
  if (roleError) return <div>Error: {roleError}</div>;

  console.log("User Data:", users);
  console.log("Role Data:", roles);

  return (
    <Container>
      <Tabs.Root defaultValue="users" orientation="horizontal">
        <Tabs.List>
          <Tabs.Trigger value="users">Users</Tabs.Trigger>
          <Tabs.Trigger value="roles">Roles</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="users">this is the users tab</Tabs.Content>
        <Tabs.Content value="roles">this is the roles tab</Tabs.Content>
      </Tabs.Root>
    </Container>
  );
}

export default App;
