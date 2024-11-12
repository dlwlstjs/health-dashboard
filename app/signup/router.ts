import { NextResponse } from "next/server";
import { openDB } from "@/app/db/sqlite";

export async function POST(req: Request) {
  const db = await openDB();
  const { name, gender, birthdate, role, email, username, password, link } = await req.json();

  try {
    await db.run(
      "INSERT INTO User (name, gender, birthdate, role, email, username, password, link) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, gender, birthdate, role, email, username, password, link]
    );
    return NextResponse.json({ message: "User created successfully" });
  } catch (error: unknown) {
    // Type guard to check if the error is an instance of Error
    if (error instanceof Error) {
      console.error("Error creating user:", error.message); // Safely access error.message
      return NextResponse.json({ error: "User creation failed", details: error.message }, { status: 500 });
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
  }
}
