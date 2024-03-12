import Header from "./components/Header";
import { Box, Container, Flex } from "@radix-ui/themes";
import { ToastContainer, Slide } from "react-toastify";
import { configureWeb3Modal } from "./connection";
import "@radix-ui/themes/styles.css";
// import Header from "./component/Header";
import DelegateVote from "./components/DelegateVote";
import useProposals from "./hooks/useProposals";
import VoteHandler from "./components/HandleVote";
import useNumberOfVoters from "./hooks/useNumberOfVoter";
configureWeb3Modal();

function App() {
  const { loading, data: proposals } = useProposals();

  const EligibleVoters = useNumberOfVoters();

  return (
    <Container>
      <Header />
      <main className="mt-6">
        {/* <Box mb="4">
        </Box> */}
        <Flex mb="4" justify="between">
          <DelegateVote />
          <span>Eligible Voters: {EligibleVoters}</span>
        </Flex>

        <VoteHandler proposals={proposals} loading={loading} />
      </main>
      <ToastContainer
        theme="colored"
        transition={Slide}
        hideProgressBar={true}
      />
    </Container>
  );
}

export default App;
