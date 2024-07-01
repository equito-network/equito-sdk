export const runtime = {
  SessionRuntimeApi: [
    {
      methods: {
        next_session_at: {
          description: "Get the block number at which the next session starts",
          params: [],
          type: "Option<BlockNumber>",
        },
      },
      version: 1,
    },
  ],
};
