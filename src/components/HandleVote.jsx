import { Flex, Text } from "@radix-ui/themes";
import { ToastContainer, toast } from "react-toastify";
import React from "react";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { isSupportedChain } from "../utils";
import { getProvider } from "../constants/provider";
import { getProposalsContract } from "../constants/contracts";
import Proposal from "./Proposal";

const VoteHandler = ({ proposals, loading }) => {
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const handleVote = async (id) => {
    if (!isSupportedChain(chainId)) return toast.error("Wrong network");
    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();

    const contract = getProposalsContract(signer);

    try {
      const transaction = await contract.vote(id);
      console.log("transaction: ", transaction);
      const receipt = await transaction.wait();

      console.log("receipt: ", receipt);

      if (receipt.status) {
        return toast.success("vote successful!");
      }

      toast.error("vote failed!");
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
    <main className="mt-6">
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
  );
};

export default VoteHandler;
