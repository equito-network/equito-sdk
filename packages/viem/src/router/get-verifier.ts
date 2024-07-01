import { EquitoAddress, Hex } from "@equito-sdk/core";
import { routerAbi } from "@equito-sdk/evm";
import { PublicClient, encodeAbiParameters, parseAbiParameters } from "viem";

export type GetVerifierArgs = {
  publicClient: PublicClient;
  routerContract: Hex;
};

/**
 * Gets the verifier address.
 *
 * @param {GetVerifierArgs} args {@link GetVerifierArgs}
 * @returns {Promise<EquitoAddress>} The verifier address.
 */
export const getVerifier = async ({
  publicClient,
  routerContract,
}: GetVerifierArgs): Promise<EquitoAddress> => {
  const verifier = await publicClient.readContract({
    address: routerContract,
    abi: routerAbi,
    functionName: "verifiers",
    args: [BigInt(0)],
  });

  return {
    lower: encodeAbiParameters(parseAbiParameters("address"), [verifier]),
    upper: encodeAbiParameters(parseAbiParameters("bytes1"), ["0x00"]),
  };
};
