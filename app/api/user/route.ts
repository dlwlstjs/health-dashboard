import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

interface User {
  id: number;
  name: string;
}

async function openDb() {
  return open({
    filename: "./health_db.db",
    driver: sqlite3.Database,
  });
}

export async function GET() {
  const db = await openDb();
  const users = await db.all<User[]>("SELECT * FROM user");
  await db.close();
  return NextResponse.json(users);
}
