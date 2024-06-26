import { type Hex } from "@equito-sdk/core";

export const getProof = (signatures: Hex[]): Hex =>
  signatures.reduce<Hex>(
    (acc, curr) => (!curr ? acc : ((acc + curr.split("0x").slice(-1)) as Hex)),
    "0x"
  );
