export interface SendMailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

export interface SMTPConfig {
  user: string;
  pass: string;
}
