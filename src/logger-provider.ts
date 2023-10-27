import type { ExceptionFilter, INestApplication } from '@nestjs/common';
import type * as Sentry from '@sentry/node';
import { Logger, tracerMiddleware } from '@thedigitalbunch/logger';

import { AllExceptionsFilter } from './exception-filter';

export const initializeLogger = (
  app: INestApplication,
  options = {} as {
    exceptionFilter?: ExceptionFilter | null;
    useSentry?: boolean | Sentry.SeverityLevel[];
  },
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

  if (options.useSentry) {
    const levels: Sentry.SeverityLevel[] =
      options.useSentry === true ? ['error', 'warning'] : options.useSentry;
    Logger.useSentry({ levels });
  }

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
