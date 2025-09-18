import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/* External */
import {
  GetSignedUrlConfig,
  GetSignedUrlResponse,
  Storage,
} from '@google-cloud/storage';

/* Project */
import { fileExtension } from '../helpers';

@Injectable()
export class StorageService {
  private readonly cloudStorage: Storage;
  private readonly bucketName: string;
  private readonly storageApiUrl = 'https://storage.googleapis.com';

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get('BUCKET_NAME')!;
    const b64PrivateKey = this.configService.get<string>('BUCKET_PRIVATE_KEY');

    const credentials = {};

    if (b64PrivateKey) {
      const decodedBase64PrivateKey = Buffer.from(
        b64PrivateKey,
        'base64',
      ).toString('utf-8');

      credentials['private_key'] = decodedBase64PrivateKey
        .split(String.raw`\n`)
        .join('\n');

      const serviceAccountEmail =
        this.configService.get<string>('BUCKET_SA_EMAIL');
      credentials['client_email'] = serviceAccountEmail;
    }

    this.cloudStorage = new Storage(credentials);
  }

  async generateV4UploadSignedUrl(
    fileName: string,
  ): Promise<{ uploadSignedUrl: string; publicUrl: string }> {
    // These options will allow temporary uploading of the file with outgoing
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 2 * 60 * 1000, // 2 minutes
      contentType:
        fileExtension(fileName).toLowerCase() === 'pdf'
          ? 'application/pdf'
          : 'text/csv',
      extensionHeaders: {
        'X-Goog-Acl': 'public-read',
      },
    };

    // Get a v4 signed URL for uploading file
    const [uploadSignedUrl]: GetSignedUrlResponse = await this.cloudStorage
      .bucket(this.bucketName)
      .file(fileName)
      .getSignedUrl(options);

    const publicUrl = `${this.storageApiUrl}/${this.bucketName}/${fileName}`;

    return { uploadSignedUrl, publicUrl };
  }
}
