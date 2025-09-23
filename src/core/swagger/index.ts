import { DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

export const setupSwagger = (configService: ConfigService) => {
  const swaggerOptions = {
    title: configService.get<string>('APP_NAME')!,
    description: configService.get<string>('APP_DESCRIPTION')!,
    version: configService.get<string>('API_VERSION') || '1.0',
  };

  // Swagger configuration
  return new DocumentBuilder()
    .setTitle(swaggerOptions.title)
    .setDescription(swaggerOptions.description)
    .setVersion(swaggerOptions.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
};
