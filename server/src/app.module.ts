import { Module } from '@nestjs/common';
import { DevtoolsModule } from '@nestjs/devtools-integration';

import { AppController } from './app.controller';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env['NEST_DEVTOOLS'] === 'true',
    }),
    SessionsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
