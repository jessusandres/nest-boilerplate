import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';

/* Project */
import { MockResponse } from '@tests/mocks';
import { LoggerMiddleware } from './logger.middleware';

interface MockRequest {
  ip: string;
  method: string;
  originalUrl: string;
  get: (name: string) => string | undefined;
}

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  let loggerSpyLog = jest.spyOn(Logger.prototype, 'log');

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [LoggerMiddleware],
    }).compile();

    moduleRef.useLogger(new Logger());

    middleware = moduleRef.get(LoggerMiddleware);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should log request information on response close', () => {
    const req: MockRequest = {
      ip: '127.0.0.1',
      method: 'GET',
      originalUrl: '/health',
      get: (name: string) => {
        if (name.toLowerCase() === 'user-agent') return 'jest-agent';
        return undefined;
      },
    };

    const res = new MockResponse();
    res.statusCode = 204;
    res.set('content-length', '0');

    const next = jest.fn();

    middleware.use(req as any, res as any, next);

    // next should be called immediately
    expect(next).toHaveBeenCalled();

    // Trigger the 'close' event to simulate response finished
    res.emit('close');

    expect(loggerSpyLog).toHaveBeenCalledWith(
      'GET /health 204:0ms size:0 - jest-agent 127.0.0.1',
    );
  });
});
