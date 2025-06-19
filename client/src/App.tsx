import { Flex, Text, Button } from "@radix-ui/themes";
import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Flex direction="column" gap="2">
      <Text>Text test</Text>
      <Button>button cta</Button>
    </Flex>
  );
}

export default App;
