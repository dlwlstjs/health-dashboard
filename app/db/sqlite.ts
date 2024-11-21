import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// SQLite 데이터베이스 열기
export async function openDb(): Promise<sqlite3.Database> {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database, // sqlite3 드라이버 사용
  });
}
