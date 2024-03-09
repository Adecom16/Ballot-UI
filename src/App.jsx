import React, { useState } from "react";
import { Box, Container, Flex, Text } from "@radix-ui/themes";
import { configureWeb3Modal } from "./connection";
import "@radix-ui/themes/styles.css";
import Header from "./components/Header";
import Proposal from "./components/Proposal";
import DelegateVote from "./components/DelegateVote";
import useProposals from "./hooks/useProposals";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { isSupportedChain } from "./utils";
import { getProvider } from "./constants/provider";
import { getProposalsContract } from "./constants/contracts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

configureWeb3Modal();

function App() {
  const { loading, data: proposals } = useProposals();
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [error, setError] = useState(null);

  const handleVote = async (id) => {
    if (!isSupportedChain(chainId)) return setError("Wrong network");

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();
    const contract = getProposalsContract(signer);

    try {
      const transaction = await contract.vote(id);
      console.log("transaction: ", transaction);
      const receipt = await transaction.wait();

      console.log("receipt: ", receipt);

      if (receipt.status) {
        toast.success("Vote successful!");
      } else {
        setError("Vote failed!");
      }
    } catch (error) {
      console.log(error);
      let errorText;
      if (error.reason === "Has no right to vote") {
        errorText = "You have no right to vote";
      } else if (error.reason === "Already voted.") {
        errorText = "You have already voted";
      } else {
        errorText = "An unknown error occurred";
      }

      toast.error(errorText);
    }
  };

  return (
    <Container>
      <Header />
      <main className="mt-6">
        <ToastContainer />

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
                handleVote={handleVote}
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
