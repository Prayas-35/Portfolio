import { getProjectModel } from "@/lib/models/schema";
import { withSnapShotImageUpload, withThumbnailImageUpload, RequestWithImage } from "@/lib/middlewares/imageUpload.middleware";
import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

export async function GET() {
    try {
        const Project = await getProjectModel();
        const projects = await Project.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: projects });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch projects" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}

export async function postHandler(request: RequestWithImage, context: { params: Promise<Record<string, string | string[]>> }) {
    try {
        const formData = request.parsedFormData || await request.formData();
        const name = formData.get('name') as string;
        const overview = formData.get('overview') as string;
        const readme = formData.get('readme') as string;
        const highlights = JSON.parse(formData.get('highlights') as string);
        const technologies = JSON.parse(formData.get('technologies') as string);
        const projectLiveUrl = formData.get('projectLiveUrl') as string;
        const projectRepoUrl = formData.get('projectRepoUrl') as string;
        // Get URLs from middleware
        const thumbnailImageUrl = request.thumbnailImageUrl;
        const snapshotImageUrls = request.snapshotImageUrls;

        const Project = await getProjectModel();

        const newProject = new Project({ 
            name, 
            overview,
            readme, 
            highlights, 
            technologies, 
            projectLiveUrl, 
            projectRepoUrl, 
            thumbnailImageUrl, 
            snapshotImageUrls 
        });
        await newProject.save();

        return NextResponse.json({ success: true, data: newProject });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create project" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}

export const POST = withThumbnailImageUpload(withSnapShotImageUpload(postHandler));

export async function putHandler(request: RequestWithImage, context: { params: Promise<Record<string, string | string[]>> }) {
    try {
        const formData = request.parsedFormData || await request.formData();
        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const overview = formData.get('overview') as string;
        const readme = formData.get('readme') as string;
        const highlights = JSON.parse(formData.get('highlights') as string);
        const technologies = JSON.parse(formData.get('technologies') as string);
        const projectLiveUrl = formData.get('projectLiveUrl') as string;
        const projectRepoUrl = formData.get('projectRepoUrl') as string;
        
        const Project = await getProjectModel();
        const project = await Project.findById(id);

        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: StatusCodes.NOT_FOUND }
            );
        }

        project.name = name;
        project.overview = overview;
        project.readme = readme;
        project.highlights = highlights;
        project.technologies = technologies;
        project.projectLiveUrl = projectLiveUrl;
        project.projectRepoUrl = projectRepoUrl;

        // Update images if new ones were uploaded
        if (request.thumbnailImageUrl) {
            project.thumbnailImageUrl = request.thumbnailImageUrl;
        }
        if (request.snapshotImageUrls) {
            project.snapshotImageUrls = [...project.snapshotImageUrls, ...request.snapshotImageUrls];
        }

        await project.save();

        return NextResponse.json({ success: true, data: project });
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update project" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}

export const PUT = withThumbnailImageUpload(withSnapShotImageUpload(putHandler));

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Project ID is required" },
                { status: StatusCodes.BAD_REQUEST }
            );
        }

        const Project = await getProjectModel();
        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: StatusCodes.NOT_FOUND }
            );
        }

        return NextResponse.json({ success: true, data: deletedProject });
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete project" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}