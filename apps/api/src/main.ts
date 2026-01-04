import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable Global Validation Pipe
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    // Enable CORS for Frontend Access
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:5173', 'https://app.mon-saas.fr', 'https://admin.mon-saas.fr'],
        credentials: true,
    });

    await app.listen(3001);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
