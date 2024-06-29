import { ExtractAbiEvent } from "abitype";
import { Log } from "viem";
import { routerAbi } from "@equito-sdk/evm";

export type MessageSendRequestedLog = Log<
  bigint,
  number,
  false,
  ExtractAbiEvent<typeof routerAbi, "MessageSendRequested">,
  undefined
>;

export type MessageDeliveredLog = Log<
  bigint,
  number,
  false,
  ExtractAbiEvent<typeof routerAbi, "MessageDelivered">,
  undefined
>;
