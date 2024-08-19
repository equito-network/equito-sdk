import { JsonRpcProvider, WebSocketProvider, AbstractProvider } from "ethers";
import { readFileSync } from "fs";

/**
 * @title ChainSelector Configuration
 * @description Represents the configuration for a blockchain network.
 * @property chainSelector - The unique identifier for the blockchain network.
 * @property endpointUrl - The URL endpoint for accessing the blockchain network.
 */
interface ChainConfig {
    chainSelector: number;
    endpointUrl: string;
}

/**
 * @title Configuration
 * @description Represents the overall configuration containing multiple network configurations.
 * @property chains - An array of ChainConfig objects, each representing a different blockchain network configuration.
 */
interface Config {
    chains: ChainConfig[];
}

/**
 * @title MultiChainClient
 * @description A client to manage providers for different blockchain networks based on chain selectors.
 *
 * @property providers - A map that caches providers for different chain selectors.
 * @property config - The configuration object that contains chain configurations.
 *
 * @method constructor(configPath: string) - Initializes a new instance of the MultiChainClient class and loads the configuration from the specified path.
 * @method getProvider(chainSelector: number): Promise<AbstractProvider> - Retrieves the provider for the specified chain selector, ensuring it is connected. Recreates the provider if it is disconnected.
 *
 * @private method loadConfig(configPath: string): Config - Loads the configuration from a JSON file.
 * @private method getEndpointUrl(chainSelector: number): string - Gets the endpoint URL for the specified chain selector.
 * @private method isProviderConnected(provider: AbstractProvider): Promise<boolean> - Checks if the provider is connected by attempting to fetch the latest block number.
 * @private method createProvider(chainSelector: number): AbstractProvider - Creates a new provider based on the endpoint URL.
 */
export class MultiChainClient {
    private providers: Map<number, AbstractProvider>;
    private config: Config;

    /**
     * @title Constructor
     * @description Initializes a new instance of the MultiChainClient class.
     * @param configPath - The path to the configuration file.
     */
    constructor(configPath: string) {
        this.providers = new Map<number, AbstractProvider>();
        this.config = this.loadConfig(configPath);
    }

    /**
     * @title Load Configuration
     * @description Loads the configuration from a JSON file.
     * @param configPath - The path to the configuration file.
     * @returns The parsed configuration object.
     * @throws Will throw an error if the configuration file cannot be loaded or parsed.
     */
    private loadConfig(configPath: string): Config {
        try {
            return JSON.parse(readFileSync(configPath, "utf-8"));
        } catch (error) {
            console.error(`Error loading configuration from ${configPath}: ${error}`);
            throw new Error("Failed to load configuration");
        }
    }

    /**
     * @title Get Endpoint URL
     * @description Gets the endpoint URL for the specified chain selector.
     * @param chainSelector - The chain selector number.
     * @returns The endpoint URL as a string.
     * @throws Will throw an error if the chain selector is not found in the configuration.
     */
    private getEndpointUrl(chainSelector: number): string {
        const chainConfig = this.config.chains.find(
            (chain) => chain.chainSelector === chainSelector
        );
        if (!chainConfig) {
            throw new Error(
                `Endpoint URL not found for chain selector: ${chainSelector}`
            );
        }
        return chainConfig.endpointUrl;
    }

    /**
     * @title Check Provider Connection
     * @description Checks if the provider is connected by attempting to fetch the latest block number.
     * @param provider - The provider to check.
     * @returns A promise that resolves to true if the provider is connected, otherwise false.
     */
    private async isProviderConnected(
        provider: AbstractProvider
    ): Promise<boolean> {
        try {
            await provider.getBlockNumber();
            return true;
        } catch (error) {
            console.error(`Provider connection check failed: ${error}`);
            return false;
        }
    }

    /**
     * @title Create Provider
     * @description Creates a new provider based on the endpoint URL.
     * @param chainSelector - The chain selector number.
     * @returns A new instance of JsonRpcProvider or WebSocketProvider.
     * @throws Will throw an error if the protocol in the endpoint URL is unsupported.
     */
    private createProvider(chainSelector: number): AbstractProvider {
        const endpointUrl = this.getEndpointUrl(chainSelector);
        if (endpointUrl.startsWith("http")) {
            console.log(`Creating HTTP provider for chain selector ${chainSelector}`);
            return new JsonRpcProvider(endpointUrl);
        } else if (endpointUrl.startsWith("ws")) {
            console.log(
                `Creating WebSocket provider for chain selector ${chainSelector}`
            );
            return new WebSocketProvider(endpointUrl);
        } else {
            throw new Error(
                `Unsupported protocol in endpoint URL for chain selector ${chainSelector}: ${endpointUrl}`
            );
        }
    }

    /**
     * @title Get Provider
     * @description Retrieves the provider for the specified chain selector, ensuring it is connected.
     * Recreates the provider if it is disconnected.
     * @param chainSelector - The chain selector number.
     * @returns A promise that resolves to an AbstractProvider.
     * @throws Will throw an error if the provider cannot be found or connected.
     */
    public async getProvider(chainSelector: number): Promise<AbstractProvider> {
        let provider = this.providers.get(chainSelector);
        if (provider) {
            const isConnected = await this.isProviderConnected(provider);
            if (isConnected) {
                return provider;
            } else {
                console.warn(
                    `Provider for chain selector ${chainSelector} is disconnected, recreating...`
                );
            }
        } else {
            console.log(
                `No cached provider for chain selector ${chainSelector}, creating new provider...`
            );
        }

        provider = this.createProvider(chainSelector);
        this.providers.set(chainSelector, provider);
        return provider;
    }
}
