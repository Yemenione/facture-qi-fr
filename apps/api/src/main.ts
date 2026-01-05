import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable Global Validation Pipe
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    // Global Error Logging
    const { AllExceptionsFilter } = require('./common/filters/all-exceptions.filter');
    app.useGlobalFilters(new AllExceptionsFilter());

    // Enable CORS for Frontend Access
    app.enableCors({
        origin: true, // Allow all for debugging
        credentials: true,
    });

    await app.listen(3001);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
