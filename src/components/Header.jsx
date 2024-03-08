import { Flex } from "@radix-ui/themes";
import GiveRightToVoteComponent from "./GiveRightToVoteComponent";

export default function Header() {
  return (
    <div className="flex justify-between items-center">
      <div>Ballot</div>
      <Flex gap={"4"} align={"center"}>
        <GiveRightToVoteComponent />
        <w3m-button />
      </Flex>
    </div>
  );
}
