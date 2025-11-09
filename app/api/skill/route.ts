import { getSkillModel } from "@/lib/models/schema";
import { withThumbnailImageUpload } from "@/lib/middlewares/imageUpload.middleware";
import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

export async function GET() {
    try {
        const Skill = await getSkillModel();
        const skills = await Skill.find();
        return NextResponse.json({ success: true, data: skills });
    } catch (error) {
        console.error("Error fetching skills:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch skills" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}

export async function POST(request: any) {
    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const category = formData.get('category') as string;
        const iconUrl = formData.get('iconUrl') as string;

        const Skill = await getSkillModel();

        const existingSkill = await Skill.findOne({ name });
        if (existingSkill) {
            return NextResponse.json(
                { success: false, message: "Skill already exists" },
                { status: StatusCodes.CONFLICT }
            );
        }

        const newSkill = new Skill({ name, category, iconUrl });
        await newSkill.save();

        return NextResponse.json({ success: true, data: newSkill });
    } catch (error) {
        console.error("Error creating skill:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create skill" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}

export async function PUT(request: any) {
    try {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const category = formData.get('category') as string;

        const Skill = await getSkillModel();
        const skill = await Skill.findById(id);

        if (!skill) {
            return NextResponse.json(
                { success: false, message: "Skill not found" },
                { status: StatusCodes.NOT_FOUND }
            );
        }

        skill.name = name;
        skill.category = category;
        
        if (request.thumbnailImageUrl) {
            skill.iconUrl = request.thumbnailImageUrl;
        }

        await skill.save();

        return NextResponse.json({ success: true, data: skill });
    } catch (error) {
        console.error("Error updating skill:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update skill" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Skill ID is required" },
                { status: StatusCodes.BAD_REQUEST }
            );
        }

        const Skill = await getSkillModel();
        const deletedSkill = await Skill.findByIdAndDelete(id);

        if (!deletedSkill) {
            return NextResponse.json(
                { success: false, message: "Skill not found" },
                { status: StatusCodes.NOT_FOUND }
            );
        }

        return NextResponse.json({ success: true, data: deletedSkill });
    } catch (error) {
        console.error("Error deleting skill:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete skill" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}