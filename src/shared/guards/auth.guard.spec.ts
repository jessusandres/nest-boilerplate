import { Test } from '@nestjs/testing';
import {
  HttpStatus,
  INestApplication,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { CacheModule } from '@nestjs/cache-manager';

/* External */
import * as request from 'supertest';

/* Project */
import { AuthGuard } from './auth.guard';
import { RedisService } from '../services';
import { HomeController } from '../../components/home/home.controller';
import { HomeService } from '../../components/home/home.service';
import { IUserProfile } from '../interfaces';
import { Role } from '../enums';

describe('AuthGuard', () => {
  let app: INestApplication;
  let authGuard: AuthGuard;
  let reflector: Reflector;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule.forRoot(), CacheModule.register()],
      controllers: [HomeController],
      providers: [HomeService, AuthGuard],
    })
      .overrideProvider(HomeService)
      .useValue({
        getLastCountry: jest.fn().mockResolvedValue(null),
      })
      .overrideProvider(RedisService)
      .useValue({
        getKeys: jest.fn().mockResolvedValue([]),
      })
      .compile();

    app = moduleRef.createNestApplication();
    reflector = app.get(Reflector);

    app.useGlobalGuards(new AuthGuard(reflector));
    authGuard = moduleRef.get<AuthGuard>(AuthGuard);

    app.useLogger(new Logger());

    await app.init();
  });

  it(`should prevent access (unauthorized)`, async () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should return "true"', () => {
    const testUser: IUserProfile = {
      role: Role.CLIENT,
      email: 'test',
      name: 'Test',
      id: 1,
      roleId: 3,
    };

    const mockGetRequestUser = jest.fn().mockReturnValue({
      params: {},
      body: {},
      query: {
        userId: 1,
        userType: Role.CLIENT,
      },
      user: testUser,
      headers: {
        authorization: 'Bearer token',
      },
    });

    const mockedContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: mockGetRequestUser,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    };

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false);

    const result = authGuard.canActivate(mockedContext as any);

    expect(result).toBe(true);
  });

  it('should throw exception when userId does not match', () => {
    const testUser: IUserProfile = {
      role: Role.CLIENT,
      email: 'test',
      name: 'Test',
      id: 1,
      roleId: 3,
    };

    const mockGetRequestUser = jest.fn().mockReturnValue({
      params: {},
      body: {},
      query: {},
      user: testUser,
      headers: {
        authorization: 'Bearer token',
      },
    });

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false);

    const mockedContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: mockGetRequestUser,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    };

    try {
      authGuard.canActivate(mockedContext as any);
    } catch (err) {
      console.log({ err });
      expect(err).toBeInstanceOf(UnauthorizedException);
    }
  });
});
