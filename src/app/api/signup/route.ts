import { NextResponse } from "next/server";
import { createUserSignUpRequest } from "@/app/lib/actions";
import { Resend } from 'resend';


// Dedicated function to send the notification email
async function sendNotificationEmail({ name, email, details }: { name: string; email: string; details: string }) {
  const resendKey = process.env.RESEND_API_KEY;
  console.log("Resend key has value: " + resendKey);

  const resend = new Resend(process.env.RESEND_API_KEY!);
  
  const emailTemplate = `
    <html>
      <body>
        <h2>New Account Creation Request</h2>
        <p>Dear Wizify Team,</p>
        <p>A new account creation request has been submitted with the following details:</p>
        <ul>
          <li><b>Name:</b> ${name}</li>
          <li><b>Email:</b> ${email}</li>
          <li><b>Details:</b> ${details}</li>
        </ul>
        <p>Please review and process this request at your earliest convenience.</p>
        <br />
        <p>Best regards,</p>
        <p>Wizify Notification System</p>
      </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: 'noreply@wizify.ai',
      to: 'contact@wizify.ai',
      subject: 'New Account Creation Request for ' + name,
      html: emailTemplate,
    });
  } catch (error) {
    console.log({ error });
    throw new Error("Failed to send notification email.");
  }
}


export async function POST(req) {
  const { name, email, details } = await req.json();
  try {
    // Validate input
    if (!email) {
      return NextResponse.json({ error: "Email field is required in order to create the user signup request." }, { status: 400 });
    }

    const result = await createUserSignUpRequest(name, email, details);

    if (result.success) {
      await sendNotificationEmail({ name, email, details });
      return NextResponse.json({ message: "Account creation request succeeded!" }, { status: 201 });
    }

    return NextResponse.json({ error: result.error }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}