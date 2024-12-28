import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanningTools } from "@/components/planning/PlanningTools";
import { GuestList } from "@/components/guests/GuestList";
import { BudgetTracker } from "@/components/budget/BudgetTracker";

const Index = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Wedding Planning Dashboard</h1>
      <Tabs defaultValue="planning" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="planning">Planning Tools</TabsTrigger>
          <TabsTrigger value="guests">Guest List</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default Index;