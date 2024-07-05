# Equito SDK

Equito is a cutting-edge cross-chain messaging protocol designed to facilitate seamless, secure, and efficient communication across diverse blockchain networks. As a gateway for interoperability, Equito empowers developers to extend the functionality of decentralized applications (dApps) beyond the constraints of single blockchains.

This repository provides the Equito TypeScript SDK, a comprehensive toolkit that enables developers to build front-end applications that interact with Equito and the blockchain networks that it supports.  
The SDK includes a set of APIs that allow developers to deliver and execute messages across different blockchains, as well as to query the status of messages and transactions, and generate proofs for message delivery.

## Key Components

- [**@equito-sdk/core**](packages/core/README.md), which contains the core types for Equito Messages.
- [**@equito-sdk/client**](packages/client/README.md), which provides a client to communicate with the Equito Network, a Substrate-based blockchain that serves as the backbone of the Equito protocol. The client allows developers to query message status and generate message proofs to deliver messages to the appropriate destination network.
- [**@equito-sdk/evm**](packages/evm/README.md), which contains the core types and ABI to interact with EVM (Ethereum Virtual Machine) compatible blockchains that integrate with Equito.
- [**@equito-sdk/viem**](packages/viem/README.md), which provides a high-level API to interact with the Equito Network and EVM-compatible blockchains using [viem](https://viem.sh/), a popular lightweight TypeScript library for building Ethereum-compatible applications.
- **@equito-sdk/ethers** 🚧 work in progress 🚧.
