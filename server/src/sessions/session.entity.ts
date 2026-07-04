import { ApiProperty } from '@nestjs/swagger';

export class SessionEntity {
  @ApiProperty({ example: 's-101' })
  id: string;

  @ApiProperty({ example: 'Anna Kovacs' })
  clientName: string;

  @ApiProperty({ example: 'Portrait' })
  type: string;

  @ApiProperty({ example: '2026-07-15' })
  date: string;

  @ApiProperty({ enum: ['inquiry', 'booked', 'done'], example: 'booked' })
  status: 'inquiry' | 'booked' | 'done';
}
