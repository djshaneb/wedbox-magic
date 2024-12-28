import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
}

export const Timeline = () => {
  const [events, setEvents] = React.useState<TimelineEvent[]>([
    {
      id: 1,
      date: "2024-06-15",
      title: "Venue Visit",
      description: "First visit to potential wedding venues",
    },
    {
      id: 2,
      date: "2024-07-01",
      title: "Save the Dates",
      description: "Send out save the date cards",
    },
  ]);

  const [newEvent, setNewEvent] = React.useState({
    date: "",
    title: "",
    description: "",
  });

  const handleAddEvent = () => {
    if (newEvent.date && newEvent.title) {
      setEvents([
        ...events,
        {
          id: events.length + 1,
          ...newEvent,
        },
      ]);
      setNewEvent({ date: "", title: "", description: "" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Event</h3>
        <div className="grid gap-4">
          <div className="flex gap-4">
            <Input
              type="date"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: e.target.value })
              }
              className="flex-1"
            />
            <Input
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              className="flex-1"
            />
          </div>
          <Input
            placeholder="Description"
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
          />
          <Button onClick={handleAddEvent} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {events
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((event) => (
            <Card key={event.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">{event.title}</h4>
                    <span className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
};