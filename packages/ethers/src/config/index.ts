import { JsonRpcProvider, WebSocketProvider, AbstractProvider } from 'ethers';

/**
 * The configuration for a single blockchain network.
 */
export interface ChainConfig {
    /**
     * The unique identifier for the blockchain network in the Equito Protocol.
     */
    chainSelector: number;
    /**
     * The URL endpoint for accessing the blockchain network.
     */
    endpointUrl: string;
}

/**
 * The overall configuration containing multiple blockchain network configurations.
 */
export interface Config {
    /**
     * An array of ChainConfig objects, each representing a different blockchain network configuration.
     */ 
    chains: ChainConfig[];
}

/**
 * A client to manage providers for different blockchain networks based on chain selectors.
 * Requires a {@link Config} object to initialize.
 */
export class MultiChainClient {
    /**
     * The configuration object containing chain selectors and endpoint URLs.
     */
    private config: Config;

    /**
     * Underlying providers for each chain, indexed by chain selector.
     */
    private providers: Map<number, AbstractProvider>;

    /**
     * Creates a {@link MultiChainClient} instance.
     *
     * @param config {@link Config} - The path to the configuration file.
     */
    constructor(config: Config) {
        this.providers = new Map<number, AbstractProvider>();
        this.config = config;
    }

    /**
     * Returns the endpoint URL for a specified chain selector.
     * 
     * @param {number} chainSelector - The chain selector number.
     * @returns {string} The endpoint URL as a string.
     * 
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
     * Checks if the provider is connected by attempting to fetch the latest block number.
     * 
     * @param provider {@link AbstractProvider} - The provider to check.
     * @returns {Promise<boolean>} A promise that resolves to true if the provider is connected, otherwise false.
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
     * Creates a new provider based on the endpoint URL.
     * 
     * @param {number} chainSelector - The chain selector number.
     * @returns {@link AbstractProvider} A new instance of JsonRpcProvider or WebSocketProvider.
     * 
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
     * Retrieves the provider for the specified chain selector, ensuring its connection.
     * 
     * @param {number} chainSelector - The chain selector number.
     * @returns {Promise<AbstractProvider>} A promise that resolves to an AbstractProvider.
     * 
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
