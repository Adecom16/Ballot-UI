import { useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import { isSupportedChain } from "../utils";
import { isAddress } from "ethers";
import { getProvider } from "../constants/providers";
import { getProposalsContract } from "../constants/contracts";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";

const useDelegate = (address) => {
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  return useCallback(async () => {
    if (!isSupportedChain(chainId)) return toast.error("Wrong network");
    if (!isAddress(address)) return toast.error("Invalid address");
    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();

    const contract = getProposalsContract(signer);

    try {
      const transaction = await contract.delegate(address);
      console.log("transaction: ", transaction);

      const receipt = await transaction.wait();
      console.log("receipt: ", receipt);

      if (receipt.status) {
        return toast.success("delegation successful!");
      }

      toast.error("delegation failed!");
    } catch (error) {
      console.error("error: ", error);
    }
  }, [address, chainId, walletProvider]);
};

export default useDelegate;