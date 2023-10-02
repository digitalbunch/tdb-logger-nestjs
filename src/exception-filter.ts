import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import {
  Catch,
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Logger } from '@thedigitalbunch/logger';

// instanceOf won't work unless @nestjs/common is a peer dependency,
// which is not achievable during development with npm link
function isInstanceOf<T extends new (...args: any[]) => any>(
  payload: any,
  targetClass: T,
): payload is InstanceType<T> {
  let currentPrototype = Object.getPrototypeOf(payload);
  while (currentPrototype) {
    if (currentPrototype.constructor.name === targetClass.name) {
      return true;
    }
    currentPrototype = Object.getPrototypeOf(currentPrototype);
  }
  return false;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = isInstanceOf(exception, HttpException)
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
    if (isInstanceOf(exception, UnprocessableEntityException)) {
      if (typeof exception.getResponse() === 'object') {
        extraValidationFields = exception.getResponse();
      }
    }

    response.status(status).json({
      ...extraValidationFields,
      message: isInstanceOf(exception, HttpException)
        ? exception.message
        : 'Something went wrong, please try again later.',
      statusCode: isInstanceOf(exception, HttpException)
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
