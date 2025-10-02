import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/* External */
import {
  GetSignedUrlConfig,
  GetSignedUrlResponse,
  Storage,
} from '@google-cloud/storage';

/* Project */
import { StorageRepository } from './storage.repository';
import { minutesInMilliseconds } from '@shared/utils';

export class GoogleCloudStorageRepository implements StorageRepository {
  private readonly logger = new Logger(GoogleCloudStorageRepository.name);

  private readonly storage: Storage;
  private readonly bucketName: string;
  private readonly projectID: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get('BUCKET_NAME')!;
    this.projectID = this.configService.get('BUCKET_PROJECT_ID')!;

    const credentials = {
      projectId: this.projectID,
    };

    this.storage = new Storage(credentials);

    this.logger.debug(
      `GoogleCloudStorage service initialized using: ${this.bucketName} bucket`,
    );
  }

  async generateReadSignedUrl(fileName: string): Promise<string> {
    this.logger.debug(`Generating v4 read signed url for ${fileName}`);

    // Get a v4 signed URL for reading the file
    const [url] = await this.storage
      .bucket(this.bucketName)
      .file(fileName)
      .getSignedUrl({
        action: 'read',
        version: 'v4',
        expires: Date.now() + minutesInMilliseconds(5),
      });

    return url;
  }

  async generateUploadSignedUrl(
    fileName: string,
    contentType: string,
  ): Promise<string> {
    this.logger.debug(`Generating upload signed url for ${fileName}`);

    // These options will allow temporary uploading of the file with outgoing
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + minutesInMilliseconds(5),
      contentType,
    };

    const [uploadSignedUrl]: GetSignedUrlResponse = await this.storage
      .bucket(this.bucketName)
      .file(fileName)
      .getSignedUrl(options);

    return uploadSignedUrl;
  }
}
