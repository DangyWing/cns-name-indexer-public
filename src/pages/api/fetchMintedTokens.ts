import type { NextApiRequest, NextApiResponse } from "next";
import { fetchTokensFromJSONRPC } from "../../utils/fetchTokensFromJSONRPC";
import { fetchNameFromTokenId } from "~/utils/fetchNameFromTokenId";
import { fetchTimestampFromBlockNumber } from "~/utils/fetchTimestampFromBlockNumber";
import { prisma } from "~/server/db";
import { writeTokenData } from "~/server/api/routers/token";
import { getLastFetchedBlock } from "~/server/api/routers/fetchingStatus";
import { fetchCurrentBlocknumber } from "~/utils/fetchCurrentBlockNumber";
import { setLastFetchedBlock } from "~/server/api/routers/fetchingStatus";

// deployed block 2864574,

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const lastFetchedBlockResult = await getLastFetchedBlock({ prisma });
  const lastFetchedBlock = BigInt(
    lastFetchedBlockResult?.lastFetchedBlock ?? 0
  );

  const currentBlockNumber = await fetchCurrentBlocknumber();

  const blocksPerQuery = 1000n;

  const fromBlock = lastFetchedBlock + 1n;

  const toBlock =
    fromBlock + blocksPerQuery > currentBlockNumber
      ? currentBlockNumber
      : fromBlock + blocksPerQuery;

  // console.log(`FETCHING FROM ${fromBlock} TO ${toBlock}`);
  // console.log(`WHICH IS ${toBlock - fromBlock} BLOCKS`);

  const tokenResult = await fetchTokensFromJSONRPC({
    fromBlock: fromBlock,
    toBlock: toBlock,
  });

  const cleanedTokenData = await Promise.all(
    tokenResult.map(async (token: (typeof tokenResult)[0]) => {
      const tokenId = token.args.id.toString();
      const name = await fetchNameFromTokenId({ tokenId });
      const expiry = token.args.expiry;
      const registrant = token.args.registrant;
      const blockNumber = token.blockNumber ?? 0n;

      const { timestamp } = await fetchTimestampFromBlockNumber({
        blockNumber: blockNumber,
      });

      const data = {
        registeredAt: timestamp,
        tokenId: tokenId,
        name: name,
        registrant: registrant,
        expiry: expiry,
        blockNumber: blockNumber,
      };

      await writeTokenData({
        prisma: prisma,
        input: data,
      });

      return {
        registeredAt: timestamp,
        tokenId: tokenId,
        name: name,
        registrant: registrant,
        expiry: expiry,
        blockNumber: token.blockNumber,
      };
    })
  );

  await setLastFetchedBlock({
    prisma: prisma,
    input: {
      lastFetchedBlock: Number(toBlock),
    },
  });

  res.send({
    savedTokenCount: cleanedTokenData.length,
    status: "success",
    fromBlock: fromBlock.toString(),
    toBlock: toBlock.toString(),
  });
}
