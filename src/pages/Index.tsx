import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanningTools } from "@/components/planning/PlanningTools";
import { GuestList } from "@/components/guests/GuestList";
import { BudgetTracker } from "@/components/budget/BudgetTracker";
import { VendorList } from "@/components/vendors/VendorList";

const Index = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Wedding Planning Dashboard</h1>
      <Tabs defaultValue="planning" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="planning">Planning Tools</TabsTrigger>
          <TabsTrigger value="guests">Guest List</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>
        <TabsContent value="planning">
          <Card>
            <CardHeader>
              <CardTitle>Planning Tools</CardTitle>
              <CardDescription>Organize your wedding planning tasks and track progress</CardDescription>
            </CardHeader>
            <CardContent>
              <PlanningTools />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="guests">
          <Card>
            <CardHeader>
              <CardTitle>Guest List Management</CardTitle>
              <CardDescription>Manage your wedding guests and track RSVPs</CardDescription>
            </CardHeader>
            <CardContent>
              <GuestList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Budget Tracker</CardTitle>
              <CardDescription>Track your wedding expenses and manage your budget</CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetTracker />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Management</CardTitle>
              <CardDescription>Keep track of all your wedding vendors and their contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <VendorList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;