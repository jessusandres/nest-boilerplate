import { getEnv } from './env';

describe('getEnv', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    jest.resetModules();
  });

  it('returns test env files when NODE_ENV is test', () => {
    process.env.NODE_ENV = 'test';
    expect(getEnv()).toEqual(['test/.env-test', '.env.example']);
  });

  it('returns stage env files when NODE_ENV is stage', () => {
    process.env.NODE_ENV = 'stage';
    expect(getEnv()).toEqual(['.env.stage', '.env']);
  });

  it('returns development env files when NODE_ENV is development', () => {
    process.env.NODE_ENV = 'development';
    expect(getEnv()).toEqual(['.env.development', '.env']);
  });

  it('returns production env files when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';
    expect(getEnv()).toEqual(['.env']);
  });

  it('returns default env files when NODE_ENV is undefined or other', () => {
    delete process.env.NODE_ENV;
    expect(getEnv()).toEqual(['.env']);

    process.env.NODE_ENV = 'unknown';
    expect(getEnv()).toEqual(['.env']);
  });
});
