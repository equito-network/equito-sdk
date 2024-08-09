import { routerAbi } from "@equito-sdk/evm";
import { Contract, Wallet } from "ethers";
import { Hex, EquitoMessage } from "@equito-sdk/core";

/**
 * The arguments for the deliverAndExecuteMessage function.
 */
export type DeliverAndExecuteMessageArgs = {
    /**
     * The {@link Wallet} that will be used to write the contract.
     */
    wallet: Wallet;
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
    /**
     * The fee to deliver a message in wei. Defaults to zero if not provided.
     */
    fee?: bigint;
};

export type DeliverAndExecuteMessageReturn = Hex;

/**
 * Routes a message to a destination chain and executes it.
 *
 * @param {DeliverAndExecuteMessageArgs} args {@link DeliverAndExecuteMessageArgs}
 * @returns {Promise<DeliverAndExecuteMessageReturn>} The transaction hash.
 */
export const deliverAndExecuteMessage = async ({
    wallet,
    routerContract,
    message,
    messageData,
    proof,
    verifierIndex,
    fee = 0n,
}: DeliverAndExecuteMessageArgs): Promise<DeliverAndExecuteMessageReturn> => {

    const contract = new Contract(routerContract, routerAbi, wallet);

    if (typeof contract.deliverAndExecuteMessage !== 'function') {
        throw new Error("The deliverAndExecuteMessage method is not defined on the contract");
    }

    const txResponse = await contract.deliverAndExecuteMessage(
        message,
        messageData,
        verifierIndex,
        proof,
        {
            value: fee,
        }
    );

    const receipt = await txResponse.wait();
    return receipt.transactionHash as Hex;
};
