import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

interface NavigationTabsProps {
  activeTab: "photos" | "albums" | "theme";
  setActiveTab: (tab: "photos" | "albums" | "theme") => void;
}

export const NavigationTabs = ({ activeTab, setActiveTab }: NavigationTabsProps) => {
  return (
    <div className="flex space-x-4 mt-4">
      <Button
        variant={activeTab === "photos" ? "default" : "ghost"}
        onClick={() => setActiveTab("photos")}
        className="text-sm"
      >
        Photos
      </Button>
      <Button
        variant={activeTab === "albums" ? "default" : "ghost"}
        onClick={() => setActiveTab("albums")}
        className="text-sm"
      >
        Albums
      </Button>
      <Button
        variant={activeTab === "theme" ? "default" : "ghost"}
        onClick={() => setActiveTab("theme")}
        className="text-sm"
      >
        <Palette className="w-4 h-4 mr-2" />
        Theme
      </Button>
    </div>
  );
};