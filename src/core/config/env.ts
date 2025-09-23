export function getEnv(): string[] {
  switch (process.env.NODE_ENV) {
    case 'test':
      return ['test/.env-test', '.env.example'];
    case 'stage':
      return ['.env.stage', '.env'];
    case 'development':
      return ['.env.development', '.env'];
    case 'production':
    default:
      return ['.env'];
  }
}
