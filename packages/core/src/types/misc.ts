export type Hex = `0x${string}`;

/**
 * Represents a blockchain supported by the Equito protocol.
 */
export interface EquitoChain {
  /**
   * The unique identifier for the blockchain network in the Equito Protocol.
   */
  chainSelector: number;
  /**
   * Different names or aliases for the blockchain.
   * This can include common names, abbreviations, or other recognized identifiers.
   */
  names: string[];
}
