import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCountryReqDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;
}
