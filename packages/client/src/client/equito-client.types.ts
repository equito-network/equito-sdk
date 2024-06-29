import { Hex } from "@equito-sdk/core";

export type EquitoClientCreateArgs = {
  wsProvider: string;
  archiverWsProvider: string;
};

export type EquitoEvent = {
  phase: { ApplyExtrinsic: string };
  event: {
    method: string;
    data: { message: Hex; who: Hex };
  };
};

export type ListenForSignaturesArgs = {
  messageHash: Hex;
  chainSelector: number;
  onConfirm: (args: { proof: Hex; timestamp: number }) => Promise<void>;
  onError?: (error: unknown) => void;
};

export type GetProofTimestamp = {
  messageHash: Hex;
  chainSelector: number;
  fromTimestamp?: number;
  listenTimeout?: number;
};
