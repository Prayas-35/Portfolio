"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/src/hooks/use-toast";

interface CurrentProject {
  _id?: string;
  title: string;
  description: string;
  points: string[];
}

export default function CurrentProjectPage() {
  const [currentProject, setCurrentProject] = useState<CurrentProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    points: "",
  });

  useEffect(() => {
    fetchCurrentProject();
  }, []);

  const fetchCurrentProject = async () => {
    try {
      const response = await fetch("/api/currentProject");
      const data = await response.json();
      if (data.success && data.data) {
        setCurrentProject(data.data);
        setFormData({
          title: data.data.title,
          description: data.data.description,
          points: data.data.points.join("\n"),
        });
      }
    } catch (error) {
      console.error("Error fetching current project:", error);
      toast({
        title: "Error",
        description: "Failed to fetch current project",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const projectData = {
      title: formData.title,
      description: formData.description,
      points: formData.points.split("\n").filter((p) => p.trim()),
    };

    try {
      const response = await fetch("/api/currentProject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: currentProject ? "Current project updated successfully" : "Current project created successfully",
        });
        fetchCurrentProject();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error saving current project:", error);
      toast({
        title: "Error",
        description: "Failed to save current project",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Current Project</h1>
        <p className="text-gray-400">Manage what you're currently working on</p>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-400 py-12">Loading...</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">
                {currentProject ? "Update" : "Create"} Current Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="My Awesome Project"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    placeholder="Brief description of the project..."
                    className="w-full rounded-md bg-gray-800 border-gray-700 px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="points">Key Points (one per line) *</Label>
                  <textarea
                    id="points"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                    required
                    rows={8}
                    placeholder="Building with React and Node.js&#10;Implementing real-time features&#10;Working on authentication system"
                    className="w-full rounded-md bg-gray-800 border-gray-700 px-3 py-2 text-white"
                  />
                  <p className="text-xs text-gray-500">Enter each point on a new line</p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : currentProject ? "Update Project" : "Create Project"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.title || formData.description || formData.points ? (
                <>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {formData.title || "Project Title"}
                    </h3>
                    <p className="text-gray-400">
                      {formData.description || "Project description will appear here..."}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Points:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-400">
                      {formData.points
                        .split("\n")
                        .filter((p) => p.trim())
                        .map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                    </ul>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Fill in the form to see a preview
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
