import { Hex } from "@equito-sdk/core";

/**
 * The configuration object for creating an EquitoClient.
 */
export type EquitoClientCreateConfig = {
  /**
   * The endpoint of the Equito node.
   */
  wsProvider: string;
  /**
   * The endpoint of the Equito archive node.
   */
  archiveWsProvider: string;
};

/**
 * The event emitted when a signature is submitted.
 */
export type SubmitSignatureEvent = {
  phase: { ApplyExtrinsic: string };
  event: {
    method: string;
    data: {
      /**
       * The message hash in {@link Hex} format.
       */
      message: Hex;
      /**
       * The validator in {@link Hex} format.
       */
      who: Hex;
    };
  };
};

/**
 * The arguments for the listenForSignatures function.
 */
export type ListenForSignaturesArgs = {
  /**
   * The message hash in {@link Hex} format.
   */
  messageHash: Hex;
  /**
   * The chain selector.
   */
  chainSelector: number;
  /**
   * The number of blocks to search.
   */
  listenTimeout?: number;
  /**
   * The callback function to call when a signature is submitted.
   * @param args The arguments for the callback function.
   */
  onConfirm: (args: {
    /**
     * The message proof in {@link Hex} format.
     */
    proof: Hex;
    /**
     * The timestamp in milliseconds of the confirmation.
     */
    timestamp: number;
  }) => Promise<void>;
  /**
   * The callback function to call when a there's an error.
   */
  onError?: (error: unknown) => void;
};

/**
 * The arguments for the getConfirmationTime function.
 */
export type GetConfirmationTimeArgs = {
  /**
   * The message hash in {@link Hex} format.
   */
  messageHash: Hex;
  /**
   * The chain selector.
   */
  chainSelector: number;
  /**
   * The timestamp in milliseconds to start searching from.
   */
  fromTimestamp?: number;
  /**
   * The number of blocks to search.
   */
  listenTimeout?: number;
};

/**
 * The return type of the getConfirmationTime function.
 */
export type GetConfirmationTimeReturnType = {
  /**
   * The timestamp in milliseconds of the confirmation.
   */
  timestamp: number;
  /**
   * The message proof in {@link Hex} format.
   */
  proof: Hex;
};
