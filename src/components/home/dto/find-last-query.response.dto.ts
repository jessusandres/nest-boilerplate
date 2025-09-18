import { ApiProperty } from '@nestjs/swagger';

export class FindLastCountryResponse {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;
}
