import { EquitoAddress, Hex } from "@equito-sdk/core";
import { routerAbi } from "@equito-sdk/evm";
import { PublicClient, encodeAbiParameters, parseAbiParameters } from "viem";

/**
 * The arguments for the getVerifier function.
 */
export type GetVerifierArgs = {
  /**
   * The public client that will be used to read the contract.
   */
  publicClient: PublicClient;
  /**
   * The router contract in {@link Hex} format.
   */
  routerContract: Hex;
};

/**
 * Gets the verifier address.
 *
 * @param {GetVerifierArgs} args {@link GetVerifierArgs}
 * @returns {Promise<Hex>} The verifier address.
 */
export const getVerifier = async ({
  publicClient,
  routerContract,
}: GetVerifierArgs): Promise<Hex> => {
  return await publicClient.readContract({
    address: routerContract,
    abi: routerAbi,
    functionName: "verifiers",
    args: [BigInt(0)],
  });
};
