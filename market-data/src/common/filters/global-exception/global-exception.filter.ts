import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message : (exception instanceof HttpException) ? exception.getResponse() : 'Internal server error',
    });
  }
}
