export type Hex = `0x${string}`;

/**
 * @interface EquitoChain
 * @description Represents a blockchain configuration used within the Equito ecosystem.
 * 
 * @property {number} chainSelector - A unique numeric identifier for the blockchain. 
 * Typically used to differentiate between different blockchains or network configurations.
 * 
 * @property {string[]} names - An array of strings representing different names or aliases 
 * for the blockchain. This can include common names, abbreviations, or other recognized identifiers.
 * 
 * @property {string} image - A string representing the path to an image (e.g., an SVG or PNG file)
 * that visually represents the blockchain. This could be a logo or any other relevant image.
 */
export interface EquitoChain {
    chainSelector: number;
    names: string[];
    image: string;
}

