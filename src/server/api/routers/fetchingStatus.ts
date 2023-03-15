import { type PrismaClient } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export async function getLastFetchedBlock({
  prisma,
}: {
  prisma: PrismaClient;
}) {
  const fetchingStatus = await prisma.fetchingStatus.findFirst({
    select: {
      lastFetchedBlock: true,
    },
  });

  return fetchingStatus;
}

export async function setLastFetchedBlock({
  prisma,
  input,
}: {
  prisma: PrismaClient;
  input: { lastFetchedBlock: number };
}) {
  const fetchingStatus = await prisma.fetchingStatus.update({
    where: {
      id: "1",
    },
    data: {
      lastFetchedBlock: input.lastFetchedBlock,
    },
  });

  return fetchingStatus;
}

export const fetchingStatusRouter = createTRPCRouter({
  getLastFetchedBlock: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.fetchingStatus.findFirst({
      select: {
        lastFetchedBlock: true,
      },
    });
  }),
  setLastFetchedBlock: publicProcedure
    .input(
      z.object({
        lastFetchedBlock: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.fetchingStatus.update({
        where: {
          id: "1",
        },
        data: {
          lastFetchedBlock: input.lastFetchedBlock,
        },
      });
    }),
});
