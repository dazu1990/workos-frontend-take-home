import { Tabs } from "@radix-ui/themes";
import { UsersTable } from "./components/UsersTable";
import { RolesTable } from "./components/RolesTable";

export const DataTables = () => {
  return (
    <Tabs.Root
      defaultValue="users"
      orientation="horizontal"
      aria-label="User and Role Data Tables"
    >
      <Tabs.List aria-label="Data Table Tabs">
        <Tabs.Trigger
          value="users"
          aria-controls="users-tabpanel"
          aria-label="Show Users Table"
        >
          Users
        </Tabs.Trigger>
        <Tabs.Trigger
          value="roles"
          aria-controls="roles-tabpanel"
          aria-label="Show Roles Table"
        >
          Roles
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content
        value="users"
        id="users-tabpanel"
        aria-label="Users Table Panel"
        tabIndex={0}
      >
        <UsersTable />
      </Tabs.Content>
      <Tabs.Content
        value="roles"
        id="roles-tabpanel"
        aria-label="Roles Table Panel"
        tabIndex={0}
      >
        <RolesTable />
      </Tabs.Content>
    </Tabs.Root>
  );
};
