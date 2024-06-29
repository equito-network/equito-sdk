import { routerAbi } from "@equito-sdk/evm";
import { Hex, EquitoAddress } from "@equito-sdk/core";
import { Account, PublicClient, WalletClient, parseEventLogs } from "viem";
import { Chain } from "viem/chains";
import { MessageSendRequestedLog } from "./event.types";

type SendMessageArgs = {
  publicClient: PublicClient;
  walletClient: WalletClient;
  account: Account;
  chain: Chain;
  routerContract: Hex;
  destinationChainSelector: number;
  receiver: EquitoAddress;
  data: Hex;
};
type SendMessageReturn = MessageSendRequestedLog["args"];

export const sendMessage = async ({
  chain,
  account,
  routerContract,
  walletClient,
  publicClient,
  receiver,
  destinationChainSelector,
  data,
}: SendMessageArgs): Promise<SendMessageReturn> => {
  const hash = await walletClient.writeContract({
    chain,
    account,
    address: routerContract,
    abi: routerAbi,
    functionName: "sendMessage",
    args: [receiver, BigInt(destinationChainSelector), data],
    type: "legacy",
  });

  const logs =
    (
      await publicClient.waitForTransactionReceipt({
        hash,
      })
    )?.logs || [];

  const messageSendRequestEvent = parseEventLogs({
    abi: routerAbi,
    logs,
  }).flatMap(({ eventName, args }) =>
    eventName === "MessageSendRequested"
      ? [
          {
            message: args.message,
            messageData: args.messageData,
          },
        ]
      : []
  )[0];

  if (!messageSendRequestEvent) {
    throw new Error("MessageSendRequested event not found");
  }

  return messageSendRequestEvent;
};
