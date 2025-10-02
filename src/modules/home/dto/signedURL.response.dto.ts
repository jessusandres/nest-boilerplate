import { ApiProperty } from '@nestjs/swagger';

export class SignedURLResponseDto {
  @ApiProperty({ type: String })
  url: string;
}
