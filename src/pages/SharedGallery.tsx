import { useParams } from "react-router-dom";
import { PhotoGallery } from "@/components/photos/PhotoGallery";
import { supabase } from "@/integrations/supabase/client";
import { Camera } from "lucide-react";
import React from "react";

const SharedGallery = () => {
  const { accessCode } = useParams();
  const [ownerId, setOwnerId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchOwnerId = async () => {
      const { data, error } = await supabase
        .from("galleries")
        .select("owner_id")
        .eq("access_code", accessCode)
        .single();

      if (error) {
        console.error("Error fetching owner ID:", error);
      } else {
        setOwnerId(data?.owner_id);
      }
    };

    if (accessCode) {
      fetchOwnerId();
    }
  }, [accessCode]);

  if (!accessCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-pink-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Gallery Link</h1>
          <p className="text-gray-600">This gallery link appears to be invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b border-wedding-pink/20 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col items-start">
            <h1 className="font-semibold text-xl flex items-center gap-2">
              <Camera className="h-5 w-5 text-wedding-pink animate-pulse" />
              <span className="bg-gradient-to-r from-wedding-pink to-pink-400 bg-clip-text text-transparent font-bold">
                Wedding Win
              </span>
            </h1>
            <span className="text-sm font-medium text-gray-600">PHOTO SHARE</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 pt-20">
        {ownerId && <PhotoGallery sharedGalleryOwnerId={ownerId} isSharedView />}
      </div>
    </div>
  );
};

export default SharedGallery;
