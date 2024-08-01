import { EquitoMessage, Hex } from "@equito-sdk/core";
import { AbiCoder, keccak256 } from "ethers";

export const generateHash = (message: EquitoMessage): Hex =>
  keccak256(
    AbiCoder.defaultAbiCoder().encode(
      [
        "tuple(uint256, uint256, bytes32, bytes32, uint256, bytes32, bytes32, bytes32)",
      ],
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
  ) as Hex;
