import {
  Inject,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';

/* Project */
import { STORAGE_REPOSITORY, StorageRepository } from '@infrastructure/storage';
import { isFileName } from '@shared/utils';
import { fileExtension } from '@shared/helpers';

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

  validaFileName(filename: string): {
    filename: string;
    extension: string;
    contentType: string;
  } {
    const trimmedFilename = filename.trim();

    const isFileValid = isFileName(trimmedFilename);

    if (!isFileValid)
      throw new UnprocessableEntityException('Invalid file name');

    const extension = fileExtension(trimmedFilename);

    const storageType = this.storageTypes.find(
      (t) => t.extension === extension,
    );

    if (!storageType) {
      throw new UnprocessableEntityException('Invalid file type');
    }

    return {
      filename: trimmedFilename,
      extension: storageType.extension,
      contentType: storageType.contentType,
    };
  }

  async generateUploadSignedUrl(rawFilename: string) {
    this.logger.debug(`Generating upload signed url for ${rawFilename}`);

    const { filename, contentType } = this.validaFileName(rawFilename);

    return this.storage.generateUploadSignedUrl(filename, contentType);
  }

  async generateReadSignedUrl(rawFilename: string) {
    this.logger.debug(`Generating read signed url for ${rawFilename}`);

    const { filename, contentType } = this.validaFileName(rawFilename);

    return this.storage.generateReadSignedUrl(filename, contentType);
  }
}
