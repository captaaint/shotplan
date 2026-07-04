import { Controller, Get } from '@nestjs/common';

import { Session, SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  findAll(): Session[] {
    return this.sessionsService.findAll();
  }
}
