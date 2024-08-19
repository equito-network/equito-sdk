import { EquitoMessage, Hex } from "@equito-sdk/core";
import { encodeAbiParameters, keccak256, parseAbiParameters } from "viem";

/**
 * Generates the Keccak256 hash of an EquitoMessage object.
 *
 * @param message {@link EquitoMessage} - The message object to be hashed.
 * @returns The Keccak256 hash of the encoded message, represented as a hexadecimal string.
 */
export const generateHash = (message: EquitoMessage): Hex =>
  keccak256(
    encodeAbiParameters(
      parseAbiParameters(
        "uint256, uint256, bytes32, bytes32, uint256, bytes32, bytes32, bytes32"
      ),
      [
        message.blockNumber,
        message.sourceChainSelector,
        message.sender.lower,
        message.sender.upper,
        message.destinationChainSelector,
        message.receiver.lower,
        message.receiver.upper,
        message.hashedData,
      ]
    )
  );
