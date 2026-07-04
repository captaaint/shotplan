import { Controller, Get, Param } from '@nestjs/common';

import { Session, SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  findAll(): Session[] {
    return this.sessionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Session {
    return this.sessionsService.findOne(id);
  }
}
