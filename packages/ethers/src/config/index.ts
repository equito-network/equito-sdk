import { JsonRpcProvider, WebSocketProvider, AbstractProvider } from 'ethers';
import { readFileSync } from 'fs';

interface ChainConfig {
    chainSelector: number;
    endpointUrl: string;
}

interface Config {
    chains: ChainConfig[];
}

export class EvmClient {
    private providers: Map<number, AbstractProvider>;

    constructor(configPath: string) {
        this.providers = new Map<number, AbstractProvider>();
        this.loadConfig(configPath);
    }

    private loadConfig(configPath: string) {
        try {
            const config: Config = JSON.parse(readFileSync(configPath, 'utf-8'));
            for (const chain of config.chains) {
                const provider = this.createProvider(chain.endpointUrl);
                this.providers.set(chain.chainSelector, provider);
            }
        } catch (error) {
            console.error(`Error loading configuration: ${error}`);
            throw new Error('Failed to load configuration');
        }
    }

    private createProvider(endpointUrl: string): AbstractProvider {
        if (endpointUrl.startsWith('http')) {
            return new JsonRpcProvider(endpointUrl);
        } else if (endpointUrl.startsWith('ws')) {
            return new WebSocketProvider(endpointUrl);
        } else {
            throw new Error(`Unsupported protocol in endpoint URL: ${endpointUrl}`);
        }
    }

    public getProvider(chainSelector: number): AbstractProvider {
        const provider = this.providers.get(chainSelector);
        if (!provider) {
            throw new Error(`Provider not found for chain selector: ${chainSelector}`);
        }
        return provider;
    }
}
