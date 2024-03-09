import { useCallback } from "react";
import { isSupportedChain } from "../utils";
import { isAddress } from "ethers";
import { getProvider } from "../constants/provider";
import { getProposalsContract } from "../constants/contracts";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { toast } from "react-toastify";

const useGiveRightToVote = (address) => {
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  return useCallback(async () => {
    if (!isSupportedChain(chainId)) {
      toast.error("Wrong network");
      return;
    }

    if (!isAddress(address)) {
      toast.error("Invalid address");
      return;
    }

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();
    const contract = getProposalsContract(signer);

    try {
      const estimatedGas = await contract.giveRightToVote.estimateGas(address);
      const transaction = await contract.giveRightToVote(address, {
        gasLimit: estimatedGas,
      });
      console.log("transaction: ", transaction);
      const receipt = await transaction.wait();

      console.log("receipt: ", receipt);

      if (receipt.status) {
        toast.success("Give right to vote successful!");
      } else {
        toast.error("Give right to vote failed!");
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("An error occurred");
    }
  }, [address, chainId, walletProvider]);
};

export default useGiveRightToVote;
