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

### Usage:

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