import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth(): { message: string } {
    return { message: 'ShotPlan API is running.' };
  }
}
