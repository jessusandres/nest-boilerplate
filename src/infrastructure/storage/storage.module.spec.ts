import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';

const mockGoogleCloudStorageRepository = jest.fn().mockImplementation(() => {});
const mockAwsS3StorageRepository = jest.fn().mockImplementation(() => {});

jest.mock('./google-cloud-storage.repository', () => {
  return { GoogleCloudStorageRepository: mockGoogleCloudStorageRepository };
});

jest.mock('./aws-s3-storage.repository', () => {
  return { AwsS3StorageRepository: mockAwsS3StorageRepository };
});

/* Project */
import { StorageModule } from './storage.module';

describe('StorageModule for default (GCP)', () => {
  let moduleRef: TestingModule;
  let storageModule: StorageModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), StorageModule],
      providers: [ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn().mockImplementation((key: string) => key.toUpperCase()),
      })
      .compile();

    storageModule = moduleRef.get(StorageModule);

    await moduleRef.init();
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(moduleRef).toBeDefined();
    expect(storageModule).toBeDefined();
  });

  it('should new GoogleCloudStorageRepository has been called', () => {
    expect(mockGoogleCloudStorageRepository).toHaveBeenCalledTimes(1);
  });
});

describe('StorageModule for AWS', () => {
  let moduleRef: TestingModule;
  let storageModule: StorageModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), StorageModule],
      providers: [ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn().mockImplementation((key: string) => {
          if (key === 'STORAGE_PROVIDER') {
            return 'aws';
          }

          return key.toUpperCase();
        }),
      })
      .compile();

    storageModule = moduleRef.get(StorageModule);

    await moduleRef.init();
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(moduleRef).toBeDefined();
    expect(storageModule).toBeDefined();
  });

  it('should new GoogleCloudStorageRepository has been called', () => {
    expect(mockAwsS3StorageRepository).toHaveBeenCalledTimes(1);
  });
});
