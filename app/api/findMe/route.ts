import { getFindMeModel } from "@/lib/models/schema";
import { withImageUpload, RequestWithImage } from "@/lib/middlewares/imageUpload.middleware";
import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

export async function GET() {
    try {
        const FindMeModel = await getFindMeModel();
        const events = await FindMeModel.find().sort({ date: -1 });
        return NextResponse.json({ success: true, data: events });
    } catch (error) {
        console.error("Error fetching Find Me events:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch Find Me events" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}

export async function postHandler(request: RequestWithImage, context: { params: Promise<Record<string, string | string[]>> }) {
    try {
        const formData = request.parsedFormData || await request.formData();
        const event = formData.get('event') as string;
        const type = formData.get('type') as string;
        const date = formData.get('date') as string;
        const location = formData.get('location') as string;
        const eventUrl = formData.get('eventUrl') as string;
        const imageUrl = request.imageUrl;

        const FindMeModel = await getFindMeModel();
        const newEvent = new FindMeModel({ event, imageUrl, type, date, location, eventUrl });
        await newEvent.save();

        return NextResponse.json({ success: true, data: newEvent });
    } catch (error) {
        console.error("Error creating Find Me event:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create Find Me event" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}

export const POST = withImageUpload(postHandler);

export async function putHandler(request: RequestWithImage, context: { params: Promise<Record<string, string | string[]>> }) {
    try {
        const formData = request.parsedFormData || await request.formData();
        const id = formData.get('id') as string;
        const event = formData.get('event') as string;
        const type = formData.get('type') as string;
        const date = formData.get('date') as string;
        const location = formData.get('location') as string;
        const eventUrl = formData.get('eventUrl') as string;

        const FindMeModel = await getFindMeModel();
        const findMeEvent = await FindMeModel.findById(id);

        if (!findMeEvent) {
            return NextResponse.json(
                { success: false, message: "Event not found" },
                { status: StatusCodes.NOT_FOUND }
            );
        }

        findMeEvent.event = event;
        findMeEvent.type = type;
        findMeEvent.date = date;
        findMeEvent.location = location;
        findMeEvent.eventUrl = eventUrl;

        if (request.imageUrl) {
            findMeEvent.imageUrl = request.imageUrl;
        }

        await findMeEvent.save();

        return NextResponse.json({ success: true, data: findMeEvent });
    } catch (error) {
        console.error("Error updating Find Me event:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update Find Me event" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}

export const PUT = withImageUpload(putHandler);

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Event ID is required" },
                { status: StatusCodes.BAD_REQUEST }
            );
        }

        const FindMeModel = await getFindMeModel();
        const deletedEvent = await FindMeModel.findByIdAndDelete(id);

        if (!deletedEvent) {
            return NextResponse.json(
                { success: false, message: "Event not found" },
                { status: StatusCodes.NOT_FOUND }
            );
        }

        return NextResponse.json({ success: true, data: deletedEvent });
    } catch (error) {
        console.error("Error deleting Find Me event:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete Find Me event" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}