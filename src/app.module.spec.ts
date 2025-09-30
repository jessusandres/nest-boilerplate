import { RequestMethod } from '@nestjs/common';

/* Project */
import { LoggerMiddleware } from '@shared/middlewares';
import { AppModule } from './app.module';

describe('AppModule', () => {
  it('should configure LoggerMiddleware for all routes', () => {
    const appModule = new AppModule();

    const forRoutes = jest.fn();
    const apply = jest.fn().mockReturnValue({ forRoutes });
    const consumer = { apply };

    appModule.configure(consumer);

    expect(apply).toHaveBeenCalledWith(LoggerMiddleware);
    expect(forRoutes).toHaveBeenCalledWith({
      path: '*path',
      method: RequestMethod.ALL,
    });
  });
});
