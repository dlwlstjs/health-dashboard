// app/db/initialize.js
import { openDB } from "./sqlite";

export async function initializeDB() {
  const db = await openDB();

  // User 테이블 생성
  await db.exec(`
    CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      gender TEXT,
      birthdate TEXT,
      role TEXT,
      email TEXT UNIQUE,
      username TEXT UNIQUE,
      password TEXT,
      link TEXT
    )
  `);

  // Health 테이블 생성
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Health (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      score INTEGER,
      FOREIGN KEY(email) REFERENCES User(email)
    )
  `);
}
