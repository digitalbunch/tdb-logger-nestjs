### Installation:

```bash
$ npm install @thedigitalbunch/logger-nestjs
```

### Initialization:

First, import the initializer function:
```typescript
import { initializeLogger } from '@thedigitalbunch/logger-nestjs';
```

Then run it within the bootstrap function:
```typescript
const app = await NestFactory.create(AppModule, { bufferLogs: true });

// bootstrap code

initializeLogger(app);
```

##### Initialization options
You can specify an exception filter for your NestJS application, by using `exceptionFilter` argument.
This logger exports `AllExceptionsFilter` and uses it as a default, but any class that implements `ExceptionFilter` can be passed.
You can also pass `null` to not use the exception filter at all.

```typescript
initializeLogger(app, { exceptionFilter: null });

initializeLogger(app, { exceptionFilter: new AllExceptionsFilter() });
```

If your project uses Sentry, you can pass `useSentry: true` as an argument or specify the log levels that should be captured by Sentry.

By default it captures `error` and `warning` logs.

```typescript
initializeLogger(app, { useSentry: true });

initializeLogger(app, { useSentry: ['error', 'warning', 'debug'] });
```

### Usage:

In a development environment, use environmental variable `LOGGER=dev`.

```typescript
import { Injectable } from '@nestjs/common';
import { Logger } from '@thedigitalbunch/logger-nestjs';

@Injectable()
export class TestService {
    private logger = new Logger(TestService.name);
    
    hello() {
        this.logger.log('Hello World!');
    }
}
```