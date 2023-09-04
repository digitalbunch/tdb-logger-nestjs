import { INestApplication } from '@nestjs/common';
import { Logger, tracerMiddleware } from 'tdb-logger';

export class LoggerProvider {
  public static initializeLogger(app: INestApplication): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    app.useLogger(Logger.loggerInstance);
    app.use(
      tracerMiddleware({
        useHeader: true,
        headerName: 'X-Request-Id-Header',
      }),
    );

    const logger: Logger = new Logger('Global');
    // Catch unhandled promise rejections and log them in 'Global' context as errors
    process.on('unhandledRejection', (error: Error) => {
      logger.error('Unhandled promise rejection caught', error);
    });

    // Catch uncaught exceptions and log them in 'Global' context as errors
    process.on('uncaughtException', (error: Error) => {
      logger.error('Unhandled exception caught', error);
    });
  }
}
