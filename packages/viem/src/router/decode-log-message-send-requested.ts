import { EquitoMessageWithData } from "@equito-sdk/core";
import { Log, parseEventLogs } from "viem";
import { routerAbi } from "@equito-sdk/evm";

/**
 * Decodes a `MessageSendRequested` event logs into a list of {@link EquitoMessageWithData} object.
 * This function extracts the `message` and `messageData` fields from the event logs
 * using the specified ABI.
 *
 * @param {Log<bigint, number, false>[]} logs {@link Log<bigint, number, false>[]} The log object.
 * @returns A list of {@link EquitoMessageWithData[]} object containing the decoded message and message data.
 *
 *
 * @example
 * ```
 * const logs = ['0x...', ..., '0x...'];  // Replace with actual logs data
 * const result = decodeLogMessageSendRequested(logs);
 * console.log('Decoded Message:', result[0].message);
 * console.log('Decoded Message Data:', result[0].messageData);
 * ```
 */
export function decodeLogMessageSendRequested(
  logs: Log<bigint, number, false>[]
): EquitoMessageWithData[] {
  return parseEventLogs({ abi: routerAbi, logs }).flatMap(
    ({ eventName, args }) =>
      eventName === "MessageSendRequested"
        ? [
            {
              message: args.message,
              messageData: args.messageData,
            },
          ]
        : []
  );
}
