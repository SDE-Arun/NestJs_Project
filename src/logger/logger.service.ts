import { Injectable, Scope } from '@nestjs/common';
import { createLogger, Logger, transports } from 'winston';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerService {
  private context?: string;
  private logger: Logger;

  public setContext(context: string): void {
    this.context = context;
  }

  constructor() {
    this.logger = createLogger({
      transports: [new transports.Console()],
    });
  }

  // TODO: we will add that when we have fixed request format
  //   log(ctx: RequestContext, message: string, meta?: Record<string, unknown>): Logger {
  log(message: string, meta?: Record<string, unknown>): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.info({
      message,
      contextName: this.context,
      //   ctx,
      timestamp,
      ...meta,
    });
  }
}
