import { Interface, Log, LogDescription } from "ethers";
import { EquitoMessage } from "@equito-sdk/core";
import { routerAbi } from "@equito-sdk/evm";
import { MessageAndData } from "./get-message-and-data-by-tx-hash";

/**
 * @title decodeLogMessageSendRequested
 * @description Decodes the `MessageSendRequested` event log from a transaction's logs.
 * @dev This function extracts the `message` and `messageData` fields from the event logs
 *      using the specified ABI and returns them as a `MessageAndData` object.
 *
 * @param {Log} log - The log object containing the non-indexed data (`data`) and topics (`topics`)
 *                    from the transaction log.
 *
 * @returns {MessageAndData}
 * - Returns an object containing `message` and `messageData` if successful.
 *
 * @throws {Error}
 * - Throws an error if the log could not be parsed or if the event structure does not match the expected ABI.
 *
 * @example
 * const logData = '0x...';  // Replace with actual log data
 * const topics = ['0x...', '0x...'];  // Replace with actual log topics
 * const result = decodeLogMessageSendRequested({ data: logData, topics });
 * console.log('Decoded Message:', result.message);
 * console.log('Decoded Message Data:', result.messageData);
 */
export function decodeLogMessageSendRequested({
  data,
  topics,
}: Log): MessageAndData {
  let logdata = {
    topics,
    data,
  };
  let iface = new Interface(routerAbi);
  const parsedLog: LogDescription | null = iface.parseLog(logdata);

  if (parsedLog && parsedLog.name === "MessageSendRequested") {
    const message: EquitoMessage = parsedLog.args.message as EquitoMessage;
    const messageData: string = parsedLog.args.messageData as string;

    return { message, messageData };
  } else {
    throw new Error("Log could not be parsed");
  }
}
