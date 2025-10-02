import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

/* Project */
import { GoogleCloudStorageRepository } from './google-cloud-storage.repository';

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
  let storageService: GoogleCloudStorageRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        {
          provide: 'TestGoogleCloudStorageRepository',
          inject: [ConfigService],
          useFactory: (configService) =>
            new GoogleCloudStorageRepository(configService),
        },
      ],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn().mockReturnValue(''),
      })
      .compile();

    storageService = module.get<GoogleCloudStorageRepository>(
      'TestGoogleCloudStorageRepository',
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(storageService).toBeDefined();
  });

  it('should "generateV4UploadSignedUrl" works', async () => {
    const result = await storageService.generateUploadSignedUrl(
      defaultFileName,
      'application/pdf',
    );

    expect(result).toBeDefined();
    expect(mockGetSignedUrl).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    expect(result).toBeDefined();
  });

  it('should "generateV4UploadSignedUrl" works with other extension', async () => {
    const result = await storageService.generateUploadSignedUrl(
      'demo.csv',
      'text/csv',
    );

    expect(result).toBeDefined();
    expect(mockGetSignedUrl).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    expect(result).toBeDefined();
  });

  it('should "generateReadSignedUrl" works', async () => {
    const result = await storageService.generateReadSignedUrl('demo.pdf');

    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
    expect(result).toBe(`https://storage.googleapis.com/${defaultFileName}`);

    expect(mockGetSignedUrl).toHaveBeenCalledTimes(1);
  });
});
