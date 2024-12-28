import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Contact, MapPin, Phone, Plus } from "lucide-react";

interface Vendor {
  id: number;
  name: string;
  category: string;
  contact: string;
  phone: string;
  location: string;
}

export const VendorList = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [newVendor, setNewVendor] = useState({
    name: "",
    category: "",
    contact: "",
    phone: "",
    location: ""
  });

  const addVendor = () => {
    if (newVendor.name && newVendor.category) {
      setVendors([
        ...vendors,
        {
          id: Date.now(),
          ...newVendor
        }
      ]);
      setNewVendor({ name: "", category: "", contact: "", phone: "", location: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Input
          placeholder="Vendor name"
          value={newVendor.name}
          onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
        />
        <Input
          placeholder="Category"
          value={newVendor.category}
          onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
        />
        <Input
          placeholder="Contact person"
          value={newVendor.contact}
          onChange={(e) => setNewVendor({ ...newVendor, contact: e.target.value })}
        />
        <Input
          placeholder="Phone number"
          value={newVendor.phone}
          onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
        />
        <Input
          placeholder="Location"
          value={newVendor.location}
          onChange={(e) => setNewVendor({ ...newVendor, location: e.target.value })}
        />
        <Button onClick={addVendor} className="h-10">
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell>{vendor.name}</TableCell>
              <TableCell>{vendor.category}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Contact className="h-4 w-4" />
                  {vendor.contact}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {vendor.phone}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {vendor.location}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};