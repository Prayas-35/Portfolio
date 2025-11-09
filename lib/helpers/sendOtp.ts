import nodemailer from 'nodemailer';

export async function sendOtpEmail(recipientEmail: string, otp: string) {
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
    from: `${process.env.NEXT_PUBLIC_GMAIL_USER}`,
    to: recipientEmail,
    subject: 'Your One-Time Password (OTP) for Admin Access',
    text: `Your OTP is: ${otp}`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, message: 'Failed to send OTP email' };
  }
}