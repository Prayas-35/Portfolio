import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

  // Create a transporter using Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NEXT_PUBLIC_GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  // Define the email options
  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.NEXT_PUBLIC_GMAIL_USER}>`,
    to: process.env.NEXT_PUBLIC_GMAIL_USER,
    subject: `New message from ${name} (${email})`,
    text: message,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, message: 'Failed to send email' }, { status: 500 });
  }
}