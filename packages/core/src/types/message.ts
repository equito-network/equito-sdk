import { type Hex } from "./misc";

/**
 * @title EquitoAddress
 * @description Represents an address in the Equito protocol, consisting of two parts: `lower` and `upper`.
 *
 * @property {Hex} lower - The lower part of the address.
 * @property {Hex} upper - The upper part of the address.
 */
export type EquitoAddress = {
  lower: Hex;
  upper: Hex;
};

/**
 * @title  EquitoMessage
 * @description Represents a message structure used in the Equito protocol, including details about the source and destination chains, the sender and receiver addresses, and associated data.
 *
 * @property {bigint} blockNumber - The block number, at the source chain, at which the message was created.
 * @property {bigint} sourceChainSelector - The identifier for the source chain where the message originated.
 * @property {EquitoAddress} sender - The address of the sender on the source chain.
 * @property {bigint} destinationChainSelector - The identifier for the destination chain where the message is intended.
 * @property {EquitoAddress} receiver - The address of the receiver on the destination chain.
 * @property {Hex} hashedData - The hashed data associated with the message.
 */
export type EquitoMessage = {
  blockNumber: bigint;
  sourceChainSelector: bigint;
  sender: EquitoAddress;
  destinationChainSelector: bigint;
  receiver: EquitoAddress;
  hashedData: Hex;
};

/**
 * @title  EquitoMessageWithData
 * @description Represents a complete message along with its associated data, used in the Equito protocol.
 *
 * @property {EquitoMessage} message - The core message structure containing chain and address details.
 * @property {Hex} messageData - Additional data associated with the message, typically in a hashed format.
 */
export type EquitoMessageWithData = {
  message: EquitoMessage;
  messageData: Hex;
};
