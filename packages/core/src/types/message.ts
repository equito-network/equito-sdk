import { type Hex } from "./misc";

/**
 * Composes an address from two parts, `lower` and `upper`, each represented as a 32-byte hexadecimal string.
 * This type is used in networks where basic types are 32 bytes long, for example EVM-based networks.
 */
export type CompositeAddress = {
  lower: Hex;
  upper: Hex;
};

/**
 * The ubiquitous message structure for cross-chain communication in the Equito protocol.
 * Includes details about the source and destination chains, the sender and receiver applications, and validation data.
 */
export type EquitoMessage = {
  blockNumber: bigint;
  sourceChainSelector: bigint;
  sender: CompositeAddress;
  destinationChainSelector: bigint;
  receiver: CompositeAddress;
  hashedData: Hex;
};

/**
 * An {@link EquitoMessage} object paired with the actual data it carries.
 */
export type EquitoMessageWithData = {
  message: EquitoMessage;
  messageData: Hex;
};
