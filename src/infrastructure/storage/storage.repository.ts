export interface StorageRepository {
  generateUploadSignedUrl(
    fileName: string,
    contentType: string,
  ): Promise<string>;

  generateReadSignedUrl(filename: string, contentType: string): Promise<string>;
}

export const STORAGE_REPOSITORY = Symbol('STORAGE_REPOSITORY');
