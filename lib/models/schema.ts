import mongoose from "mongoose";
import { connectToDatabase } from "../mongodb";

export const CurrentProjectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        points: {
            type: [String],
            required: true
        },
    }
);

export const FindMeSchema = new mongoose.Schema(
    {
        event: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ['past', 'future']
        },
        date: {
            type: Date,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        eventUrl: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
);

export const SkillSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        category: {
            type: String,
            required: true
        },
        iconUrl: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
);

export const AchievementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export const experienceSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        position: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: false
        },
        responsibilities: {
            type: [String],
            required: true
        },
    },
    { timestamps: true }
);

export const ProjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        overview: {
            type: String,
            required: true
        },
        highlights: {
            type: [String],
            required: true
        },
        technologies: {
            type: [String],
            required: true
        },
        projectLiveUrl: {
            type: String,
            required: true
        },
        projectRepoUrl: {
            type: String,
            required: true
        },
        thumbnailImageUrl: {
            type: String,
            required: true
        },
        snapshotImageUrls: {
            type: [String],
            required: true
        },
    },
    { timestamps: true }
);

export const AdminOtpSchema = new mongoose.Schema(
    {
        otp: {
            type: String,
            required: true,
            unique: true,
            expires: 300 // OTP expires in 5 minutes
        }
    },
    { timestamps: true }
);

export async function getSkillModel() {
    await connectToDatabase();
    return mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
}

export async function getCurrentProjectModel() {
    await connectToDatabase();
    return mongoose.models.CurrentProject || mongoose.model("CurrentProject", CurrentProjectSchema);
}

export async function getFindMeModel() {
    await connectToDatabase();
    return mongoose.models.FindMe || mongoose.model("FindMe", FindMeSchema);
}

export async function getAchievementModel() {
    await connectToDatabase();
    return mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema);
}

export async function getExperienceModel() {
    await connectToDatabase();
    return mongoose.models.Experience || mongoose.model("Experience", experienceSchema);
}

export async function getProjectModel() {
    await connectToDatabase();
    return mongoose.models.Project || mongoose.model("Project", ProjectSchema);
}

export async function getAdminOtpModel() {
    await connectToDatabase();
    return mongoose.models.AdminOtp || mongoose.model("AdminOtp", AdminOtpSchema);
}