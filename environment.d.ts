import type { Address } from "viem";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CNS_CONTRACT_ADDRESS: Address;
    }
  }
}

export {};
