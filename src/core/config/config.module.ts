import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

/* Project */
import { EnvValidation } from './env.validator';
import { getEnv } from './env';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: EnvValidation,
      isGlobal: true,
      expandVariables: true,
      envFilePath: getEnv(),
    }),
  ],
  providers: [],
  exports: [ConfigModule],
})
export class AppConfigModule {}
