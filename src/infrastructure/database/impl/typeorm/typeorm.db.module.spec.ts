jest.mock('@nestjs/typeorm', () => {
  return {
    TypeOrmModule: {
      forRootAsync: jest.fn().mockReturnValue({
        module: class FakeTypeOrmModule {},
      }),
      forFeature: jest.fn().mockReturnValue({
        module: class FakeTypeOrmModule {},
      }),
    },
    InjectRepository: () => () => {},
  };
});

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';

/* Project */
import TypeOrmDbModule from '@infrastructure/database/impl/typeorm/typeorm.db.module';
import { COUNTRY_REPOSITORY } from '@infrastructure/database/repositories';

class MockCountryRepo {
  findAll = jest.fn().mockResolvedValue([{ id: 1, name: 'Peru' }]);
}

describe('TypeormDbModule by default', () => {
  let moduleRef: TestingModule;
  let typeOrmDbModule: TypeOrmDbModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), TypeOrmDbModule],
      controllers: [],
      providers: [],
    })
      .overrideProvider(COUNTRY_REPOSITORY)
      .useClass(MockCountryRepo)
      .compile();

    typeOrmDbModule = moduleRef.get(TypeOrmDbModule);

    await moduleRef.init();
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(typeOrmDbModule).toBeDefined();
  });
});

describe('TypeormDbModule by default with SSL Options', () => {
  let moduleRef: TestingModule;
  let typeOrmDbModule: TypeOrmDbModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), TypeOrmDbModule],
      controllers: [],
      providers: [],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn().mockImplementation((key: string) => {
          if (key === 'DB_SSL') return 'true';

          return key.toUpperCase();
        }),
      })
      .overrideProvider(COUNTRY_REPOSITORY)
      .useClass(MockCountryRepo)
      .compile();

    typeOrmDbModule = moduleRef.get(TypeOrmDbModule);

    await moduleRef.init();
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(typeOrmDbModule).toBeDefined();
  });
});
