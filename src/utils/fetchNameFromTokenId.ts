import { cnsABI } from "../constants/cnsABI";
import { createPublicClient, http } from "viem";
import { canto } from "viem/chains";

const client = createPublicClient({
  chain: canto,
  // transport: http("https://node-cantonameservice.xyz/"),
  transport: http("https://canto.slingshot.finance"),
});
export async function fetchNameFromTokenId({ tokenId }: { tokenId: string }) {
  const name = await client.readContract({
    abi: cnsABI,
    address: process.env.CNS_CONTRACT_ADDRESS,
    functionName: "tokenToName",
    args: [BigInt(tokenId)],
  });

  return name ?? null;
}
