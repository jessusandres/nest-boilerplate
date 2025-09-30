export class KeyvMock {
  public store: any;
  public namespace?: string;
  public useKeyPrefix?: boolean;

  private listeners: Record<string, Function[]> = {};

  constructor(opts?: {
    store?: any;
    namespace?: string;
    useKeyPrefix?: boolean;
  }) {
    this.store = opts?.store;
    this.namespace = opts?.namespace;
    this.useKeyPrefix = opts?.useKeyPrefix;
  }

  on = jest.fn((event: string, handler: Function) => {
    this.listeners[event] ??= [];
    this.listeners[event].push(handler);
    return this;
  });

  get = jest.fn(async (_key: string) => undefined);
  set = jest.fn(async (_key: string, _value: unknown, _ttl?: number) => {});
  delete = jest.fn(async (_key: string) => {});
  clear = jest.fn(async () => {});
  disconnect = jest.fn(async () => {});

  __emit(event: string, ...args: any[]) {
    (this.listeners[event] ?? []).forEach((fn) => fn(...args));
  }
}
