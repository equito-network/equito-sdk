import { routerAbi } from "@equito-sdk/evm";
import { Hex, PublicClient } from "viem";

/**
 * The arguments for the getFee function.
 */
type GetFeeArgs = {
  /**
   * The {@link PublicClient} that will be used to read the contract.
   */
  publicClient: PublicClient;
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
  publicClient,
  routerContract,
  senderContract,
}: GetFeeArgs): Promise<bigint> => {
  return await publicClient.readContract({
    address: routerContract,
    abi: routerAbi,
    functionName: "getFee",
    args: [senderContract],
  });
};
