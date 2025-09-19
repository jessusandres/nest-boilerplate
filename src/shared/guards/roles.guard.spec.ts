import { Test } from '@nestjs/testing';
import {
  HttpStatus,
  INestApplication,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/* Project */
import { mockGetRequest, mockGetResponse } from '@tests/mocks/HttpContext.mock';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { Role } from '../enums';
import { IUserProfile } from '../interfaces';

describe('RolesGuard', () => {
  let app: INestApplication;
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [RolesGuard, Reflector],
    }).compile();

    app = moduleRef.createNestApplication();

    reflector = moduleRef.get<Reflector>(Reflector);
    app.useGlobalGuards(new AuthGuard(reflector));
    app.useGlobalGuards(new RolesGuard(reflector));

    rolesGuard = moduleRef.get<RolesGuard>(RolesGuard);

    app.useLogger(new Logger());

    await app.init();
  });

  it('should be defined', () => {
    expect(rolesGuard).toBeDefined();
  });

  it(`should prevent access (unauthorized) when roles don't match`, () => {
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
    });

    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockImplementation(() => [Role.ADMIN]);

    const mockedContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: mockGetResponse,
        getRequest: mockGetRequestUser,
      }),
      getHandler: jest.fn().mockReturnValue({}),
      getClass: jest.fn().mockReturnValue({}),
    };

    try {
      rolesGuard.canActivate(mockedContext as any);
    } catch (e) {
      expect(e.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(e).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('should "canActivate" works when roles is empty', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation(() => []);
    const mockedContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: mockGetResponse,
        getRequest: mockGetRequest,
      }),
      getHandler: jest.fn().mockReturnValue({}),
      getClass: jest.fn().mockReturnValue({}),
    };

    const result = rolesGuard.canActivate(mockedContext as any);

    expect(result).toBe(true);
  });

  it('should "canActivate" works when user have permission', () => {
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
    });

    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockImplementation(() => [Role.CLIENT]);

    const mockedContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: mockGetResponse,
        getRequest: mockGetRequestUser,
      }),
      getHandler: jest.fn().mockReturnValue({}),
      getClass: jest.fn().mockReturnValue({}),
    };

    const result = rolesGuard.canActivate(mockedContext as any);

    expect(result).toBe(true);
  });

  it('should "canActivate" works when requiredRoles does not has a length', () => {
    const mockGetRequestUser = jest.fn().mockReturnValue({
      params: {},
      body: {},
      query: {},
      user: {},
    });

    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation(() => null);

    const mockedContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: mockGetResponse,
        getRequest: mockGetRequestUser,
      }),
      getHandler: jest.fn().mockReturnValue({}),
      getClass: jest.fn().mockReturnValue({}),
    };

    const result = rolesGuard.canActivate(mockedContext as any);

    expect(result).toBe(true);
  });
});
