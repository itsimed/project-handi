// Type declarations for ssh2
declare module 'ssh2' {
  import { EventEmitter } from 'events';
  import { Socket } from 'net';

  export interface ClientOptions {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    privateKey?: Buffer | string;
    passphrase?: string;
    readyTimeout?: number;
    [key: string]: any;
  }

  export interface ForwardOutCallback {
    (err: Error | undefined, stream?: any): void;
  }

  export class Client extends EventEmitter {
    connect(options: ClientOptions): void;
    forwardOut(
      sourceIP: string,
      sourcePort: number,
      destIP: string,
      destPort: number,
      callback: ForwardOutCallback
    ): void;
    end(): void;
  }
}
