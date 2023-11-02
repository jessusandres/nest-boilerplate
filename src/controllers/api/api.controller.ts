import { Controller, Get, HttpStatus, Post } from '@nestjs/common';

/* Project */
import { ApiService } from '../../services';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('')
  async getLast10(): Promise<any> {
    const data = await this.apiService.getLast10();

    return {
      code: HttpStatus.OK,
      data,
      metadata: {},
    };
  }

  @Post('')
  async syncData(): Promise<any> {
    const data = await this.apiService.syncData();

    return {
      code: HttpStatus.OK,
      data,
      metadata: {},
    };
  }
}
