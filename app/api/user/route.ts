import { NextResponse } from 'next/server';
import { open } from 'sqlite';  // 수정된 부분
import sqlite3 from 'sqlite3';

// User 타입 정의
interface User {
  id: number;
  name: string;
}

// 데이터베이스 열기
async function openDb() {
  return open({
    filename: './health_db.db',
    driver: sqlite3.Database,
  });
}

// GET /api/users
export async function GET() {
  const db = await openDb();
  const users = await db.all<User[]>('SELECT * FROM user');
  await db.close();
  return NextResponse.json(users);
}
