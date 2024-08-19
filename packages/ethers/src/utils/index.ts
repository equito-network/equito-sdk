import { EquitoMessage, Hex } from "@equito-sdk/core";
import { AbiCoder, keccak256 } from "ethers";

/**
 * Generates the Keccak256 hash of an EquitoMessage object.
 *
 * @param message {@link EquitoMessage} - The message object to be hashed.
 * @returns The Keccak256 hash of the encoded message, represented as a hexadecimal string.
 */
export const generateHash = (message: EquitoMessage): Hex =>
  keccak256(
    AbiCoder.defaultAbiCoder().encode(
      [
        "tuple(uint256 blockNumber,uint256 sourceChainSelector,tuple(bytes32 lower,bytes32 upper) sender,uint256 destinationChainSelector,tuple(bytes32 lower,bytes32 upper) receiver,bytes32 hashedData)",
      ],
      [message]
    )
  ) as Hex;
