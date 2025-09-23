import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/* Project */
import { StorageRepository, SignedUpload } from './storage.repository';

@Injectable()
export class AwsS3StorageRepository implements StorageRepository {
  private readonly logger = new Logger(AwsS3StorageRepository.name);

  private readonly client: S3Client;
  private readonly bucketName: string;
  private readonly publicBaseUrl?: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME')!;
    this.publicBaseUrl = this.configService.get<string>('S3_PUBLIC_BASE_URL');
    this.client = new S3Client({
      region: this.configService.get<string>('AWS_REGION')!,
    });
  }

  async generateReadSignedUrl(fileName: string): Promise<string> {
    this.logger.debug(`Generating read signed url for ${fileName}`);

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });

    return getSignedUrl(this.client, command, { expiresIn: 120 });
  }

  async generateUploadSignedUrl(
    fileName: string,
    contentType: string,
  ): Promise<SignedUpload> {
    this.logger.debug(`Generating upload signed url for ${fileName}`);

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      ContentType: contentType,
      ACL: 'public-read',
    });

    const uploadSignedUrl = await getSignedUrl(this.client, command, {
      expiresIn: 120,
    });
    const publicUrl = this.publicBaseUrl
      ? `${this.publicBaseUrl}/${fileName}`
      : `https://${this.bucketName}.s3.amazonaws.com/${fileName}`;

    return {
      uploadSignedUrl,
      publicUrl,
      headers: { 'Content-Type': contentType },
    };
  }
}
