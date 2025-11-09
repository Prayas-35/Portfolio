"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/src/hooks/use-toast";

interface Achievement {
  _id: string;
  title: string;
  createdAt: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await fetch("/api/achievements");
      const data = await response.json();
      if (data.success) {
        setAchievements(data.data);
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast({
        title: "Error",
        description: "Failed to fetch achievements",
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
      const url = editingAchievement
        ? `/api/achievements?id=${editingAchievement._id}`
        : "/api/achievements";
      const method = editingAchievement ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: `Achievement ${editingAchievement ? "updated" : "created"} successfully`,
        });
        setIsDialogOpen(false);
        resetForm();
        fetchAchievements();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error saving achievement:", error);
      toast({
        title: "Error",
        description: `Failed to ${editingAchievement ? "update" : "create"} achievement`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setFormData({
      title: achievement.title,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;

    try {
      const response = await fetch(`/api/achievements?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Achievement deleted successfully",
        });
        fetchAchievements();
      }
    } catch (error) {
      console.error("Error deleting achievement:", error);
      toast({
        title: "Error",
        description: "Failed to delete achievement",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
    });
    setEditingAchievement(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Achievements</h1>
          <p className="text-gray-400">Track your achievements and milestones</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-600 hover:bg-yellow-700" onClick={resetForm}>
              + Add Achievement
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAchievement ? "Edit Achievement" : "Add New Achievement"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Enter your achievement details below
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Achievement Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Won first place in hackathon..."
                  className="bg-gray-800 border-gray-700"
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
                <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700">
                  {editingAchievement ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-400 py-12">Loading...</div>
      ) : !achievements || achievements.length === 0 ? (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="text-center py-12">
            <p className="text-gray-400">
              No achievements added yet. Add your first achievement!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {achievements.map((achievement, index) => (
            <Card key={achievement._id} className="bg-gray-900/50 border-gray-800">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{achievement.title}</p>
                    <p className="text-sm text-gray-400">
                      Added on {new Date(achievement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(achievement)}
                    className="border-gray-700"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(achievement._id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
