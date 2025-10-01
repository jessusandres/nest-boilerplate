import { EventEmitter } from 'events';

export const mockJson = jest.fn();

export const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));

export const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));

export const mockGetRequest = jest.fn().mockReturnValue({
  params: {},
  body: {},
  query: {},
});

export const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: mockGetRequest,
}));

export const argumentsHostMock = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

export class MockResponse extends EventEmitter {
  statusCode = 200;
  private headers: Record<string, string> = {};

  get(name: string): string | undefined {
    return this.headers[name.toLowerCase()];
  }

  set(name: string, value: string) {
    this.headers[name.toLowerCase()] = value;
  }
}
