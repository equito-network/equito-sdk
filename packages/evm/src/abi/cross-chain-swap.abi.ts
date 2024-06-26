export const crossChainSwapAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_router",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "calculateDestinationTokenAmount",
    inputs: [
      {
        name: "sourceToken",
        type: "bytes",
        internalType: "bytes",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "destinationChainSelector",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "destinationToken",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "peers",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "lower",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "upper",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "receiveMessage",
    inputs: [
      {
        name: "message",
        type: "tuple",
        internalType: "struct EquitoMessage",
        components: [
          {
            name: "blockNumber",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "sourceChainSelector",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "sender",
            type: "tuple",
            internalType: "struct bytes64",
            components: [
              {
                name: "lower",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "upper",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
          {
            name: "destinationChainSelector",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "receiver",
            type: "tuple",
            internalType: "struct bytes64",
            components: [
              {
                name: "lower",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "upper",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
          {
            name: "hashedData",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
      {
        name: "messageData",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "sendMessage",
    inputs: [
      {
        name: "receiver",
        type: "tuple",
        internalType: "struct bytes64",
        components: [
          {
            name: "lower",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "upper",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
      {
        name: "destinationChainSelector",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "setPeers",
    inputs: [
      {
        name: "chainIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "addresses",
        type: "tuple[]",
        internalType: "struct bytes64[]",
        components: [
          {
            name: "lower",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "upper",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setSwapAddress",
    inputs: [
      {
        name: "chainSelectors",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "swapAddresses",
        type: "tuple[]",
        internalType: "struct bytes64[]",
        components: [
          {
            name: "lower",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "upper",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setTokenPrice",
    inputs: [
      {
        name: "chainSelectors",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "destinationTokens",
        type: "bytes[]",
        internalType: "bytes[]",
      },
      {
        name: "prices",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "swap",
    inputs: [
      {
        name: "destinationChainSelector",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "destinationToken",
        type: "bytes",
        internalType: "bytes",
      },
      {
        name: "recipient",
        type: "bytes",
        internalType: "bytes",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "swap",
    inputs: [
      {
        name: "destinationChainSelector",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "destinationToken",
        type: "bytes",
        internalType: "bytes",
      },
      {
        name: "recipient",
        type: "bytes",
        internalType: "bytes",
      },
      {
        name: "sourceToken",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "tokenPrice",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SwapRequested",
    inputs: [
      {
        name: "messageHash",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "destinationChainSelector",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "sourceToken",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "sourceAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "destinationToken",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
      {
        name: "destinationAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "recipient",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "InsufficientValueSent",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidLength",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidMessageSender",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidRouter",
    inputs: [
      {
        name: "router",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "RouterAddressCannotBeZero",
    inputs: [],
  },
] as const;
