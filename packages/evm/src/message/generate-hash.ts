import { EquitoMessage, Hex } from "@equito-sdk/core";
import { keccakAsHex } from "@polkadot/util-crypto";
import { parseAbiParameters, encodeAbiParameters } from "viem";

export const generateHash = (message: EquitoMessage): Hex =>
  keccakAsHex(
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
