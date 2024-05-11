import { NextResponse } from "next/server";
import { createUserSignUpRequest } from "@/app/lib/actions";

export async function POST(req: Request) {
  const { name, email, details } = await req.json();
  try {

    
  // Validate input
  if (!email) {
    return NextResponse.json({ error: "Email field is required in order to create the user signup request."}, { status: 400 });
  }
        
    let  operationSuccessful = await createUserSignUpRequest(name, email, details);

    if(operationSuccessful){
      return NextResponse.json({ message: "Account creation request succeeded!"}, { status: 201 });
    }
    return NextResponse.json({ message: "Account creation request failed."}, { status: 500 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}