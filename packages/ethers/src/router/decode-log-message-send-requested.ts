import { Interface, Log, LogDescription } from "ethers";
import { EquitoMessage, EquitoMessageWithData, Hex } from "@equito-sdk/core";
import { routerAbi } from "@equito-sdk/evm";

/**
 * Decodes a `MessageSendRequested` event log into a {@link EquitoMessageWithData} object.
 * This function extracts the `message` and `messageData` fields from the event logs
 * using the specified ABI.
 *
 * @param {Log} log {@link Log} The log object containing the non-indexed data (`data`)
 * and topics (`topics`) from the transaction log.
 * @returns A {@link EquitoMessageWithData} object containing the decoded message and message data if exist, otherwise undefined.
 *
 *
 * @example
 * ```
 * const logData = '0x...';  // Replace with actual log data
 * const topics = ['0x...', '0x...'];  // Replace with actual log topics
 * const result = decodeLogMessageSendRequested({ data: logData, topics });
 * console.log('Decoded Message:', result.message);
 * console.log('Decoded Message Data:', result.messageData);
 * ```
 */
export function decodeLogMessageSendRequested({
  data,
  topics,
}: Log): EquitoMessageWithData | undefined {
  const logdata = {
    topics,
    data,
  };
  const iface = new Interface(routerAbi);
  const parsedLog: LogDescription | null = iface.parseLog(logdata);

  if (parsedLog && parsedLog.name === "MessageSendRequested") {
    const message: EquitoMessage = parsedLog.args.message as EquitoMessage;
    const messageData: Hex = parsedLog.args.messageData as Hex;

    return { message, messageData };
  }
}
