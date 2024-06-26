import { ApiPromise, WsProvider } from "@polkadot/api";

import { getProof } from "./get-proof";
import { Hex } from "@equito-sdk/core";

type EquitoClientCreateParams = {
  wsProvider: string;
};

type EquitoEvent = {
  phase: { ApplyExtrinsic: string };
  event: {
    method: string;
    data: { message: Hex; who: Hex };
  };
};

type ListenForSignaturesArgs = {
  messageHash: Hex;
  onConfirm: (args: { proof: Hex; timestamp: number }) => Promise<void>;
  onError?: (error: unknown) => void;
};

export class EquitoClient {
  private readonly routerContracts = new Map<number, Hex>();
  private static instance: EquitoClient | null = null;
  private constructor(private readonly api: ApiPromise) {}

  static async create({
    wsProvider,
  }: EquitoClientCreateParams): Promise<EquitoClient> {
    if (!this.instance) {
      const api = await ApiPromise.create({
        provider: new WsProvider(wsProvider),
        runtime: {
          SessionRuntimeApi: [
            {
              methods: {
                next_session_at: {
                  description:
                    "Get the block number at which the next session starts",
                  params: [],
                  type: "Option<BlockNumber>",
                },
              },
              version: 1,
            },
          ],
        },
      });
      api.rpc;
      this.instance = new EquitoClient(api);
    }

    return this.instance;
  }

  async getNextValidators(): Promise<Hex[]> {
    return (
      await this.api.query.validatorSet?.validators?.()
    )?.toHuman() as Hex[];
  }

  async getValidators(): Promise<Hex[]> {
    return (await this.api.query.session?.validators?.())?.toHuman() as Hex[];
  }

  async getRouterContract(chainSelector: number): Promise<Hex> {
    if (!this.routerContracts.has(chainSelector)) {
      const router = (
        await this.api.query.equitoEVM?.routers?.(chainSelector)
      )?.toHex();
      if (!router || router == "0x0000000000000000000000000000000000000000") {
        throw new Error(`Router contract not found for chain ${chainSelector}`);
      }
      this.routerContracts.set(chainSelector, router);
    }

    const routerContract = this.routerContracts.get(chainSelector);

    if (!routerContract) {
      throw new Error(`Router contract not found for chain ${chainSelector}`);
    }

    return routerContract;
  }

  async listenForSignatures({
    messageHash,
    onConfirm,
    onError,
  }: ListenForSignaturesArgs): Promise<void> {
    const signatures: {
      who: Hex;
      message: Hex;
      timestamp: number;
    }[] = [];

    try {
      const validators = await this.getValidators();
      let countHeads = 0;
      const unsubHeads = await this.api.rpc.chain.subscribeNewHeads(
        async (lastHeader: any) => {
          try {
            countHeads++;
            const blockHash = await this.api.rpc.chain.getBlockHash(
              lastHeader.number.toHex()
            );

            const signedBlock = await this.api.rpc.chain.getBlock(blockHash);
            const timestamp = signedBlock.block.extrinsics.find(
              ({ method: { section, method } }: any) =>
                section === "timestamp" && method === "set"
            )?.args;

            if (!timestamp) {
              return;
            }

            const apiAt = await this.api.at(lastHeader.hash);
            const allRecords = (
              await apiAt.query.system?.events?.()
            )?.toHuman() as EquitoEvent[];

            const signaturesInBlock = signedBlock.block.extrinsics.flatMap(
              (_: any, index: number) => {
                const signatureSubmittedFromValidator = allRecords.filter(
                  ({
                    phase,
                    event: {
                      data: { message, who },
                      method,
                    },
                  }) =>
                    phase.ApplyExtrinsic === `${index}` &&
                    method === "SignatureSubmitted" &&
                    message === messageHash &&
                    validators.find((v) => v === who)
                );

                if (!signatureSubmittedFromValidator.length) {
                  return [];
                }

                return signatureSubmittedFromValidator
                  .filter(
                    ({
                      event: {
                        data: { who },
                      },
                    }) => !signatures.find((sig) => sig.who === who)
                  )
                  .map(
                    ({
                      event: {
                        data: { message, who },
                      },
                    }) => ({ message, who, timestamp: Number(timestamp) })
                  );
              }
            );

            // add new event signatures to the array
            signatures.push(...signaturesInBlock);

            // check if we have enough signatures
            if (signatures.length * 100 >= validators?.length * 70) {
              const messageSigs =
                await this.api.query.equitoEVM?.signatures?.entries(
                  messageHash
                );
              const proof = getProof(
                messageSigs?.map(([, proof]) => proof.toHex()) || []
              );
              const maxTimestamp = signatures.reduce(
                (acc, { timestamp }) => (acc > timestamp ? acc : timestamp),
                0
              );
              await onConfirm({ proof, timestamp: maxTimestamp });
              unsubHeads();
            }

            if (countHeads > 20) {
              throw new Error("Timeout listening for signatures");
            }
          } catch (error) {
            if (onError) {
              unsubHeads();
              onError(error);
            } else {
              throw error;
            }
          }
        }
      );
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        throw error;
      }
    }
  }
}
