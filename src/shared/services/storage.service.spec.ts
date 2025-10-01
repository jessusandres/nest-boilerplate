import { Test, TestingModule } from '@nestjs/testing';

/* Project */
import { STORAGE_REPOSITORY, StorageRepository } from '@infrastructure/storage';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let moduleRef: TestingModule;
  let storageService: StorageService;
  let storageRepository: StorageRepository;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: STORAGE_REPOSITORY,
          useValue: {
            generateUploadSignedUrl: jest.fn(),
            generateReadSignedUrl: jest.fn(),
          },
        },
        StorageService,
      ],
      controllers: [],
    }).compile();

    storageService = moduleRef.get(StorageService);
    storageRepository = moduleRef.get(STORAGE_REPOSITORY);

    await moduleRef.init();
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(storageRepository).toBeDefined();
    expect(storageService).toBeDefined();
  });

  it('should "generateUploadSignedUrl" works', async () => {
    const expectedURL = 'https://storage.googleapis.com/test.pdf';

    jest
      .spyOn(storageRepository, 'generateUploadSignedUrl')
      .mockResolvedValueOnce(expectedURL as never);

    const result = await storageService.generateUploadSignedUrl('test.pdf');

    expect(result).toBeDefined();
    expect(result).toBe(expectedURL);

    expect(storageRepository.generateUploadSignedUrl).toHaveBeenCalledTimes(1);
  });

  it('should "generateUploadSignedUrl" fails with no extension', async () => {
    const result = await storageService
      .generateUploadSignedUrl('test')
      .catch((err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('Invalid file name');
      });

    expect(result).not.toBeDefined();

    expect(storageRepository.generateUploadSignedUrl).toHaveBeenCalledTimes(0);
  });

  it('should "generateUploadSignedUrl" fails with invalid extension', async () => {
    const result = await storageService
      .generateUploadSignedUrl('test.xyz')
      .catch((err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('Invalid file type');
      });

    expect(result).not.toBeDefined();

    expect(storageRepository.generateUploadSignedUrl).toHaveBeenCalledTimes(0);
  });

  it('should "generateReadSignedUrl" works', async () => {
    const expectedURL = 'https://storage.googleapis.com/test.pdf';

    jest
      .spyOn(storageRepository, 'generateReadSignedUrl')
      .mockResolvedValueOnce(expectedURL as never);

    const result = await storageService.generateReadSignedUrl('test.pdf');

    expect(result).toBeDefined();
    expect(result).toBe(expectedURL);

    expect(storageRepository.generateReadSignedUrl).toHaveBeenCalledTimes(1);
  });

  it('should "generateReadSignedUrl" fails with no extension', async () => {
    const result = await storageService
      .generateReadSignedUrl('test')
      .catch((err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('Invalid file name');
      });

    expect(result).not.toBeDefined();

    expect(storageRepository.generateReadSignedUrl).toHaveBeenCalledTimes(0);
  });

  it('should "generateReadSignedUrl" fails with invalid extension', async () => {
    const result = await storageService
      .generateReadSignedUrl('test.xyz')
      .catch((err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('Invalid file type');
      });

    expect(result).not.toBeDefined();

    expect(storageRepository.generateReadSignedUrl).toHaveBeenCalledTimes(0);
  });
});
