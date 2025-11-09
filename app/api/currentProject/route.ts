import { getCurrentProjectModel } from "@/lib/models/schema";
import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

export async function GET() {
    try {
        const CurrentProject = await getCurrentProjectModel();
        const currentProjectData = await CurrentProject.findOne().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: currentProjectData });
    } catch (error) {
        console.error("Error fetching Current Project data:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch Current Project data" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { title, description, points } = await request.json();
        const CurrentProject = await getCurrentProjectModel();

        let currentProjectData = await CurrentProject.findOne();
        if (currentProjectData) {
            // Update existing document
            currentProjectData.title = title;
            currentProjectData.description = description;
            currentProjectData.points = points;            
        } else {
            // Create new document
            currentProjectData = new CurrentProject({ title, description, points });
        }

        await currentProjectData.save();

        return NextResponse.json({ success: true, data: currentProjectData });
    } catch (error) {
        console.error("Error creating/updating Current Project data:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create/update Current Project data" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}