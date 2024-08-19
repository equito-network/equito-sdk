import { AbstractProvider, LogDescription, Interface } from "ethers";
import { EquitoMessage } from "@equito-sdk/core";
import { routerAbi } from "@equito-sdk/evm";
import { decodeLogMessageSendRequested } from "./decode-log-message-send-requested";

export interface MessageAndData {
  message: EquitoMessage;
  messageData: string;
}

/**
 * @title getMessagesByTxHash
 * @description Fetches and decodes the `MessageSendRequested` events from a transaction's logs using its hash.
 * @dev This function retrieves the transaction receipt and parses the logs to extract the relevant event data.
 *
 * @param {AbstractProvider} provider - The Ethers.js provider to interact with the blockchain.
 * @param {string} routerContractAddress - The address of the router contract emitting the event.
 * @param {string} txHash - The transaction hash for which the logs are to be retrieved and parsed.
 *
 * @returns {Promise<MessageAndData[]>}
 * - Returns an array of objects containing the decoded `message` and `messageData` if successful.
 *
 * @throws {Error}
 * - Throws an error if the transaction receipt is not found.
 *
 * @example
 * const provider = ...;  // Your Ethers.js provider
 * const routerContractAddress = '0x...';  // The router contract address
 * const txHash = '0x...';  // The transaction hash
 *
 * getMessagesByTxHash(provider, routerContractAddress, txHash)
 *     .then(results => {
 *         results.forEach(result => {
 *             console.log('Decoded Message:', result.message);
 *             console.log('Decoded Message Data:', result.messageData);
 *         });
 *     })
 *     .catch(error => {
 *         console.error('Error:', error);
 *     });
 */
export async function getMessagesByTxHash(
  provider: AbstractProvider,
  routerContractAddress: string,
  txHash: string
): Promise<MessageAndData[]> {
  const receipt = await provider.getTransactionReceipt(txHash);
  if (!receipt) {
    throw new Error(`Transaction receipt not found for hash: ${txHash}`);
  }

  return receipt.logs.flatMap((log) => {
    if (log.address.toLowerCase() === routerContractAddress.toLowerCase()) {
      return [decodeLogMessageSendRequested(log)];
    }
    return [];
  });
}
