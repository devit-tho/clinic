import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Handler, Context } from 'aws-lambda';
import express from 'express';
import { AppModule } from './app.module';
import serverlessExpress from '@vendia/serverless-express';

let cachedServer: Handler;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    await nestApp.init();
    cachedServer = serverlessExpress({ app: expressApp });
  }
  return cachedServer;
}

export const handler: Handler = async (
  event: any,
  context: Context,
  cb: any,
) => {
  const server = await bootstrap();
  return server(event, context, cb);
};
