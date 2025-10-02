import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CacheTTL } from '@nestjs/common/cache';

/* Project */
import { HttpCacheInterceptor } from '@shared/interceptors';
import { minutesInMilliseconds } from '@shared/utils';
import { ApiResponse } from '@shared/dto';
import { ApiOkResponseWithData, Roles } from '@shared/decorators';
import { Role } from '@shared/enums';
import { HomeService } from './home.service';
import { CreateCountryReqDto, FindLastCountryResponse } from './dto';

@Controller()
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @ApiOkResponseWithData(FindLastCountryResponse, {
    description: 'Get last country',
    nullable: true,
  })
  @UseInterceptors(HttpCacheInterceptor)
  @CacheTTL(minutesInMilliseconds(5))
  @Get('/')
  async getLastCountry(): Promise<
    ApiResponse<FindLastCountryResponse | undefined>
  > {
    const data = await this.homeService.getLastCountry();

    return new ApiResponse(data, HttpStatus.OK);
  }

  @Get('/cache-keys')
  async cacheKeys(): Promise<unknown> {
    const data = await this.homeService.getCacheKeys();

    return new ApiResponse(data, HttpStatus.OK);
  }

  @Get('/presign-read-url/:filename')
  async presignURL(@Param('filename') filename: string): Promise<unknown> {
    const data = await this.homeService.presignReadURL(filename);

    return new ApiResponse(data, HttpStatus.OK);
  }

  @Get('/presign-upload-url/:filename')
  async presignUploadURL(
    @Param('filename') filename: string,
  ): Promise<unknown> {
    const data = await this.homeService.presignUploadReadURL(filename);

    return new ApiResponse(data, HttpStatus.OK);
  }

  @Post('/')
  @Roles(Role.ADMIN)
  async createCountry(@Body() payload: CreateCountryReqDto) {
    const data = await Promise.resolve({ name: payload.name, id: 0 });

    return new ApiResponse(data, HttpStatus.CREATED);
  }
}
