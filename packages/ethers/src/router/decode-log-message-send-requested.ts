import { Interface, LogDescription } from "ethers";
import { EquitoMessage, Hex } from "@equito-sdk/core";
import { routerAbi } from "@equito-sdk/evm";

/**
 * @title decodeLog_MessageSendRequested
 * @description Decodes the `MessageSendRequested` event log from the transaction logs.
 * @dev This function extracts the `message` and `messageData` fields from the event logs, using the specified ABI.
 * 
 * @param {string} data - The non-indexed data portion of the log.
 * @param {readonly string[]} topics - The array of topics (indexed parameters) for the log.
 * 
 * @returns {{ message: EquitoMessage, messageData: string } | null} 
 * - Returns an object containing the decoded `message` and `messageData` if successful, otherwise throws an error.
 * 
 * @throws {Error} 
 * - Throws an error if the log could not be parsed or if the event structure does not match the expected ABI.
 * 
 * @example
 * const logData = '0x...';  // Replace with actual log data
 * const topics = ['0x...', '0x...'];  // Replace with actual log topics
 * const result = decodeLog_MessageSendRequested(logData, topics);
 * if (result) {
 *     console.log('Decoded Message:', result.message);
 *     console.log('Decoded Message Data:', result.messageData);
 * } else {
 *     console.error('Failed to decode the log.');
 * }
 */
export function decodeLog_MessageSendRequested(data: string, topics: readonly string[]): { message: EquitoMessage, messageData: string } | null {
    let logdata = {
        topics,
        data
    };
    let iface = new Interface(routerAbi);
    const parsedLog: LogDescription | null = iface.parseLog(logdata);

    if (parsedLog) {
        const message: EquitoMessage = parsedLog.args.message as EquitoMessage;
        const messageData: string = parsedLog.args.messageData as string;

        return { message, messageData };
    } else {
        throw new Error("Log could not be parsed");
    }
}