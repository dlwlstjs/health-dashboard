// app/db/sqlite.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function openDB() {
  return open({
    filename: '@/app/db/health_db.db',
    driver: sqlite3.Database,
  });
}