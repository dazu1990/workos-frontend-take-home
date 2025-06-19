import { Flex, Text, Button, Container } from "@radix-ui/themes";
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
      <Flex direction={"column"} gap={"3"}>
        <Text>Text test</Text>
        <Button>button cta</Button>
      </Flex>
    </Container>
  );
}

export default App;
