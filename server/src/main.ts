import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env['PORT'] ?? 3000);

  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ShotPlan API')
    .setDescription('Backend API for the ShotPlan photography workflow app.')
    .setVersion('0.1.0')
    .addTag('sessions')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(port);

  console.log(`ShotPlan API is running on http://localhost:${port}/api`);
  console.log(`OpenAPI docs are available at http://localhost:${port}/docs`);
}

void bootstrap();
