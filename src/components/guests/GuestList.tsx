import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus } from "lucide-react";

interface Guest {
  id: number;
  name: string;
  email: string;
  rsvp: "pending" | "confirmed" | "declined";
}

export const GuestList = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newGuest, setNewGuest] = useState({ name: "", email: "" });

  const addGuest = () => {
    if (newGuest.name && newGuest.email) {
      setGuests([
        ...guests,
        { id: Date.now(), ...newGuest, rsvp: "pending" }
      ]);
      setNewGuest({ name: "", email: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Guest name"
          value={newGuest.name}
          onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
        />
        <Input
          placeholder="Email address"
          type="email"
          value={newGuest.email}
          onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
        />
        <Button onClick={addGuest}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Guest
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>RSVP Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <TableRow key={guest.id}>
              <TableCell>{guest.name}</TableCell>
              <TableCell>{guest.email}</TableCell>
              <TableCell>
                <span className={`capitalize ${
                  guest.rsvp === "confirmed" ? "text-green-600" :
                  guest.rsvp === "declined" ? "text-red-600" :
                  "text-yellow-600"
                }`}>
                  {guest.rsvp}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};