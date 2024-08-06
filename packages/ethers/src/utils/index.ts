import { EquitoMessage, Hex } from "@equito-sdk/core";
import { AbiCoder, keccak256 } from "ethers";

/**
 * @title generateHash
 * @notice Generates a Keccak256 hash of an EquitoMessage object.
 * @dev This function encodes the EquitoMessage structure in `EquitoMessage` specific format and then hashes it.
 * 
 * @param {EquitoMessage} message - The message object to be hashed.
 * @returns {Hex} The Keccak256 hash of the encoded message, represented as a hexadecimal string.
 */
export const generateHash = (message: EquitoMessage): Hex =>
  keccak256(
    AbiCoder.defaultAbiCoder().encode(
      [
        "tuple(uint256,uint256,tuple(bytes32 lower,bytes32 upper),uint256,tuple(bytes32 lower,bytes32 upper),bytes32)",
      ],
      [message],
    ),
  ) as Hex;
