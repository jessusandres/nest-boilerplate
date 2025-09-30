export const connectMock = jest.fn().mockResolvedValue(undefined);

export const redisClientMock = {
  createClient: jest.fn().mockImplementation(() => {
    return {
      connect: connectMock,
      on: jest.fn(),
      disconnect: jest.fn(),
    };
  }),
};
