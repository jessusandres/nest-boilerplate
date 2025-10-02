import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

const mockGetSignedUrl = jest
  .fn()
  .mockResolvedValue('https://signed-url.example');

const PutObjectCommandMock = jest
  .fn()
  .mockImplementation((params) => ({ params }));

const GetObjectCommandMock = jest
  .fn()
  .mockImplementation((params) => ({ params }));

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => ({})),
    PutObjectCommand: PutObjectCommandMock,
    GetObjectCommand: GetObjectCommandMock,
  };
});

jest.mock('@aws-sdk/s3-request-presigner', () => {
  return {
    getSignedUrl: mockGetSignedUrl,
  };
});

/* Project */
import { AwsS3StorageRepository } from './aws-s3-storage.repository';

const defaultFileName = 'test.pdf';
const defaultContentType = 'application/pdf';
const publicBaseUrl = 'https://cdn.example.com/assets';

describe('AwsS3StorageRepository', () => {
  let repository: AwsS3StorageRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'TestAWSStorageRepository',
          inject: [ConfigService],
          useFactory: (configService) =>
            new AwsS3StorageRepository(configService),
        },
        ConfigService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn((key: string) => {
          switch (key) {
            case 'S3_BUCKET_NAME':
              return 'my-bucket';
            case 'AWS_REGION':
              return 'us-east-1';
            default:
              return undefined;
          }
        }),
      })
      .compile();

    repository = module.get<AwsS3StorageRepository>('TestAWSStorageRepository');

    await module.init();
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined (no public base URL)', async () => {
    expect(repository).toBeDefined();
  });

  it('generateReadSignedUrl should call getSignedUrl with GetObjectCommand and return URL', async () => {
    const url = await repository.generateReadSignedUrl(
      defaultFileName,
      'application/pdf',
    );

    expect(url).toBeDefined();
    expect(typeof url).toBe('string');

    expect(mockGetSignedUrl).toHaveBeenCalledTimes(1);
    const [, commandArg, options] = mockGetSignedUrl.mock.calls[0];

    expect(commandArg).toHaveProperty('params');
    expect(commandArg.params).toMatchObject({
      Bucket: 'my-bucket',
      Key: defaultFileName,
    });

    expect(options).toMatchObject({ expiresIn: expect.any(Number) });
  });

  it('generateUploadSignedUrl should create signed URL and default public URL when no base provided', async () => {
    const result = await repository.generateUploadSignedUrl(
      defaultFileName,
      defaultContentType,
    );

    expect(result).toBeDefined();
    expect(result).toBe('https://signed-url.example');

    expect(PutObjectCommandMock).toHaveBeenCalledTimes(1);
    expect(mockGetSignedUrl).toHaveBeenCalledTimes(1);

    expect(PutObjectCommandMock).toHaveBeenCalledWith({
      Bucket: 'my-bucket',
      Key: defaultFileName,
      ContentType: defaultContentType,
      ACL: 'private',
    });
  });
});
