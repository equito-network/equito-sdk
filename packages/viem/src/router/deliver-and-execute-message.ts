import { EquitoMessage, Hex } from "@equito-sdk/core";
import { routerAbi } from "@equito-sdk/evm";
import { Account, WalletClient } from "viem";
import { Chain } from "viem/chains";

export type DeliverAndExecuteMessageArgs = {
  /**
   * The wallet client {@link WalletClient}.
   */
  walletClient: WalletClient;
  account: Account;
  chain: Chain;
  destinationChainSelector: number;
  routerContract: Hex;
  message: EquitoMessage;
  messageData: Hex;
  proof: Hex;
  verifierIndex: number;
};

export type DeliverAndExecuteMessageReturn = Hex;

/**
 * Routes a message to a destination chain and executes it.
 *
 * @param {DeliverAndExecuteMessageArgs} args {@link DeliverAndExecuteMessageArgs}
 * @returns {Promise<DeliverAndExecuteMessageReturn>} The transaction hash.
 */
export const deliverAndExecuteMessage = async ({
  walletClient,
  chain,
  account,
  routerContract,
  message,
  messageData,
  proof,
  verifierIndex,
}: DeliverAndExecuteMessageArgs): Promise<DeliverAndExecuteMessageReturn> => {
  const txHash = await walletClient.writeContract({
    address: routerContract,
    abi: routerAbi,
    functionName: "deliverAndExecuteMessages",
    args: [[message], [messageData], BigInt(verifierIndex), proof],
    account,
    chain,
  });

  return txHash;
};
