import chainSelectorsJson from "./chain-selectors.json";
import { EquitoChain } from "../types";

// Assert correct type for chain-selectors.json file
const chainSelectors = chainSelectorsJson as Record<
  string,
  { names: string[] }
>;

/**
 * Returns the chain selector value for a given chain name.
 * @param {string} name The name of the chain to look up.
 * @returns The chain selector associated with the given chain name.
 * @throws Throws an error if the provided chain name is not supported.
 *
 * @example
 * ```
 * const selector = getChainSelectorByName("ethereum");
 * console.log(selector); // Outputs: 1
 * ```
 */
export function getChainSelectorByName(name: string): number {
  const lowerCaseName = name.toLowerCase();

  for (const [selector, { names }] of Object.entries(chainSelectors)) {
    if (names.includes(lowerCaseName)) {
      return Number(selector);
    }
  }

  throw new Error(`Invalid or unsupported Chain Name: ${name}`);
}

/**
 * A list of all supported chains.
 *
 * @returns An array of objects, each containing the chain selector and names for a supported chain.
 *
 * @example
 * ```
 * const chains = getAllSupportedChains();
 * console.log(chains);
 * // [
 * //   { chainSelector: 1, names: ["ethereum", "eth"], image: "images/ethereum.svg" },
 * //   { chainSelector: 2, names: ["bsc", "bnb"], image: "images/bsc.svg" },
 * //   ...
 * // ]
 * ```
 */
export function getAllSupportedChains(): EquitoChain[] {
  const supportedChains = [];
  for (const [selector, { names }] of Object.entries(chainSelectors)) {
    supportedChains.push({
      chainSelector: Number(selector),
      names,
    });
  }
  return supportedChains;
}

/**
 * Returns the chain information, including names or aliases, associated with a specific chain selector.
 * 
 * @param {number} chainSelector The selector value for the chain.
 * @returns An object containing the chain selector, names, and image associated with the chain.
 * 
 * @throws Throws an error if the chain selector is invalid or not found.
 */
export function getByChainSelector(chainSelector: number): EquitoChain {
  const chainData = chainSelectors[chainSelector];

  if (chainData) {
    return { chainSelector, ...chainData };
  }

  throw new Error(`Invalid or unsupported Chain Selector: ${chainSelector}`);
}
