import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const logPath = 'C:\\Users\\alaza\\Desktop\\factuer fr\\apps\\api\\global_error.log';
        const errorMsg = `${new Date().toISOString()} - Path: ${request.url} - Status: ${status} - Error: ${JSON.stringify(exception)}\n`;

        try {
            fs.appendFileSync(logPath, errorMsg);
        } catch (e) {
            console.error("Failed to write to log file", e);
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: (exception as any).message || 'Internal server error',
        });
    }
}
