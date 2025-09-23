/* External */
import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

enum Enabling {
  Enabled = 'true',
  Disabled = 'false',
}

interface IEnvironment {
  NODE_ENV: string;
  APP_NAME: string;
  API_VERSION?: string;
  HOST: string;
  PORT: number;
  PATH_PREFIX: string;
  DB_CONNECTION: string;
  DB_SSL: string;
  DB_HOST: string;
  DB_DATABASE: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_LOGGER: string;
  DB_SYNC: string;
  DB_MAX_CONNECTIONS: number;
  DB_MIN_CONNECTIONS: number;
  THROTTLE_TTL: number;
  THROTTLE_LIMIT: number;
  ENABLE_REDIS: string;
  CACHE_TIMEOUT: number;
  REDIS_HOST?: string;
  REDIS_PORT?: number;
  REDIS_USERNAME?: string;
  REDIS_PASSWORD?: string;
  REDIS_CA?: string;
  STORAGE_PROVIDER?: string;
  BUCKET_NAME?: string;
  BUCKET_PROJECT_ID?: string;
}

class EnvironmentVariables implements IEnvironment {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  APP_NAME: string;

  @IsOptional()
  @IsString()
  API_VERSION: string;

  @IsString()
  HOST: string;

  @IsString()
  PATH_PREFIX: string;

  @IsString()
  DB_CONNECTION: string;

  @IsString()
  DB_HOST: string;

  @IsString()
  DB_DATABASE: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsEnum(Enabling)
  DB_SSL: string;

  @IsOptional()
  @IsEnum(Enabling)
  DB_SYNC: string = 'false';

  @IsOptional()
  @IsEnum(Enabling)
  DB_LOGGER: string = 'false';

  @IsNumber()
  DB_MAX_CONNECTIONS: number;

  @IsNumber()
  DB_MIN_CONNECTIONS: number;

  @IsOptional()
  @IsString()
  STORAGE_PROVIDER?: string = 'gcp';

  @IsOptional()
  @IsString()
  BUCKET_NAME: string;

  @IsOptional()
  @IsString()
  BUCKET_PROJECT_ID: string;

  @IsNumber()
  THROTTLE_TTL: number;

  @IsNumber()
  THROTTLE_LIMIT: number;

  @IsEnum(Enabling)
  ENABLE_REDIS: string;

  @IsOptional()
  @IsString()
  REDIS_HOST: string;

  @IsOptional()
  @IsNumber()
  REDIS_PORT: number;

  @IsOptional()
  @IsString()
  REDIS_USERNAME: string = '';

  @IsOptional()
  @IsString()
  REDIS_PASSWORD: string = '';

  @IsOptional()
  @IsNumber()
  CACHE_TIMEOUT: number;

  @IsOptional()
  @IsString()
  REDIS_CA?: string;
}

export function EnvValidation(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) throw new Error(errors.toString());

  return validatedConfig;
}
