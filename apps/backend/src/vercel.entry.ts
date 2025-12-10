import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';

// IMPORTANT: adjust this path to your actual dist folder
import { AppModule } from './app.module';

let server: express.Express;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Create Nest server only once (cold start)
  if (!server) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    nestApp.enableCors();
    await nestApp.init();

    server = expressApp;
  }

  return server(req, res);
}
