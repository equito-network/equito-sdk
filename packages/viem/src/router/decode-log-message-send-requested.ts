import { EquitoMessageWithData } from "@equito-sdk/core";
import { decodeEventLog, Log } from "viem";
import { routerAbi } from "@equito-sdk/evm";

/**
 * Decodes a `MessageSendRequested` event logs into a {@link EquitoMessageWithData} object.
 * This function extracts the `message` and `messageData` fields from the event logs
 * using the specified ABI.
 *
 * @param {Log} log {@link Log} The log object.
 * @returns A {@link EquitoMessageWithData} object containing the decoded message and message data if exists.
 *
 * @throws Throws an error if the data & topics lengths to not conform to the event on the ABI.
 *
 * @example
 * ```
 * const logs = ['0x...', ..., '0x...'];  // Replace with actual logs data
 * const result = decodeLogMessageSendRequested(logs);
 * console.log('Decoded Message:', result[0].message);
 * console.log('Decoded Message Data:', result[0].messageData);
 * ```
 */
export function decodeLogMessageSendRequested({
  topics,
  data,
}: Log): EquitoMessageWithData | undefined {
  try {
    const { args, eventName } = decodeEventLog({
      abi: routerAbi,
      data,
      topics,
    });

    if (eventName === "MessageSendRequested") {
      return {
        message: args.message,
        messageData: args.messageData,
      };
    }
  } catch {
    throw new Error("Failed to decode log message send requested");
  }
}
