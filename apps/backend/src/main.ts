import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = Number(process.env.PORT || 3000);
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(helmet());

  await app.listen(PORT);
}
bootstrap();
