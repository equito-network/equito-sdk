import { Hex } from "./misc";

export type EquitoAddress = {
  lower: Hex;
  upper: Hex;
};

export type EquitoMessage = {
  blockNumber: bigint;
  sourceChainSelector: bigint;
  sender: EquitoAddress;
  destinationChainSelector: bigint;
  receiver: EquitoAddress;
  hashedData: Hex;
};
