import { type PrismaClient } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const getTokenDataSchema = z.object({ tokenId: z.string() });
const writeTokenDataSchema = z.object({
  tokenId: z.string(),
  name: z.string(),
  registrant: z.string(),
  expiry: z.bigint(),
  registeredAt: z.bigint(),
  blockNumber: z.bigint(),
});

type TokenDataInput = z.infer<typeof getTokenDataSchema>;
type WriteTokenDataInput = z.infer<typeof writeTokenDataSchema>;

export async function getSingleTokenData({
  prisma,
  input,
}: {
  prisma: PrismaClient;
  input: TokenDataInput;
}) {
  const tokenData = await prisma.token.findUnique({
    where: {
      tokenId: input.tokenId,
    },
  });

  return tokenData;
}

export async function writeTokenData({
  prisma,
  input,
}: {
  prisma: PrismaClient;
  input: WriteTokenDataInput;
}) {
  const tokenData = await prisma.token.create({
    data: {
      tokenId: input.tokenId,
      name: input.name,
      registrant: input.registrant,
      expiry: input.expiry,
      registeredAt: input.registeredAt,
      blockNumber: input.blockNumber,
    },
  });

  return tokenData;
}

export const tokenRouter = createTRPCRouter({
  writeToken: publicProcedure
    .input(writeTokenDataSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.token.create({
          data: {
            tokenId: input.tokenId,
            name: input.name,
            registrant: input.registrant,
            expiry: input.expiry,
            registeredAt: input.registeredAt,
            blockNumber: input.blockNumber,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.token.findMany();
  }),
  getOne: publicProcedure
    .input(
      z.object({
        tokenId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.token.findUnique({
        where: {
          tokenId: input.tokenId,
        },
      });
    }),
});
