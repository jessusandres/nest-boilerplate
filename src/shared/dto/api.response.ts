import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty({
    description: 'Response data',
  })
  data: T;

  @ApiProperty({
    description: 'Status code',
    example: '200',
  })
  status: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Success',
  })
  message?: string;

  @ApiProperty({
    description: 'Some metadata',
    example: {},
  })
  metadata?: unknown;

  constructor(
    data: T,
    status: HttpStatus,
    message?: string,
    metadata?: unknown,
  ) {
    this.data = data;
    this.status = status;
    this.message = message;
    this.metadata = metadata;
  }
}
