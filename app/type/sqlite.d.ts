declare module 'sqlite' {
    import { Database } from 'sqlite3';
  
    // open 함수의 타입을 정확하게 정의
    export function open(options: { filename: string; driver: typeof Database }): Promise<Database>;
  }
  