import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

/* Project */
import { StorageService } from './storage.service';

const defaultFileName = 'test.pdf';

const mockGetSignedUrl = jest
  .fn()
  .mockImplementation(() => [
    `https://storage.googleapis.com/${defaultFileName}`,
  ]);

const fileInstance = {
  getSignedUrl: mockGetSignedUrl,
};

jest.mock('@google-cloud/storage', () => {
  return {
    Storage: jest.fn().mockImplementation(() => ({
      bucket: jest.fn().mockImplementation(() => ({
        getFiles: jest.fn().mockResolvedValue([[fileInstance]]),
        file: jest.fn().mockReturnValue(fileInstance),
      })),
    })),
    File: jest.fn().mockImplementation(() => ({})),
  };
});

describe('StorageService', () => {
  let storageService: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn().mockReturnValue(''),
      })
      .compile();

    storageService = module.get<StorageService>(StorageService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(storageService).toBeDefined();
  });

  it('should "generateV4UploadSignedUrl" works', async () => {
    const result =
      await storageService.generateV4UploadSignedUrl(defaultFileName);

    expect(result).toBeDefined();
    expect(mockGetSignedUrl).toHaveBeenCalledTimes(1);
    expect(result.publicUrl).toBeDefined();
    expect(result.uploadSignedUrl).toBeDefined();
  });

  it('should "generateV4UploadSignedUrl" works with other extension', async () => {
    const result = await storageService.generateV4UploadSignedUrl('demo.csv');

    expect(result).toBeDefined();
    expect(mockGetSignedUrl).toHaveBeenCalledTimes(1);
    expect(result.publicUrl).toBeDefined();
    expect(result.uploadSignedUrl).toBeDefined();
  });
});
