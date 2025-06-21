import { Container, Tabs } from "@radix-ui/themes";
import { UserTable } from "./components/UserTable";
import { RolesTable } from "./components/RolesTable";

function App() {
  return (
    <Container>
      <Tabs.Root defaultValue="users" orientation="horizontal">
        <Tabs.List>
          <Tabs.Trigger value="users">Users</Tabs.Trigger>
          <Tabs.Trigger value="roles">Roles</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="users">
          <UserTable></UserTable>
        </Tabs.Content>
        <Tabs.Content value="roles">
          <RolesTable></RolesTable>
        </Tabs.Content>
      </Tabs.Root>
    </Container>
  );
}

export default App;
