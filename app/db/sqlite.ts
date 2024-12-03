import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb(): Promise<sqlite3.Database> {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
}