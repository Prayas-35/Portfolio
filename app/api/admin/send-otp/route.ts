import { getAdminOtpModel } from "@/lib/models/schema";
import { NextResponse } from "next/server";
import { StatusCodes } from 'http-status-codes';
import { sendOtpEmail } from "@/lib/helpers/sendOtp";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        console.log("Received email for OTP:", email);
        const AdminOtpModel = await getAdminOtpModel();
        if (!email) {
            return NextResponse.json(
                { success: false, message: "Email is required" },
                { status: StatusCodes.BAD_REQUEST }
            );
        }
        if (email !== process.env.NEXT_PUBLIC_GMAIL_USER && email !== "prayaspal04@gmail.com") {
            return NextResponse.json(
                { success: false, message: "Unauthorized email address" },
                { status: StatusCodes.FORBIDDEN }
            );
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Send OTP email
        await sendOtpEmail(email, otp);

        // Save OTP to database
        const newAdminOtp = new AdminOtpModel({ otp });
        await newAdminOtp.save();

        return NextResponse.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error creating Admin OTP data:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create Admin OTP data" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}