import { createPublicClient, http } from "viem";
import { canto } from "viem/chains";

const client = createPublicClient({
  chain: canto,
  transport: http("https://jsonrpc.canto.nodestake.top"),
});
export async function fetchTimestampFromBlockNumber({
  blockNumber,
}: {
  blockNumber: bigint;
}) {
  const timestamp = await client.getBlock({
    blockNumber,
  });

  return timestamp;
}
