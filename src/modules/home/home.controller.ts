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
import { ApiOkResponseWithData } from '@shared/decorators/api-ok.decorator';
import { HomeService } from './home.service';
import { CreateCountryReqDto, FindLastCountryResponse } from './dto';
import { Role } from '@shared/enums';
import { Roles } from '@shared/decorators';

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

  @Post('/')
  @Roles(Role.ADMIN)
  async createCountry(@Body() payload: CreateCountryReqDto) {
    const data = await Promise.resolve({ name: payload.name, id: 0 });

    return new ApiResponse(data, HttpStatus.OK);
  }
}
