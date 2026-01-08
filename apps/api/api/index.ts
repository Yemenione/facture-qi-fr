import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const server = express();

const createNestServer = async (expressInstance) => {
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressInstance),
    );

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    // Global Error Logging - replicating main.ts
    const { AllExceptionsFilter } = require('../src/common/filters/all-exceptions.filter');
    app.useGlobalFilters(new AllExceptionsFilter());

    app.enableCors({
        origin: true,
        credentials: true,
    });

    await app.init();
};

createNestServer(server)
    .then(() => console.log('NestJS Serverless Ready'))
    .catch((err) => console.error('NestJS Init Error', err));

export default server;
