export class MailDeliveryError extends Error {
  code?: string;
  responseCode?: number;
  retryable: boolean;

  constructor(
    message: string,
    options: {
      cause?: unknown;
      code?: string;
      responseCode?: number;
      retryable: boolean;
    },
  ) {
    super(message, { cause: options.cause });

    this.name = "MailDeliveryError";
    this.code = options.code;
    this.responseCode = options.responseCode;
    this.retryable = options.retryable;
  }
}
