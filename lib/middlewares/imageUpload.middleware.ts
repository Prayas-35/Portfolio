import cloudinary from '@/lib/cloudinary';
import { NextRequest } from 'next/server';

export interface RequestWithImage extends NextRequest {
    imageUrl?: string;
    uploadedImageUrl?: string;
    logoImageUrl?: string;
    iconImageUrl?: string;
    snapshotImageUrls?: string[];
    thumbnailImageUrl?: string;
    parsedFormData?: FormData;
}

type RouteContext = { params: Promise<Record<string, string | string[]>> };

export function withImageUpload(
    handler: (req: RequestWithImage, context: RouteContext) => Promise<Response>
) {
    return async (req: NextRequest, context: RouteContext): Promise<Response> => {
        const extendedReq = req as RequestWithImage;
        
        try {
            // Use parsedFormData if already available from previous middleware
            const formData = extendedReq.parsedFormData || await req.formData();
            const file = formData.get('image') as File | null;

            // Make image optional - if no file, just pass through with formData
            if (file && file instanceof File && file.size > 0) {
                // Convert file to base64
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

                // Upload to Cloudinary
                const uploadResult = await cloudinary.uploader.upload(base64, {
                    folder: 'uploads',
                });

                extendedReq.imageUrl = uploadResult.secure_url;
            }

            extendedReq.parsedFormData = formData; // Attach formData to request

            return handler(extendedReq, context);
        } catch (error) {
            console.error('Cloudinary Upload Error:', error);
            return new Response(JSON.stringify({ error: 'Image upload failed' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    };
}

export function withSnapShotImageUpload(
    handler: (req: RequestWithImage, context: RouteContext) => Promise<Response>
) {
    return async (req: NextRequest, context: RouteContext): Promise<Response> => {
        const extendedReq = req as RequestWithImage;
        
        try {
            // Use parsedFormData if already available from previous middleware
            const formData = extendedReq.parsedFormData || await req.formData();
            const entries = formData.getAll('snapshotImage');
            const files = entries.filter((f): f is File => f instanceof File) as File[];

            if (files.length === 0) {
                return new Response(JSON.stringify({ error: 'No snapshot images uploaded' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            const uploadPromises = files.map(async (file) => {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

                const uploadResult = await cloudinary.uploader.upload(base64, {
                    folder: 'snapshots',
                });

                return uploadResult.secure_url;
            });

            const urls = await Promise.all(uploadPromises);
            extendedReq.snapshotImageUrls = urls;
            extendedReq.parsedFormData = formData; // Attach formData to request

            return handler(extendedReq, context);
        } catch (error) {
            console.error('Cloudinary Snapshot Upload Error:', error);
            return new Response(JSON.stringify({ error: 'Snapshot image upload failed' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    };
}

export function withLogoImageUpload(
    handler: (req: RequestWithImage, context: RouteContext) => Promise<Response>
) {
    return async (req: NextRequest, context: RouteContext): Promise<Response> => {
        const extendedReq = req as RequestWithImage;
        
        try {
            // Use parsedFormData if already available from previous middleware
            const formData = extendedReq.parsedFormData || await req.formData();
            const file = formData.get('logoImage') as File | null;

            if (!file) {
                return new Response(JSON.stringify({ error: 'No logo image uploaded' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            // Convert file to base64
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

            // Upload to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(base64, {
                folder: 'logos',
            });

            extendedReq.imageUrl = uploadResult.secure_url;
            extendedReq.parsedFormData = formData; // Attach formData to request

            return handler(extendedReq, context);
        } catch (error) {
            console.error('Cloudinary Logo Upload Error:', error);
            return new Response(JSON.stringify({ error: 'Logo image upload failed' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    };
}

export function withThumbnailImageUpload(
    handler: (req: RequestWithImage, context: RouteContext) => Promise<Response>
) {
    return async (req: NextRequest, context: RouteContext): Promise<Response> => {
        const extendedReq = req as RequestWithImage;
        
        try {
            // Use parsedFormData if already available from previous middleware
            const formData = extendedReq.parsedFormData || await req.formData();
            const file = formData.get('iconImage') as File | null;

            if (!file) {
                return new Response(JSON.stringify({ error: 'No icon image uploaded' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            // Convert file to base64
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

            // Upload to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(base64, {
                folder: 'icons',
            });

            extendedReq.thumbnailImageUrl = uploadResult.secure_url;
            extendedReq.parsedFormData = formData; // Attach formData to request

            return handler(extendedReq, context);
        } catch (error) {
            console.error('Cloudinary Icon Upload Error:', error);
            return new Response(JSON.stringify({ error: 'Icon image upload failed' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    };
}
