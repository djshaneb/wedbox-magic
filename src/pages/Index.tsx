import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanningTools } from "@/components/planning/PlanningTools";
import { GuestList } from "@/components/guests/GuestList";
import { BudgetTracker } from "@/components/budget/BudgetTracker";
import { VendorList } from "@/components/vendors/VendorList";
import { Timeline } from "@/components/timeline/Timeline";
import { PhotoGallery } from "@/components/photos/PhotoGallery";
import { useIsMobile } from "@/hooks/use-mobile";
import { Calendar, Users, Wallet2, Store, Clock, Camera } from "lucide-react";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <div className={`container mx-auto ${isMobile ? 'p-2' : 'p-6'}`}>
        <h1 className={`font-bold ${isMobile ? 'text-2xl mb-4' : 'text-4xl mb-6'} text-center`}>
          Wedding Planning
        </h1>
        <Tabs defaultValue="planning" className="w-full">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3 gap-1 mb-2' : 'grid-cols-6'} bg-muted/50 p-1 rounded-xl`}>
            <TabsTrigger value="planning" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {!isMobile && "Planning"}
            </TabsTrigger>
            <TabsTrigger value="guests" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {!isMobile && "Guests"}
            </TabsTrigger>
            <TabsTrigger value="budget" className="flex items-center gap-2">
              <Wallet2 className="h-4 w-4" />
              {!isMobile && "Budget"}
            </TabsTrigger>
            <TabsTrigger value="vendors" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              {!isMobile && "Vendors"}
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {!isMobile && "Timeline"}
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              {!isMobile && "Photos"}
            </TabsTrigger>
          </TabsList>

          <div className={`mt-${isMobile ? '2' : '4'}`}>
            <TabsContent value="planning">
              <Card className="border-0 shadow-none">
                <CardHeader className={isMobile ? 'px-2 py-3' : 'p-6'}>
                  <CardTitle>Planning Tools</CardTitle>
                  <CardDescription>Organize your wedding planning tasks and track progress</CardDescription>
                </CardHeader>
                <CardContent className={isMobile ? 'px-2' : 'px-6'}>
                  <PlanningTools />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="guests">
              <Card className="border-0 shadow-none">
                <CardHeader className={isMobile ? 'px-2 py-3' : 'p-6'}>
                  <CardTitle>Guest List Management</CardTitle>
                  <CardDescription>Manage your wedding guests and track RSVPs</CardDescription>
                </CardHeader>
                <CardContent className={isMobile ? 'px-2' : 'px-6'}>
                  <GuestList />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="budget">
              <Card className="border-0 shadow-none">
                <CardHeader className={isMobile ? 'px-2 py-3' : 'p-6'}>
                  <CardTitle>Budget Tracker</CardTitle>
                  <CardDescription>Track your wedding expenses and manage your budget</CardDescription>
                </CardHeader>
                <CardContent className={isMobile ? 'px-2' : 'px-6'}>
                  <BudgetTracker />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="vendors">
              <Card className="border-0 shadow-none">
                <CardHeader className={isMobile ? 'px-2 py-3' : 'p-6'}>
                  <CardTitle>Vendor Management</CardTitle>
                  <CardDescription>Keep track of all your wedding vendors and their contact information</CardDescription>
                </CardHeader>
                <CardContent className={isMobile ? 'px-2' : 'px-6'}>
                  <VendorList />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="timeline">
              <Card className="border-0 shadow-none">
                <CardHeader className={isMobile ? 'px-2 py-3' : 'p-6'}>
                  <CardTitle>Timeline</CardTitle>
                  <CardDescription>Track important dates and milestones for your wedding</CardDescription>
                </CardHeader>
                <CardContent className={isMobile ? 'px-2' : 'px-6'}>
                  <Timeline />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="photos">
              <Card className="border-0 shadow-none">
                <CardHeader className={isMobile ? 'px-2 py-3' : 'p-6'}>
                  <CardTitle>Photo Gallery</CardTitle>
                  <CardDescription>Share and view wedding photos with your guests</CardDescription>
                </CardHeader>
                <CardContent className={isMobile ? 'px-2' : 'px-6'}>
                  <PhotoGallery />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;