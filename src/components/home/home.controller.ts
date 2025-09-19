import { Controller, Get, HttpStatus, UseInterceptors } from '@nestjs/common';
import { CacheTTL } from '@nestjs/common/cache';

/* Project */
import { HttpCacheInterceptor } from '@shared/interceptors';
import { minutesInMilliseconds } from '@shared/utils';
import { ApiResponse } from '@shared/dto';
import { ApiOkResponseWithData } from '@shared/decorators/api-ok.decorator';
import { HomeService } from './home.service';
import { FindLastCountryResponse } from './dto';

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
  //  @Roles(Role.ADMIN, Role.CLIENT)
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
}
