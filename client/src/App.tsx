import { Flex, Text, Button, Container } from "@radix-ui/themes";
import { useState } from "react";
import "./App.css";

import { useUsers } from "./hooks/useUsers";

function App() {
  const { users, loading: userLoading, error: userError } = useUsers();

  if (userLoading) return <div>Loading...</div>;
  if (userError) return <div>Error: {userError}</div>;

  console.log("User Data:", users);

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
