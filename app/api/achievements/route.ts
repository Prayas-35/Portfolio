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

export async function PUT(request: Request) {
    try {
        const { title } = await request.json();
        const url = new URL(request.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Missing id" },
                { status: StatusCodes.BAD_REQUEST }
            );
        }
        const Achievement = await getAchievementModel();
        const achievement = await Achievement.findById(id);

        if (!achievement) {
            return NextResponse.json(
                { success: false, message: "Achievement not found" },
                { status: StatusCodes.NOT_FOUND }
            );
        }

        achievement.title = title;
        await achievement.save();

        return NextResponse.json({ success: true, data: achievement });
    } catch (error) {
        console.error("Error updating achievement:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update achievement" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Missing id" },
                { status: StatusCodes.BAD_REQUEST }
            );
        }

        const Achievement = await getAchievementModel();
        const deletedAchievement = await Achievement.findByIdAndDelete(id);

        if (!deletedAchievement) {
            return NextResponse.json(
                { success: false, message: "Achievement not found" },
                { status: StatusCodes.NOT_FOUND }
            );
        }

        return NextResponse.json({ success: true, data: deletedAchievement });
    } catch (error) {
        console.error("Error deleting achievement:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete achievement" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}