import { useEffect, useState } from "react";
import { getProposalsContract } from "../constants/contracts";
import { readOnlyProvider } from "../constants/provider";
import { decodeBytes32String } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useProposals = () => {
  const [proposals, setProposals] = useState({
    loading: true,
    data: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contract = getProposalsContract(readOnlyProvider);
        const res = await contract.getAllProposals();
        const converted = res.map((item) => ({
          name: decodeBytes32String(item.name),
          voteCount: item.voteCount,
        }));
        setProposals({
          loading: false,
          data: converted,
        });
        // toast.success("Proposals fetched successfully");
      } catch (error) {
        console.error("Error fetching proposals: ", error);
        toast.error("Failed to fetch proposals");
        setProposals((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  return proposals;
};

export default useProposals;
