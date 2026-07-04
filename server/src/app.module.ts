import { Module } from '@nestjs/common';
import { DevtoolsModule } from '@nestjs/devtools-integration';

import { AppController } from './app.controller';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env['NEST_DEVTOOLS'] === 'true',
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
