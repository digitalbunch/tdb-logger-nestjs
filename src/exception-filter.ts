import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import {
  Catch,
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Logger } from '@thedigitalbunch/logger';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // We don't want to log 40x errors
    if (status >= 500) {
      this.logger.error('Internal server error occurred:', exception);
    } else {
      this.logger.warn(
        'Global exception filter caught an exception:',
        exception,
      );
    }

    // Handle passing "errors" and other extra data to the client
    let extraValidationFields = {};
    if (exception instanceof UnprocessableEntityException) {
      if (typeof exception.getResponse() === 'object') {
        extraValidationFields = exception.getResponse();
      }
    }

    response.status(status).json({
      ...extraValidationFields,
      message:
        exception instanceof HttpException
          ? exception.message
          : 'Something went wrong, please try again later.',
      statusCode:
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
