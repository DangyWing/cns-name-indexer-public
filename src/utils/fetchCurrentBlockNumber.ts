import { createPublicClient, http } from "viem";
import { canto } from "viem/chains";

const client = createPublicClient({
  chain: canto,
  transport: http("https://jsonrpc.canto.nodestake.top"),
});
export async function fetchCurrentBlocknumber() {
  const blockNumber = await client.getBlockNumber();

  return blockNumber;
}
