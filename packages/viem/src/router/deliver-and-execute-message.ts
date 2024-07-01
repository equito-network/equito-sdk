import { EquitoMessage, Hex } from "@equito-sdk/core";
import { routerAbi } from "@equito-sdk/evm";
import { Account, WalletClient } from "viem";
import { Chain } from "viem/chains";

/**
 * The arguments for the deliverAndExecuteMessage function.
 */
export type DeliverAndExecuteMessageArgs = {
  /**
   * The {@link WalletClient} that will be used to write the contract.
   */
  walletClient: WalletClient;
  /**
   * The {@link Account} that will be used to sign the transaction.
   */
  account: Account;
  /**
   * The {@link Chain} that the message will be routed from.
   */
  chain: Chain;
  /**
   * The destination chain selector that the message will be routed to.
   */
  destinationChainSelector: number;
  /**
   * The router contract in {@link Hex} format.
   */
  routerContract: Hex;
  /**
   * The {@link EquitoMessage} that will be routed.
   */
  message: EquitoMessage;
  /**
   * The message data in {@link Hex} format.
   */
  messageData: Hex;
  /**
   * The message proof in {@link Hex} format.
   */
  proof: Hex;
  /**
   * The verifier index.
   */
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
    functionName: "deliverAndExecuteMessage",
    args: [message, messageData, BigInt(verifierIndex), proof],
    account,
    chain,
  });

  return txHash;
};
