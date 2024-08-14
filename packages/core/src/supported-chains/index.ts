import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../.env") });

// Path to the chain-selectors.json file
const chainSelectorsPath = path.join(__dirname, "chain-selectors.json");

// Read and parse the chain-selectors.json file
const chainSelectors = JSON.parse(
    fs.readFileSync(chainSelectorsPath, "utf-8")
) as Record<string, { names: string[]; image: string }>;

/**
 * @title getChainSelectorByName
 * @description Returns the chain selector value for a given chain name.
 * @param {string} name - The name of the chain to look up.
 * @returns {number} - The chain selector associated with the given chain name.
 * @throws {Error} - Throws an error if the provided chain name is not supported.
 * 
 * @example
 * const selector = getChainSelectorByName("ethereum");
 * console.log(selector); // Outputs: 1
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
 * @title getAllSupportedChains
 * @description Retrieves all supported chains with their respective chain selector, name, and image path.
 * 
 * @returns {Array<{ chainSelector: number, name: string, image: string }>}
 * - An array of objects, each containing the chain selector, name, and image path for a supported chain.
 * 
 * @example
 * const chains = getAllSupportedChains();
 * console.log(chains);
 * // [
 * //   { chainSelector: 0, name: "equito", image: "images/equito.svg" },
 * //   { chainSelector: 1, name: "ethereum", image: "images/ethereum.svg" },
 * //   ...
 * // ]
 */
export function getAllSupportedChains(): Array<{ chainSelector: number, name: string, image: string }> {
    const supportedChains = [];

    for (const [selector, { names, image }] of Object.entries(chainSelectors)) {
        if (names[0]) {
            supportedChains.push({
                chainSelector: Number(selector),
                name: names[0],
                image,
            });
        }
    }

    return supportedChains;
}

/**
 * @description Get the primary name of the chain by its selector.
 * @param {number} chainSelector - The selector value for the chain.
 * @returns {string} - The primary name of the chain.
 * @throws {Error} - Throws an error if the chain selector is not found.
 */
export function getNameByChainSelector(chainSelector: number): string | undefined {
    const chainData = chainSelectors[chainSelector];

    if (!chainData || chainData.names.length === 0) {
        throw new Error(`Invalid or unsupported Chain Selector: ${chainSelector}`);
    }

    // Assuming the first name in the list is the primary name
    return chainData.names[0];
}
