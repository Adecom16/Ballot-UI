import { Box, Container, Flex, Text } from "@radix-ui/themes";
import { configureWeb3Modal } from "./connection";
import "@radix-ui/themes/styles.css";
import Header from "./components/Header";
import Proposal from "./components/Proposal";
import DelegateVote from "./components/DelegateVote";
import useProposals from "./hooks/useProposals";

configureWeb3Modal();

function App() {
  const { loading, data: proposals } = useProposals();
  return (
    <Container>
      <Header />
      <main className="mt-6">
        <Box mb="4">
          <DelegateVote />
        </Box>

        <Flex wrap={"wrap"} gap={"6"}>
          {loading ? (
            <Text>Loading...</Text>
          ) : proposals.length !== 0 ? (
            proposals.map((item, index) => (
              <Proposal
                key={index}
                name={item.name}
                handleVote={() => {}}
                id={index}
                voteCount={Number(item.voteCount)}
              />
            ))
          ) : (
            <Text>Could not get proposals!!</Text>
          )}
        </Flex>
      </main>
    </Container>
  );
}

export default App;
