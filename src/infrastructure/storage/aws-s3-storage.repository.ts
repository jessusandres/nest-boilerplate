import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/* Project */
import { StorageRepository } from './storage.repository';
import { minutesInSeconds } from '@shared/utils';

export class AwsS3StorageRepository implements StorageRepository {
  private readonly logger = new Logger(AwsS3StorageRepository.name);

  private readonly client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME')!;
    this.client = new S3Client({
      region: this.configService.get<string>('AWS_REGION')!,
    });
  }

  async generateReadSignedUrl(
    fileName: string,
    contentType: string,
  ): Promise<string> {
    this.logger.debug(`Generating read signed url for ${fileName}`);

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      ResponseContentType: contentType,
      ResponseContentDisposition: 'inline',
    });

    return getSignedUrl(this.client, command, {
      expiresIn: minutesInSeconds(5),
    });
  }

  async generateUploadSignedUrl(
    fileName: string,
    contentType: string,
  ): Promise<string> {
    this.logger.debug(`Generating upload signed url for ${fileName}`);

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      ContentType: contentType,
      ACL: 'private',
    });

    return getSignedUrl(this.client, command, {
      expiresIn: minutesInSeconds(5),
    });
  }
}
