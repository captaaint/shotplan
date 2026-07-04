import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [SessionsModule],
  controllers: [AppController],
})
export class AppModule {}
