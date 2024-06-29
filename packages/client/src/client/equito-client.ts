import { ApiPromise, WsProvider } from "@polkadot/api";

import { type Hex } from "@equito-sdk/core";
import {
  EquitoClientCreateArgs,
  EquitoEvent,
  GetProofTimestamp,
  ListenForSignaturesArgs,
} from "./equito-client.types";
import { runtime } from "./runtime";
import { ESTIMATED_BLOCK_TIME } from "../constants";
import { ApiDecoration } from "@polkadot/api/types";

export class EquitoClient {
  private static instance: EquitoClient | null = null;

  private constructor(
    private readonly api: ApiPromise,
    private readonly archiverApi: ApiPromise
  ) {}

  static async create({
    wsProvider,
    archiverWsProvider,
  }: EquitoClientCreateArgs): Promise<EquitoClient> {
    if (!this.instance) {
      const api = await ApiPromise.create({
        provider: new WsProvider(wsProvider),
        runtime,
      });
      const archiverApi = await ApiPromise.create({
        provider: new WsProvider(archiverWsProvider),
        runtime,
      });

      this.instance = new EquitoClient(api, archiverApi);
    }

    return this.instance;
  }

  // todo: chose the right api based on the block number
  getApi(blockNumber?: number): ApiPromise {
    if (blockNumber !== undefined) {
      return this.archiverApi;
    }
    return this.api;
  }

  // if not specified, get the latest api
  async getApiAt(blockNumber?: number): Promise<ApiDecoration<"promise">> {
    const api = this.getApi(blockNumber);
    const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
    return await api.at(blockHash);
  }

  async getRouter(chainSelector: number): Promise<Hex> {
    const router = (
      await this.api.query.equitoEVM?.routers?.(chainSelector)
    )?.toHex();
    if (!router || router == "0x0000000000000000000000000000000000000000") {
      throw new Error(`Router contract not found for chain ${chainSelector}`);
    }

    return router;
  }

  async getNextValidators(): Promise<Hex[]> {
    return (
      await this.api.query.validatorSet?.validators?.()
    )?.toHuman() as Hex[];
  }

  async getValidators(
    chainSelector: number,
    blockNumber?: number
  ): Promise<Hex[]> {
    const api = await this.getApiAt(blockNumber);
    return (await api.query.session?.validators?.())?.toHuman() as Hex[];
  }

  async getSignatures(
    messageHash: Hex,
    chainSelector: number,
    blockNumber?: number
  ): Promise<Hex[]> {
    const api = await this.getApiAt(blockNumber);
    const signatures = await api.query.equitoEVM?.signatures?.entries<Hex>(
      messageHash
    );

    return signatures?.map(([, signature]) => signature) || [];
  }

  async getProof(
    messageHash: Hex,
    chainSelector: number,
    blockNumber?: number
  ): Promise<Hex> {
    const signatures = await this.getSignatures(
      messageHash,
      chainSelector,
      blockNumber
    );
    const validators = await this.getValidators(chainSelector, blockNumber);
    if (signatures.length * 100 < validators.length * 70) {
      throw new Error(`Not enough signatures for message ${messageHash}`);
    }

    return signatures.reduce<Hex>(
      (acc, curr) =>
        !curr ? acc : ((acc + curr.split("0x").slice(-1)) as Hex),
      "0x"
    );
  }

  async getBlockTimestamp(blockNumber: number): Promise<number> {
    const api = this.getApi(blockNumber);
    const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
    const signedBlock = await api.rpc.chain.getBlock(blockHash);
    const timestamp = signedBlock.block.extrinsics.find(
      ({ method: { section, method } }) =>
        section === "timestamp" && method === "set"
    )?.args;

    if (!timestamp) {
      throw new Error(`#${timestamp} block timestamp not found`);
    }

    return Number(timestamp);
  }

  async getProofTimestamp({
    messageHash,
    chainSelector,
    fromTimestamp,
    listenTimeout = 5,
  }: GetProofTimestamp): Promise<number> {
    const latestSignedBlock = await this.api.rpc.chain.getBlock();
    const latestBlockNumber = Number(latestSignedBlock.block.header.number);

    let blockNumber = latestBlockNumber;
    if (fromTimestamp) {
      const latestBlockTimestamp = await this.getBlockTimestamp(
        latestBlockNumber
      );

      blockNumber = Math.floor(
        Number(latestBlockNumber) -
          (Number(latestBlockTimestamp) - Number(fromTimestamp)) /
            Number(ESTIMATED_BLOCK_TIME)
      );

      if (blockNumber < 0) {
        throw new Error("'fromTimestamp' is too old");
      }
    }

    let timestamp: number;
    let checkedBlocks = 0;
    do {
      try {
        await this.getProof(messageHash, chainSelector, blockNumber);
        timestamp = await this.getBlockTimestamp(blockNumber);
      } finally {
        checkedBlocks++;
      }
    } while (!timestamp && checkedBlocks < listenTimeout);

    if (checkedBlocks >= listenTimeout) {
      throw new Error(
        `No proof found for message ${messageHash} from timestamp ${fromTimestamp} in the last ${listenTimeout} blocks`
      );
    }

    return timestamp;
  }

  async listenForSignatures({
    messageHash,
    chainSelector,
    onConfirm,
    onError,
  }: ListenForSignaturesArgs): Promise<void> {
    const signatures: {
      who: Hex;
      message: Hex;
      timestamp: number;
    }[] = [];

    try {
      const validators = await this.getValidators(chainSelector);
      let countHeads = 0;

      const unsubHeads = await this.api.rpc.chain.subscribeNewHeads(
        async (lastHeader) => {
          try {
            countHeads++;
            const blockHash = await this.api.rpc.chain.getBlockHash(
              lastHeader.number.toHex()
            );

            const signedBlock = await this.api.rpc.chain.getBlock(blockHash);
            const timestamp = signedBlock.block.extrinsics.find(
              ({ method: { section, method } }) =>
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
              (_, index) => {
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
              const proof = await this.getProof(messageHash, chainSelector);
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
