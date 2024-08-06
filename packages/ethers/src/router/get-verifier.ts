import { routerAbi } from "@equito-sdk/evm";
import { AbstractProvider, Contract } from "ethers";
import { Hex, EquitoAddress } from "@equito-sdk/core";
import { AbiCoder, ZeroHash } from "ethers";
/**
 * The arguments for the getVerifier function.
 */
export type GetVerifierArgs = {
    /**
     * The provider that will be used to read the contract.
     */
    provider: AbstractProvider;
    /**
     * The router contract in {@link Hex} format.
     */
    routerContract: Hex;
    /**
     * The verifier index.
     */
    verifierIndex: number;
};

/**
 * Gets the verifier address.
 *
 * @param {GetVerifierArgs} args {@link GetVerifierArgs}
 * @returns {Promise<EquitoAddress>} The verifier address.
 */
export const getVerifier = async ({
    provider,
    routerContract,
    verifierIndex,
}: GetVerifierArgs): Promise<EquitoAddress> => {
    const contract = new Contract(routerContract, routerAbi, provider);
    const getVerifierMethod = contract.verifiers as (arg: BigInt) => Promise<Hex>;

    if (!getVerifierMethod) {
        throw new Error("The verifiers method is not defined on the contract");
    }

    const verifier = await getVerifierMethod(BigInt(verifierIndex));

    return {
        lower: AbiCoder.defaultAbiCoder().encode(["address"], [verifier]) as Hex,
        upper: ZeroHash as Hex
    };
};
