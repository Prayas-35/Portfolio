import { getExperienceModel } from "@/lib/models/schema";
import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

export async function GET() {
    try {
        const Experience = await getExperienceModel();
        const experiences = await Experience.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: experiences });
    } catch (error) {
        console.error("Error fetching experiences:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch experiences" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { company, position, location, startDate, endDate, description, logoUrl } = await request.json();
        const Experience = await getExperienceModel();

        const newExperience = new Experience({ company, position, location, startDate, endDate, description, logoUrl });
        await newExperience.save();

        return NextResponse.json({ success: true, data: newExperience });
    } catch (error) {
        console.error("Error creating experience:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create experience" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}