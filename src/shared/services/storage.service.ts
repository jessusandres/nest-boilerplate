import { Inject, Injectable, Logger } from '@nestjs/common';

/* Project */
import { STORAGE_REPOSITORY, StorageRepository } from '@infrastructure/storage';
import { isFileName } from '@shared/utils';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  private readonly storageTypes = [
    { extension: 'pdf', contentType: 'application/pdf' },
    { extension: 'csv', contentType: 'text/csv' },
    { extension: 'txt', contentType: 'text/plain' },
    { extension: 'jpg', contentType: 'image/jpeg' },
    { extension: 'png', contentType: 'image/png' },
    { extension: 'gif', contentType: 'image/gif' },
    { extension: 'webp', contentType: 'image/webp' },
    { extension: 'svg', contentType: 'image/svg+xml' },
  ];

  constructor(
    @Inject(STORAGE_REPOSITORY)
    private readonly storage: StorageRepository,
  ) {}

  async generateUploadSignedUrl(fileName: string) {
    this.logger.debug(`Generating upload signed url for ${fileName}`);

    const isFileValid = isFileName(fileName);

    if (!isFileValid) throw new Error('Invalid file name');

    const extension = fileName.split('.').pop();

    const storageType = this.storageTypes.find(
      (t) => t.extension === extension,
    );

    if (!storageType) {
      throw new Error('Invalid file type');
    }

    return this.storage.generateUploadSignedUrl(
      fileName,
      storageType.contentType,
    );
  }

  async generateReadSignedUrl(fileName: string) {
    this.logger.debug(`Generating read signed url for ${fileName}`);
    const isFileValid = isFileName(fileName);

    if (!isFileValid) throw new Error('Invalid file name');

    const extension = fileName.split('.').pop();
    const storageType = this.storageTypes.find(
      (t) => t.extension === extension,
    );

    if (!storageType) {
      throw new Error('Invalid file type');
    }

    return this.storage.generateReadSignedUrl(fileName);
  }
}
