import { Tabs } from "@radix-ui/themes";
import { UsersTable } from "./components/UsersTable";
import { RolesTable } from "./components/RolesTable";

export const DataTables = () => {
  return (
    <Tabs.Root defaultValue="users" orientation="horizontal">
      <Tabs.List>
        <Tabs.Trigger value="users">Users</Tabs.Trigger>
        <Tabs.Trigger value="roles">Roles</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="users">
        <UsersTable></UsersTable>
      </Tabs.Content>
      <Tabs.Content value="roles">
        <RolesTable></RolesTable>
      </Tabs.Content>
    </Tabs.Root>
  );
};
