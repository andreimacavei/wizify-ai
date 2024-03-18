import pool from "@/lib/db/pg";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // TODO add field validation here aswell
    
    const result = await pool.sql`INSERT INTO users(email, password) VALUES(${email}, ${hashedPassword}) RETURNING *`;
    
    if (result) {
      return NextResponse.json({ message: "User created" }, { status: 201 });
    } else {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}