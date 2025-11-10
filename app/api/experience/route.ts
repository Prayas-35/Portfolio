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
        const { company, position, location, startDate, endDate, description, logoUrl, responsibilities } = await request.json();
        const Experience = await getExperienceModel();

        const newExperience = new Experience({ company, position, location, startDate, endDate, description, logoUrl, responsibilities });
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

export async function PUT(request: Request) {
    try {
        const { company, position, location, startDate, endDate, description, logoUrl, responsibilities } = await request.json();
        const url = new URL(request.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Missing id" },
                { status: StatusCodes.BAD_REQUEST }
            );
        }
        const Experience = await getExperienceModel();
        const experience = await Experience.findById(id);

        if (!experience) {
            return NextResponse.json(
                { success: false, message: "Experience not found" },
                { status: StatusCodes.NOT_FOUND }
            );
        }

        experience.company = company;
        experience.position = position;
        experience.location = location;
        experience.startDate = startDate;
        experience.endDate = endDate;
        experience.description = description;
        experience.logoUrl = logoUrl;
        experience.responsibilities = responsibilities;

        await experience.save();

        return NextResponse.json({ success: true, data: experience });
    } catch (error) {
        console.error("Error updating experience:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update experience" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}