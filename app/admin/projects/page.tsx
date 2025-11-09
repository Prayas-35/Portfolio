"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/src/hooks/use-toast";
import FileUpload from "@/components/ui/file-upload";

interface Project {
  _id: string;
  name: string;
  overview: string;
  highlights: string[];
  technologies: string[];
  projectLiveUrl: string;
  projectRepoUrl: string;
  thumbnailImageUrl: string;
  snapshotImageUrls: string[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File[]>([]);
  const [snapshotFiles, setSnapshotFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    overview: "",
    highlights: "",
    technologies: "",
    projectLiveUrl: "",
    projectRepoUrl: "",
    thumbnailImageUrl: "",
    snapshotImageUrls: [] as string[],
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to fetch projects",
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
      
      // Add basic fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('overview', formData.overview);
      formDataToSend.append('highlights', JSON.stringify(formData.highlights.split("\n").filter((h) => h.trim())));
      formDataToSend.append('technologies', JSON.stringify(formData.technologies.split(",").map((t) => t.trim()).filter((t) => t)));
      formDataToSend.append('projectLiveUrl', formData.projectLiveUrl);
      formDataToSend.append('projectRepoUrl', formData.projectRepoUrl);

      // Add thumbnail image file (if new file selected)
      if (thumbnailFile.length > 0) {
        formDataToSend.append('iconImage', thumbnailFile[0]);
      }

      // Add snapshot image files (if new files selected)
      if (snapshotFiles.length > 0) {
        snapshotFiles.forEach((file) => {
          formDataToSend.append('snapshotImage', file);
        });
      }

      if (editingProject) {
        formDataToSend.append('id', editingProject._id);
      }

      const url = editingProject
        ? `/api/projects?id=${editingProject._id}`
        : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: `Project ${editingProject ? "updated" : "created"} successfully`,
        });
        setIsDialogOpen(false);
        resetForm();
        fetchProjects();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description: `Failed to ${editingProject ? "update" : "create"} project`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      overview: project.overview,
      highlights: project.highlights.join("\n"),
      technologies: project.technologies.join(", "),
      projectLiveUrl: project.projectLiveUrl,
      projectRepoUrl: project.projectRepoUrl,
      thumbnailImageUrl: project.thumbnailImageUrl,
      snapshotImageUrls: project.snapshotImageUrls,
    });
    setThumbnailFile([]);
    setSnapshotFiles([]);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
        fetchProjects();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      overview: "",
      highlights: "",
      technologies: "",
      projectLiveUrl: "",
      projectRepoUrl: "",
      thumbnailImageUrl: "",
      snapshotImageUrls: [],
    });
    setThumbnailFile([]);
    setSnapshotFiles([]);
    setEditingProject(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-400">Manage your portfolio projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={resetForm}>
              + Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Edit Project" : "Add New Project"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Fill in the project details below
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="overview">Overview *</Label>
                <textarea
                  id="overview"
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  required
                  rows={3}
                  className="w-full rounded-md bg-gray-800 border-gray-700 px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="highlights">Highlights (one per line) *</Label>
                <textarea
                  id="highlights"
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  required
                  rows={4}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full rounded-md bg-gray-800 border-gray-700 px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technologies">Technologies (comma separated) *</Label>
                <Input
                  id="technologies"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  required
                  placeholder="React, Node.js, MongoDB"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectLiveUrl">Live URL *</Label>
                  <Input
                    id="projectLiveUrl"
                    type="url"
                    value={formData.projectLiveUrl}
                    onChange={(e) => setFormData({ ...formData, projectLiveUrl: e.target.value })}
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectRepoUrl">Repo URL *</Label>
                  <Input
                    id="projectRepoUrl"
                    type="url"
                    value={formData.projectRepoUrl}
                    onChange={(e) => setFormData({ ...formData, projectRepoUrl: e.target.value })}
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>

              <FileUpload
                id="thumbnailImage"
                label="Thumbnail Image"
                accept="image/*"
                multiple={false}
                currentFiles={formData.thumbnailImageUrl ? [formData.thumbnailImageUrl] : []}
                onChange={(files) => setThumbnailFile(files)}
                onRemove={() => setFormData({ ...formData, thumbnailImageUrl: "" })}
                required={!editingProject}
              />

              <FileUpload
                id="snapshotImages"
                label="Snapshot Images"
                accept="image/*"
                multiple={true}
                currentFiles={formData.snapshotImageUrls}
                onChange={(files) => setSnapshotFiles(files)}
                onRemove={(index) => {
                  const newUrls = formData.snapshotImageUrls.filter((_, i) => i !== index);
                  setFormData({ ...formData, snapshotImageUrls: newUrls });
                }}
                required={!editingProject}
              />

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                  className="border-gray-700"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingProject ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-400 py-12">Loading...</div>
      ) : !projects || projects.length === 0 ? (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="text-center py-12">
            <p className="text-gray-400">No projects yet. Add your first project!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => (
            <Card key={project._id} className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">{project.name}</CardTitle>
                    <p className="text-gray-400 text-sm mt-2">{project.overview}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(project)}
                      className="border-gray-700"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(project._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <a
                      href={project.projectLiveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Live Demo →
                    </a>
                    <a
                      href={project.projectRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Repository →
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
