import { ApiPromise, WsProvider } from "@polkadot/api";

import { type Hex } from "@equito-sdk/core";
import {
  EquitoClientCreateConfig,
  SubmitSignatureEvent,
  GetConfirmationTimeArgs,
  ListenForSignaturesArgs,
  GetConfirmationTimeReturnType,
} from "./equito-client.types";
import { runtime } from "./runtime";
import { ESTIMATED_BLOCK_TIME } from "../constants";
import { ApiDecoration } from "@polkadot/api/types";

export class EquitoClient {
  private static instance: EquitoClient | null = null;

  private constructor(
    private readonly api: ApiPromise,
    private readonly archiveApi: ApiPromise
  ) {}

  /**
   * Create a new instance of {@link EquitoClient}.
   *
   * An EquitoClient instance is a wrapper around the Substrate API that provides
   * methods to interact with the Equito node.
   *
   * @param {EquitoClientCreateConfig} config The configuration for creating an EquitoClient.
   * @returns {EquitoClient} A new instance of EquitoClient.
   */
  static async create({
    wsProvider,
    archiveWsProvider,
  }: EquitoClientCreateConfig): Promise<EquitoClient> {
    if (!this.instance) {
      const api = await ApiPromise.create({
        provider: new WsProvider(wsProvider),
        runtime,
      });
      const archiveApi = await ApiPromise.create({
        provider: new WsProvider(archiveWsProvider),
        runtime,
      });

      this.instance = new EquitoClient(api, archiveApi);
    }

    return this.instance;
  }

  private getApi(blockNumber?: number): ApiPromise {
    if (blockNumber !== undefined) {
      return this.archiveApi;
    }
    return this.api;
  }

  /**
   * Returns the API instance at a specific block number, if specified.
   * Otherwise, returns the API instance at the latest finalized block.
   *
   * @param {number} blockNumber If provided, the API instance will be created at the block number.
   * @returns {ApiDecoration<"promise">} The API instance at the block number.
   */
  async getApiAt(blockNumber?: number): Promise<ApiDecoration<"promise">> {
    const api = this.getApi(blockNumber);
    const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
    return await api.at(blockHash);
  }

  /**
   * Returns the router contract address for a given chain selector.
   *
   * @param {number} chainSelector The chain selector for which to get the router contract address.
   * @returns {Hex} The router contract address.
   */
  async getRouter(chainSelector: number): Promise<Hex> {
    const router = (
      await this.api.query.equitoEvm?.routers?.(chainSelector)
    )?.toHex();
    if (!router || router == "0x0000000000000000000000000000000000000000") {
      throw new Error(`Router contract not found for chain ${chainSelector}`);
    }

    return router;
  }

  /**
   * Returns the list of validators for the next session.
   *
   * @returns {Hex[]} The list of validators.
   */
  async getNextValidators(): Promise<Hex[]> {
    return (
      await this.api.query.validatorSet?.validators?.()
    )?.toHuman() as Hex[];
  }

  /**
   * Returns the list of validators for a specific chain and block number.
   *
   * @param {number} chainSelector The chain selector for which to get the validators.
   * @param {number} blockNumber The block number at which to get the validators.
   * @returns {Hex[]} The list of validators.
   */
  async getValidators(
    chainSelector: number,
    blockNumber?: number
  ): Promise<Hex[]> {
    const api = await this.getApiAt(blockNumber);
    return (await api.query.session?.validators?.())?.toHuman() as Hex[];
  }

  /**
   * Returns the list of signatures for a specific message hash, chain selector, and block number.
   *
   * @param {Hex} messageHash The message hash for which to get the signatures.
   * @param {number} chainSelector The chain selector for which to get the signatures.
   * @param {number} blockNumber The block number at which to get the signatures.
   *
   * @returns {Hex[]} The list of signatures.
   */
  async getSignatures(
    messageHash: Hex,
    chainSelector: number,
    blockNumber?: number
  ): Promise<Hex[]> {
    const api = await this.getApiAt(blockNumber);
    const signatures = await api.query.equitoEvm?.signatures?.entries<Hex>(
      messageHash
    );

    return signatures?.map(([, signature]) => signature) || [];
  }

