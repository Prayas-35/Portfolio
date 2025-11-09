"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/src/hooks/use-toast";

interface Experience {
  _id: string;
  company: string;
  location: string;
  position: string;
  startDate: string;
  endDate?: string;
  responsibilities: string[];
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    company: "",
    location: "",
    position: "",
    startDate: "",
    endDate: "",
    responsibilities: "",
    isCurrentRole: false,
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch("/api/experience");
      const data = await response.json();
      if (data.success) {
        setExperiences(data.data);
      }
    } catch (error) {
      console.error("Error fetching experiences:", error);
      toast({
        title: "Error",
        description: "Failed to fetch experiences",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const experienceData = {
      company: formData.company,
      location: formData.location,
      position: formData.position,
      startDate: formData.startDate,
      endDate: formData.isCurrentRole ? undefined : formData.endDate,
      responsibilities: formData.responsibilities.split("\n").filter((r) => r.trim()),
    };

    try {
      const url = editingExperience
        ? `/api/experience?id=${editingExperience._id}`
        : "/api/experience";
      const method = editingExperience ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(experienceData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: `Experience ${editingExperience ? "updated" : "created"} successfully`,
        });
        setIsDialogOpen(false);
        resetForm();
        fetchExperiences();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error saving experience:", error);
      toast({
        title: "Error",
        description: `Failed to ${editingExperience ? "update" : "create"} experience`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData({
      company: experience.company,
      location: experience.location,
      position: experience.position,
      startDate: new Date(experience.startDate).toISOString().split("T")[0],
      endDate: experience.endDate ? new Date(experience.endDate).toISOString().split("T")[0] : "",
      responsibilities: experience.responsibilities.join("\n"),
      isCurrentRole: !experience.endDate,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      const response = await fetch(`/api/experience?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Experience deleted successfully",
        });
        fetchExperiences();
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast({
        title: "Error",
        description: "Failed to delete experience",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      company: "",
      location: "",
      position: "",
      startDate: "",
      endDate: "",
      responsibilities: "",
      isCurrentRole: false,
    });
    setEditingExperience(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Experience</h1>
          <p className="text-gray-400">Manage your work experience</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700" onClick={resetForm}>
              + Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingExperience ? "Edit Experience" : "Add New Experience"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Fill in the experience details below
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  required
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  placeholder="City, Country or Remote"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    disabled={formData.isCurrentRole}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isCurrentRole"
                  checked={formData.isCurrentRole}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isCurrentRole: e.target.checked,
                      endDate: e.target.checked ? "" : formData.endDate,
                    })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="isCurrentRole" className="cursor-pointer">
                  I currently work here
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibilities">Responsibilities (one per line) *</Label>
                <textarea
                  id="responsibilities"
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  required
                  rows={6}
                  placeholder="Led development of...&#10;Implemented features for...&#10;Collaborated with..."
                  className="w-full rounded-md bg-gray-800 border-gray-700 px-3 py-2 text-white"
                />
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
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingExperience ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-400 py-12">Loading...</div>
      ) : !experiences || experiences.length === 0 ? (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="text-center py-12">
            <p className="text-gray-400">No experience added yet. Add your first experience!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {experiences.map((exp) => (
            <Card key={exp._id} className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">{exp.position}</CardTitle>
                    <p className="text-lg text-gray-300 mt-1">{exp.company}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {exp.location} • {formatDate(exp.startDate)} -{" "}
                      {exp.endDate ? formatDate(exp.endDate) : "Present"}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(exp)}
                      className="border-gray-700"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(exp._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
