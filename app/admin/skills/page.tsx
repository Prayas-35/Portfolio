"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/src/hooks/use-toast";
import FileUpload from "@/components/ui/file-upload";

interface Skill {
    _id: string;
    name: string;
    category: string;
    iconUrl: string;
}

export default function SkillsPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [iconFile, setIconFile] = useState<File[]>([]);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        iconUrl: "",
    });

    const categories = [
        "Frontend",
        "Backend",
        "Database",
        "DevOps",
        "Tools",
        "Languages",
        "Web3",
        "Cloud",
        "Other",
    ];

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const response = await fetch("/api/skill");
            const data = await response.json();
            if (data.success) {
                setSkills(data.data);
            }
        } catch (error) {
            console.error("Error fetching skills:", error);
            toast({
                title: "Error",
                description: "Failed to fetch skills",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('iconUrl', formData.iconUrl);

            // Add icon image file
            if (iconFile.length > 0) {
                formDataToSend.append('iconImage', iconFile[0]);
            }

            if (editingSkill) {
                formDataToSend.append('id', editingSkill._id);
            }

            const url = editingSkill ? `/api/skill?id=${editingSkill._id}` : "/api/skill";
            const method = editingSkill ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                body: formDataToSend,
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Success",
                    description: `Skill ${editingSkill ? "updated" : "created"} successfully`,
                });
                setIsDialogOpen(false);
                resetForm();
                fetchSkills();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error("Error saving skill:", error);
            toast({
                title: "Error",
                description: `Failed to ${editingSkill ? "update" : "create"} skill`,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (skill: Skill) => {
        setEditingSkill(skill);
        setFormData({
            name: skill.name,
            category: skill.category,
            iconUrl: skill.iconUrl,
        });
        setIconFile([]);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this skill?")) return;

        try {
            const response = await fetch(`/api/skill?id=${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Success",
                    description: "Skill deleted successfully",
                });
                fetchSkills();
            }
        } catch (error) {
            console.error("Error deleting skill:", error);
            toast({
                title: "Error",
                description: "Failed to delete skill",
                variant: "destructive",
            });
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            category: "",
            iconUrl: "",
        });
        setIconFile([]);
        setEditingSkill(null);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        resetForm();
    };

    const groupedSkills = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {} as Record<string, Skill[]>);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Skills</h1>
                    <p className="text-gray-400">Manage your technical skills</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-purple-600 hover:bg-purple-700" onClick={resetForm}>
                            + Add Skill
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {editingSkill ? "Edit Skill" : "Add New Skill"}
                            </DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Fill in the skill details below
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Skill Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="React, Python, Docker..."
                                    className="bg-gray-800 border-gray-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <select
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                    className="w-full rounded-md bg-gray-800 border-gray-700 px-3 py-2 text-white"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="iconUrl">Icon URL *</Label>
                                <Input
                                    id="iconUrl"
                                    type="url"
                                    value={formData.iconUrl}
                                    onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                                    required
                                    placeholder="https://cdn.example.com/icon.svg"
                                    className="bg-gray-800 border-gray-700"
                                />
                                {formData.iconUrl && (
                                    <div className="mt-2 p-2 bg-gray-800 rounded flex items-center justify-center">
                                        <img src={formData.iconUrl} alt="Icon preview" className="w-12 h-12" />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end space-x-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleDialogClose}
                                    className="border-gray-700"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                                    {editingSkill ? "Update" : "Create"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="text-center text-gray-400 py-12">Loading...</div>
            ) : !skills || skills.length === 0 ? (
                <Card className="bg-gray-900/50 border-gray-800">
                    <CardContent className="text-center py-12">
                        <p className="text-gray-400">No skills added yet. Add your first skill!</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                        <Card key={category} className="bg-gray-900/50 border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-white">{category}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {categorySkills.map((skill) => (
                                        <div
                                            key={skill._id}
                                            className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center space-y-2 relative group"
                                        >
                                            <img src={skill.iconUrl} alt={skill.name} className="w-12 h-12" />
                                            <p className="text-sm text-gray-300 text-center">{skill.name}</p>
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleEdit(skill)}
                                                    className="h-6 w-6 p-0 text-xs"
                                                >
                                                    ✏️
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(skill._id)}
                                                    className="h-6 w-6 p-0 text-xs"
                                                >
                                                    🗑️
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
