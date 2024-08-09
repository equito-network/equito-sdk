import { Hex } from "@equito-sdk/core";
import { routerAbi } from "@equito-sdk/evm";
import { AbstractProvider, Contract } from "ethers";

/**
 * The arguments for the getFee function.
 */
export type GetFeeArgs = {
    /**
     * The {@link AbstractProvider} that will be used to read the contract.
     */
    provider: AbstractProvider;
    /**
     * The router contract in {@link Hex} format.
     */
    routerContract: Hex;
    /**
     * The sender contract in {@link Hex} format.
     */
    senderContract: Hex;
};

/**
 * Gets the fee for a given sender contract.
 *
 * @param {GetFeeArgs} args {@link GetFeeArgs}
 * @returns {Promise<bigint>} The fee in wei for a given sender contract.
 */
export const getFee = async ({
    provider,
    routerContract,
    senderContract,
}: GetFeeArgs): Promise<bigint> => {
    const contract = new Contract(routerContract, routerAbi, provider);
    const getFeeMethod = contract.getFee as (arg: Hex) => Promise<bigint>;

    if (!getFeeMethod) {
        throw new Error("The getFee method is not defined on the contract");
    }

    const fee: bigint = await getFeeMethod(senderContract);

    return fee;
};
