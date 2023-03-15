import { createPublicClient, http } from "viem";
import { canto } from "viem/chains";

const client = createPublicClient({
  chain: canto,
  // transport: http("https://jsonrpc.canto.nodestake.top"),
  transport: http("https://canto.slingshot.finance"),
});

export const fetchTokensFromJSONRPC = async ({
  fromBlock,
  toBlock,
}: {
  fromBlock: bigint;
  toBlock: bigint;
}) => {
  const event = {
    address: process.env.CNS_CONTRACT_ADDRESS,
    inputs: [
      {
        indexed: true,
        name: "registrant",
        type: "address",
      },
      {
        indexed: true,

        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        name: "expiry",
        type: "uint256",
      },
      {
        indexed: false,
        name: "price",
        type: "uint256",
      },
    ],
    name: "Register",
    type: "event",
  } as const;

  const logs = await client.getLogs({
    event,
    fromBlock: fromBlock,
    toBlock: toBlock,
  });

  return logs;
};
