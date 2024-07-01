export const routerAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_chainSelector",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_initialVerifier",
        type: "address",
        internalType: "address",
      },
      {
        name: "_equitoFees",
        type: "address",
        internalType: "address",
      },
      {
        name: "_equitoAddress",
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
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "chainSelector",
    inputs: [],
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
    name: "deliverAndExecuteMessage",
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
      {
        name: "verifierIndex",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "proof",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "deliverMessages",
    inputs: [
      {
        name: "messages",
        type: "tuple[]",
        internalType: "struct EquitoMessage[]",
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
        name: "verifierIndex",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "proof",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "equitoAddress",
    inputs: [],
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
    name: "equitoFees",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IEquitoFees",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "executeMessage",
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
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "getFee",
    inputs: [
      {
        name: "sender",
        type: "address",
        internalType: "address",
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
    name: "isDuplicateMessage",
    inputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
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
    stateMutability: "payable",
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
    name: "storedMessages",
    inputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "verifiers",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IEquitoVerifier",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "EquitoAddressSet",
    inputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "EquitoFeesSet",
    inputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "MessageDelivered",
    inputs: [
      {
        name: "messageHash",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MessageExecuted",
    inputs: [
      {
        name: "messageHash",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MessageSendRequested",
    inputs: [
      {
        name: "message",
        type: "tuple",
        indexed: false,
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
        indexed: false,
        internalType: "bytes",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "VerifierAdded",
    inputs: [
      {
        name: "verifier",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "InitialVerifierZeroAddress",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidMessagesProof",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidOperation",
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
    name: "InvalidSovereign",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidVerifierIndex",
    inputs: [],
  },
] as const;
