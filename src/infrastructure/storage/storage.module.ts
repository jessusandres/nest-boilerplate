import { Module } from '@nestjs/common';
import { STORAGE_REPOSITORY } from './storage.repository';
import { ConfigService } from '@nestjs/config';

/* Project */
import { AwsS3StorageRepository } from './aws-s3-storage.repository';
import { GoogleCloudStorageRepository } from './google-cloud-storage.repository';

@Module({
  imports: [],
  providers: [
    {
      provide: STORAGE_REPOSITORY,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const provider = configService.get<string>('STORAGE_PROVIDER')!;

        if (provider === 'aws') {
          return new AwsS3StorageRepository(configService);
        }

        return new GoogleCloudStorageRepository(configService);
      },
    },
  ],
  exports: [STORAGE_REPOSITORY],
})
export class StorageModule {}
