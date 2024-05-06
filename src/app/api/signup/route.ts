import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createUserSignUpRequest } from "@/app/lib/actions";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  try {
        
    const hashedPassword = await bcrypt.hash(password, 10);

    await createUserSignUpRequest(name, hashedPassword, email);

    return NextResponse.json({ message: "Account creation request has been recorded for " + name}, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}