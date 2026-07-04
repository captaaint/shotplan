import { Controller, Get } from '@nestjs/common';

type Session = {
  id: string;
  clientName: string;
  type: string;
  date: string;
  status: 'inquiry' | 'booked' | 'done';
};

@Controller('sessions')
export class SessionsController {
  @Get()
  findAll(): Session[] {
    return [
      {
        id: 's-101',
        clientName: 'Anna Kovacs',
        type: 'Portrait',
        date: '2026-07-15',
        status: 'booked',
      },
      {
        id: 's-102',
        clientName: 'Mark Turner',
        type: 'Engagement',
        date: '2026-07-18',
        status: 'inquiry',
      },
    ];
  }
}
