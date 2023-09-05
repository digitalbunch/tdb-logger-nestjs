import type { ExceptionFilter, INestApplication } from '@nestjs/common';
import { Logger, tracerMiddleware } from 'tdb-logger';

import { AllExceptionsFilter } from './exception-filter';

export const initializeLogger = (
  app: INestApplication,
  options = {} as { exceptionFilter?: ExceptionFilter | null },
): void => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  app.useLogger(Logger.loggerInstance);
  app.use(
    tracerMiddleware({
      useHeader: true,
      headerName: 'X-Request-Id-Header',
    }),
  );

  if (options.exceptionFilter) {
    app.useGlobalFilters(options.exceptionFilter);
  } else if (options.exceptionFilter === undefined) {
    app.useGlobalFilters(new AllExceptionsFilter());
  }

  const logger: Logger = new Logger('Global');
  // Catch unhandled promise rejections and log them in 'Global' context as errors
  process.on('unhandledRejection', (error: Error) => {
    logger.error('Unhandled promise rejection caught:', error);
  });

  // Catch uncaught exceptions and log them in 'Global' context as errors
  process.on('uncaughtException', (error: Error) => {
    logger.error('Unhandled exception caught:', error);
  });
};
