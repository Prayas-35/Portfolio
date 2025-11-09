import { getAchievementModel } from "@/lib/models/schema";
import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

export async function GET() {
    try {
        const Achievement = await getAchievementModel();
        const achievements = await Achievement.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: achievements });
    } catch (error) {
        console.error("Error fetching achievements:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch achievements" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { title } = await request.json();
        const Achievement = await getAchievementModel();

        const newAchievement = new Achievement({ title });
        await newAchievement.save();

        return NextResponse.json({ success: true, data: newAchievement });
    } catch (error) {
        console.error("Error creating achievement:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create achievement" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}