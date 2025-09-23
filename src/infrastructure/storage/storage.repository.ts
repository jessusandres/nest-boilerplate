export type SignedUpload = {
  uploadSignedUrl: string;
  publicUrl: string;
  fields?: Record<string, string>;
  headers?: Record<string, string>;
};

export interface StorageRepository {
  generateUploadSignedUrl(
    fileName: string,
    contentType: string,
  ): Promise<SignedUpload>;

  generateReadSignedUrl(filename: string): Promise<string>;
}

export const STORAGE_REPOSITORY = Symbol('STORAGE_REPOSITORY');
