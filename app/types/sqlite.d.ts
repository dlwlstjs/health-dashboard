declare module 'sqlite' {
    import { Database } from 'sqlite3';
  
    export function open(options: { filename: string; driver: typeof Database }): Promise<Database>;
  }