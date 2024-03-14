import pool from "@/lib/db/pg";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  try {
    const { rows } = await pool.sql`SELECT * FROM users WHERE email = ${email}`;
    console.log("user: ", rows);

    if (rows.length === 1) {
      const passwordMatch = await bcrypt.compare(password, rows[0].password);
      if (passwordMatch) {
        const res = NextResponse.json({ message: "Login successful" }, { status: 200 });
        res.cookies.set("email_address", email);
        return res;
      } else {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 403 });
      }

    } else {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

}