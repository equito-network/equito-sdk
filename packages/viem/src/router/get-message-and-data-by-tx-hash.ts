import { EquitoMessageWithData } from "@equito-sdk/core";
import { decodeLogMessageSendRequested } from "./decode-log-message-send-requested";
import { Hex, parseEventLogs, PublicClient } from "viem";
import { routerAbi } from "@equito-sdk/evm";

/**
 * The arguments for the getMessagesByTxHash function.
 */
export type GetMessagesByTxHashArgs = {
  /**
   * The public client that will be used to read the contract.
   */
  publicClient: PublicClient;
  /**
   * The router contract in {@link Hex} format.
   */
  routerContract: Hex;
  /**
   *  The transaction hash in {@link Hex} format for which the logs are to be retrieved and parsed.
   * */
  txHash: Hex;
};

/**
 * Fetches and decodes all the `MessageSendRequested` events of a transaction, given its hash.
 *
 * @param {GetMessagesByTxHashArgs} args {@link GetMessagesByTxHashArgs}
 *
 * @returns A promise that resolves to the decoded messages and message data.
 *
 * @throws Throws an error if the transaction receipt is not found.
 *
 * @example
 * ```
 * const publicClient = ...;  // Your viem provider
 * const routerContract = '0x...';  // The router contract address
 * const txHash = '0x...';  // The transaction hash
 *
 * getMessagesByTxHash({publicClient, routerContract, txHash})
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
export async function getMessagesByTxHash({
  publicClient,
  routerContract,
  txHash,
}: GetMessagesByTxHashArgs): Promise<EquitoMessageWithData[]> {
  try {
    const { logs } = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    return logs.flatMap((log) => {
      if (log.address.toLowerCase() === routerContract.toLowerCase()) {
        return decodeLogMessageSendRequested(log) || [];
      }
      return [];
    });
  } catch (error) {
    throw new Error(
      `Unable to get messages for the transaction with hash: ${txHash}`
    );
  }
}
