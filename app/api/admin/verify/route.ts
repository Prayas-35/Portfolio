import { getAdminOtpModel } from "@/lib/models/schema";
import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

export async function POST(request: Request) {
    try {
        const { otp } = await request.json();
        const AdminOtpModel = await getAdminOtpModel();
        const adminOtpData = await AdminOtpModel.findOne().sort({ createdAt: -1 });

        if (adminOtpData && adminOtpData.otp === otp) {
            return NextResponse.json({ success: true, message: "OTP verified successfully" });
        } else {
            return NextResponse.json(
                { success: false, message: "Invalid OTP" },
                { status: StatusCodes.UNAUTHORIZED }
            );
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json(
            { success: false, message: "Failed to verify OTP" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}