"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/src/hooks/use-toast";
import FileUpload from "@/components/ui/file-upload";

interface FindMeEvent {
  _id: string;
  event: string;
  imageUrl: string;
  type: "past" | "future";
  date: string;
  location: string;
  eventUrl: string;
}

export default function FindMePage() {
  const [events, setEvents] = useState<FindMeEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<FindMeEvent | null>(null);
  const [imageFile, setImageFile] = useState<File[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    event: "",
    type: "future" as "past" | "future",
    date: "",
    location: "",
    eventUrl: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/findMe");
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to fetch events",
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
      // Validate image file for new events
      if (!editingEvent && imageFile.length === 0) {
        toast({
          title: "Error",
          description: "Please select an event image",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('event', formData.event);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('eventUrl', formData.eventUrl);

      // Add image file
      if (imageFile.length > 0) {
        formDataToSend.append('image', imageFile[0]);
      }

      if (editingEvent) {
        formDataToSend.append('id', editingEvent._id);
      }

      const url = editingEvent ? `/api/findMe?id=${editingEvent._id}` : "/api/findMe";
      const method = editingEvent ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: `Event ${editingEvent ? "updated" : "created"} successfully`,
        });
        setIsDialogOpen(false);
        resetForm();
        fetchEvents();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        title: "Error",
        description: `Failed to ${editingEvent ? "update" : "create"} event`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (event: FindMeEvent) => {
    setEditingEvent(event);
    setFormData({
      event: event.event,
      type: event.type,
      date: new Date(event.date).toISOString().split("T")[0],
      location: event.location,
      eventUrl: event.eventUrl,
    });
    setImageFile([]);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`/api/findMe?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
        fetchEvents();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      event: "",
      type: "future",
      date: "",
      location: "",
      eventUrl: "",
    });
    setImageFile([]);
    setEditingEvent(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const pastEvents = events?.filter((e) => e.type === "past") || [];
  const futureEvents = events?.filter((e) => e.type === "future") || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Find Me Events</h1>
          <p className="text-gray-400">Manage your event appearances</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700" onClick={resetForm}>
              + Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? "Edit Event" : "Add New Event"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Fill in the event details below
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="event">Event Name *</Label>
                <Input
                  id="event"
                  value={formData.event}
                  onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                  required
                  placeholder="Tech Conference 2024"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Event Type *</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as "past" | "future" })
                  }
                  required
                  className="w-full rounded-md bg-gray-800 border-gray-700 px-3 py-2 text-white"
                >
                  <option value="future">Future Event</option>
                  <option value="past">Past Event</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Event Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  placeholder="e.g., San Francisco, CA"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventUrl">Event URL *</Label>
                <Input
                  id="eventUrl"
                  type="url"
                  value={formData.eventUrl}
                  onChange={(e) => setFormData({ ...formData, eventUrl: e.target.value })}
                  required
                  placeholder="https://example.com/event"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <FileUpload
                  id="eventImage"
                  label="Event Image *"
                  accept="image/*"
                  multiple={false}
                  currentFiles={editingEvent ? [editingEvent.imageUrl] : []}
                  onChange={setImageFile}
                  preview={true}
                  required={!editingEvent}
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
                <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                  {editingEvent ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-400 py-12">Loading...</div>
      ) : !events || events.length === 0 ? (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="text-center py-12">
            <p className="text-gray-400">No events added yet. Add your first event!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Future Events */}
          {futureEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {futureEvents.map((event) => (
                  <Card key={event._id} className="bg-gray-900/50 border-gray-800">
                    <CardHeader className="p-0">
                      <img
                        src={event.imageUrl}
                        alt={event.event}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-white mb-2">{event.event}</CardTitle>
                      <p className="text-sm text-gray-400 mb-1">{formatDate(event.date)}</p>
                      <p className="text-sm text-gray-500 mb-4">📍 {event.location}</p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(event)}
                          className="border-gray-700 flex-1"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(event._id)}
                          className="flex-1"
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Past Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <Card key={event._id} className="bg-gray-900/50 border-gray-800 opacity-75">
                    <CardHeader className="p-0">
                      <img
                        src={event.imageUrl}
                        alt={event.event}
                        className="w-full h-48 object-cover rounded-t-lg grayscale"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-white mb-2">{event.event}</CardTitle>
                      <p className="text-sm text-gray-400 mb-1">{formatDate(event.date)}</p>
                      <p className="text-sm text-gray-500 mb-4">📍 {event.location}</p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(event)}
                          className="border-gray-700 flex-1"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(event._id)}
                          className="flex-1"
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