  /**
   * Returns the proof for a specific message hash, chain selector, and block number.
   *
   * @param {Hex} messageHash The message hash for which to get the proof.
   * @param {number} chainSelector The chain selector for which to get the proof.
   * @param {number} blockNumber The block number at which to get the proof.
   * @returns {Hex | undefined} If exists, the proof for the message in {@link Hex} format.
   */
  async getProof(
    messageHash: Hex,
    chainSelector: number,
    blockNumber?: number
  ): Promise<Hex | undefined> {
    const signatures = await this.getSignatures(
      messageHash,
      chainSelector,
      blockNumber
    );
    const validators = await this.getValidators(chainSelector, blockNumber);
    if (signatures.length * 100 >= validators.length * 70) {
      return signatures.reduce<Hex>(
        (acc, curr) =>
          !curr ? acc : ((acc + curr.split("0x").slice(-1)) as Hex),
        "0x"
      );
    }
  }

  /**
   * Returns the timestamp in milliseconds of a specific block number.
   *
   * @param {number} blockNumber The block number for which to get the timestamp.
   * @returns {number} The timestamp in milliseconds of the block.
   */
  async getBlockTimestamp(blockNumber: number): Promise<number> {
    const api = await this.getApiAt(blockNumber);
    const timestamp = (await api.query.timestamp?.now?.())
      ?.toHuman()
      ?.toString()
      .replaceAll(",", "");
    if (!timestamp) {
      throw new Error(`Timestamp not found for block ${blockNumber}`);
    }
    return Number(timestamp);
  }

  /**
   * Returns the timestamp in milliseconds of a proof for a specific message hash, chain selector, and block number.
   *
   * @param {GetConfirmationTimeArgs} args - {@link GetConfirmationTimeArgs}
   * @returns {GetConfirmationTimeReturnType} - {@link GetConfirmationTimeReturnType}
   */
  async getConfirmationTime({
    messageHash,
    chainSelector,
    fromTimestamp,
    listenTimeout = 10,
  }: GetConfirmationTimeArgs): Promise<GetConfirmationTimeReturnType> {
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

    let proof: Hex | undefined;
    let checkedBlocks = 0;
    do {
      proof = await this.getProof(
        messageHash,
        chainSelector,
        blockNumber + checkedBlocks
      );
      checkedBlocks++;
    } while (!proof && checkedBlocks < listenTimeout);

    if (checkedBlocks >= listenTimeout || !proof) {
      throw new Error(
        `No proof found for message ${messageHash} from timestamp ${fromTimestamp} in the last ${listenTimeout} blocks`
      );
    }

    const timestamp = await this.getBlockTimestamp(blockNumber);

    return { proof, timestamp };
  }

  /**
   * Listens for signatures for a specific message hash, chain selector, and block number in a specific time frame.
   *
   * @param {ListenForSignaturesArgs} args - {@link ListenForSignaturesArgs}
   * @returns {Promise<void>}
   */
  async listenForSignatures({
    messageHash,
    chainSelector,
    listenTimeout = 10,
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
            )?.toHuman() as SubmitSignatureEvent[];

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

              if (!proof) {
                throw new Error(
                  `No proof found for message ${messageHash} in the last ${listenTimeout} blocks`
                );
              }

              const maxTimestamp = signatures.reduce(
                (acc, { timestamp }) => (acc > timestamp ? acc : timestamp),
                0
              );
              await onConfirm({ proof, timestamp: maxTimestamp });
              unsubHeads();
            }

            if (countHeads > listenTimeout) {
              throw new Error("Timeout listening for signatures");
            }
          } catch (error) {
            unsubHeads();
            if (onError) {
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
