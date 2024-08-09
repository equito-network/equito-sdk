import { AbstractProvider, LogDescription, Interface } from "ethers";
import { EquitoMessage } from "@equito-sdk/core";
import { routerAbi } from "@equito-sdk/evm";

/**
 * @title getMessageAndDataByTxHash
 * @description Fetches and decodes the `MessageSendRequested` event from a transaction's logs using its hash.
 * @dev This function retrieves the transaction receipt and parses the logs to extract the relevant event data.
 * 
 * @param {AbstractProvider} provider - The Ethers.js provider to interact with the blockchain.
 * @param {string} routerContractAddress - The address of the router contract emitting the event.
 * @param {string} txHash - The transaction hash for which the logs are to be retrieved and parsed.
 * 
 * @returns {Promise<{ message: EquitoMessage, messageData: string } | null>} 
 * - Returns an object containing the decoded `message` and `messageData` if successful, otherwise throws an error.
 * 
 * @throws {Error} 
 * - Throws an error if the transaction receipt is not found, if no logs match the contract address, or if log parsing fails.
 * 
 * @example
 * const provider = ...;  // Your Ethers.js provider
 * const routerContractAddress = '0x...';  // The router contract address
 * const txHash = '0x...';  // The transaction hash
 * 
 * getMessageAndDataByTxHash(provider, routerContractAddress, txHash)
 *     .then(result => {
 *         if (result) {
 *             console.log('Decoded Message:', result.message);
 *             console.log('Decoded Message Data:', result.messageData);
 *         }
 *     })
 *     .catch(error => {
 *         console.error('Error:', error.message);
 *     });
 */
async function getMessageAndDataByTxHash(provider: AbstractProvider, routerContractAddress: string, txHash: string): Promise<{ message: EquitoMessage, messageData: string } | null> {
    try {
        const receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt) {
            throw new Error(`Transaction receipt not found for hash: ${txHash}`);
        }

        // Filter logs for the router contract address
        const routerLogs = receipt.logs.filter(log => log.address.toLowerCase() === routerContractAddress.toLowerCase());
        if (routerLogs.length === 0) {
            throw new Error(`No logs found for the contract address: ${routerContractAddress}`);
        }

        // Create an Interface instance to decode the logs
        const iface = new Interface(routerAbi);

        // Decode the logs
        for (const log of routerLogs) {
            try {
                const parsedLog: LogDescription | null = iface.parseLog(log);
                if (parsedLog && parsedLog.name === 'MessageSendRequested') {
                    const message = parsedLog.args.message as EquitoMessage;
                    const messageData = parsedLog.args.messageData as string;
                    return { message, messageData };
                }
            } catch (parseError) {
                throw new Error(`Failed to parse log: ${parseError}`);
            }
        }

        throw new Error('No relevant MessageSendRequested log found.');

    } catch (error) {
        throw new Error(`Error fetching or decoding log: ${error}`);
    }
}