import { routerAbi } from "@equito-sdk/evm";
import { AbstractProvider, Contract, AbiCoder } from "ethers";
import { Hex } from "@equito-sdk/core";

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
 * @returns {Promise<Hex>} The verifier address.
 */
export const getVerifier = async ({
  provider,
  routerContract,
  verifierIndex,
}: GetVerifierArgs): Promise<Hex> => {
  const contract = new Contract(routerContract, routerAbi, provider);
  const getVerifierMethod = contract.verifiers as (arg: BigInt) => Promise<Hex>;

  if (!getVerifierMethod) {
    throw new Error("The verifiers method is not defined on the contract");
  }

  const verifier = await getVerifierMethod(BigInt(verifierIndex));

  return AbiCoder.defaultAbiCoder().encode(["address"], [verifier]) as Hex;
};
