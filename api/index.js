const { NestFactory } = require("@nestjs/core");
const { ExpressAdapter } = require("@nestjs/platform-express");
const express = require("express");

// Import built AppModule from dist
const { AppModule } = require("../dist/app.module");

let server;

module.exports = async (req, res) => {
  if (!server) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp)
    );

    nestApp.enableCors();
    await nestApp.init();

    server = expressApp;
  }

  server(req, res);
};
