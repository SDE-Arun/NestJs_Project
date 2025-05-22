import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(NotFoundException)
export class ErrorHandling implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: exception.message || exception,
    });

    // const response = host.switchToHttp().getResponse<Response>();
    // response.status(HttpStatus.NOT_FOUND).json({
    //   statusCode: HttpStatus.NOT_FOUND,
    //   timestamp: new Date().toISOString(),
    // });
  }
}
