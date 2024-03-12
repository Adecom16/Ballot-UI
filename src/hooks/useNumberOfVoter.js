import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { wssProvider } from "../constants/provider";

const useNumberOfVoters = () => {
  const [value, setValue] = useState(0);

  const eventListerner = useCallback((log) => {
    console.log("testing event: ", log);
  }, []);

  useEffect(() => {
    const filter = {
      address: import.meta.env.VITE_ballot_contract_address,
      topics: [ethers.id("GiveRightToVote(address,uint256)")],
    };
    wssProvider.getLogs({ ...filter, fromBlock: 5465128 }).then((events) => {
      setValue(events.length + 1);
    });

    wssProvider.on(filter, eventListerner);

    return () => wssProvider.off(filter, eventListerner);
  }, []);

  return value;
};

export default useNumberOfVoters;
