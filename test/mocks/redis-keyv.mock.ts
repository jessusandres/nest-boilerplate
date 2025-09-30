export class KeyvRedisMock {
  public client: any;

  constructor(client?: any, _opts?: any) {
    this.client = client ?? {
      on: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
      keys: jest.fn().mockResolvedValue([]),
    };
  }
}
