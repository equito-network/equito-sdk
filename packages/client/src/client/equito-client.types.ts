import { Hex } from "@equito-sdk/core";

/**
 * EquitoClientCreateConfig is the configuration object for creating an EquitoClient.
 */
export type EquitoClientCreateConfig = {
  /**
   * The endpoint of the Equito node.
   */
  wsProvider: string;
  /**
   * The endpoint of the Equito archiver node.
   */
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
  listenTimeout?: number;
  onConfirm: (args: { proof: Hex; timestamp: number }) => Promise<void>;
  onError?: (error: unknown) => void;
};

export type GetConfirmationTimeArgs = {
  messageHash: Hex;
  chainSelector: number;
  fromTimestamp?: number;
  listenTimeout?: number;
};
