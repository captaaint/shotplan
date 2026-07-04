import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { SessionEntity } from './session.entity';
import { SessionsService } from './sessions.service';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  @ApiOkResponse({ type: SessionEntity, isArray: true })
  findAll(): SessionEntity[] {
    return this.sessionsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: SessionEntity })
  @ApiNotFoundResponse({ description: 'Session not found.' })
  findOne(@Param('id') id: string): SessionEntity {
    return this.sessionsService.findOne(id);
  }
}
