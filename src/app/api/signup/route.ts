import { NextResponse } from "next/server";
import { createUserSignUpRequest } from "@/app/lib/actions";

export async function POST(req: Request) {
  const { name, email, details } = await req.json();
  try {

    
  // Validate input
  if ( !email) {
    return NextResponse.json({ error: "Email field is required in order to create the user signup request."}, { status: 400 });
  }
        
    await createUserSignUpRequest(name, email, details);

    return NextResponse.json({ message: "Account creation request has been recorded for " + name}, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}