import { AbstractProvider, LogDescription, Interface } from "ethers";
import { EquitoMessage } from "@equito-sdk/core";
import { routerAbi } from "@equito-sdk/evm";

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
 * @returns {Promise<MessageAndData[] | null>}
 * - Returns an array of objects containing the decoded `message` and `messageData` if successful, otherwise throws an error.
 *
 * @throws {Error}
 * - Throws an error if the transaction receipt is not found or if log parsing fails.
 *
 * @example
 * const provider = ...;  // Your Ethers.js provider
 * const routerContractAddress = '0x...';  // The router contract address
 * const txHash = '0x...';  // The transaction hash
 *
 * getMessageAndDataByTxHash(provider, routerContractAddress, txHash)
 *     .then(results => {
 *         if (results) {
 *             results.forEach(result => {
 *                 console.log('Decoded Message:', result.message);
 *                 console.log('Decoded Message Data:', result.messageData);
 *             });
 *         }
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
    try {
        const receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt) {
            throw new Error(`Transaction receipt not found for hash: ${txHash}`);
        }

        // Create an Interface instance to decode the logs
        const iface = new Interface(routerAbi);

        return receipt.logs.flatMap((log) => {
            // Filter logs for the router contract address
            if (log.address.toLowerCase() === routerContractAddress.toLowerCase()) {
                try {
                    const parsedLog: LogDescription | null = iface.parseLog(log);
                    if (parsedLog && parsedLog.name === "MessageSendRequested") {
                        const message: EquitoMessage = parsedLog.args.message;
                        const messageData: string = parsedLog.args.messageData;
                        return [{ message, messageData }];
                    }
                } catch (parseError) {
                    throw new Error(`Failed to parse log: ${parseError}`);
                }
            }
            return [];
        });
    } catch (error) {
        throw new Error(`Error fetching or decoding log: ${error}`);
    }
}
