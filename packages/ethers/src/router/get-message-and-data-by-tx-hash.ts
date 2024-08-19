import { AbstractProvider } from "ethers";
import { EquitoMessageWithData } from "@equito-sdk/core";
import { decodeLogMessageSendRequested } from "./decode-log-message-send-requested";

/**
 * Fetches and decodes all the `MessageSendRequested` events of a transaction, given its hash.
 *
 * @param {AbstractProvider} provider {@link AbstractProvider} The Ethers.js provider to interact with the blockchain.
 * @param {string} routerContractAddress The address of the router contract emitting the event.
 * @param {string} txHash The transaction hash for which the logs are to be retrieved and parsed.
 *
 * @returns A {@link Promise<EquitoMessageWithData[]>} that resolves to the decoded messages and message data.
 *
 * @throws Throws an error if the transaction receipt is not found.
 *
 * @example
 * ```
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
 * ```
 */
export async function getMessagesByTxHash(
  provider: AbstractProvider,
  routerContractAddress: string,
  txHash: string
): Promise<EquitoMessageWithData[]> {
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
