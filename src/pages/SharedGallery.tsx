import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PhotoGallery } from "@/components/photos/PhotoGallery";
import { supabase } from "@/integrations/supabase/client";
import { Camera } from "lucide-react";

const SharedGallery = () => {
  const { accessCode } = useParams();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);

  useEffect(() => {
    const validateAccessCode = async () => {
      try {
        const { data, error } = await supabase
          .from('shared_galleries')
          .select('owner_id')
          .eq('access_code', accessCode)
          .single();

        if (error) throw error;
        
        setIsValid(true);
        setOwnerId(data.owner_id);
      } catch (error) {
        console.error('Error validating access code:', error);
        setIsValid(false);
      }
    };

    validateAccessCode();
  }, [accessCode]);

  if (isValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Gallery Link</h1>
          <p className="text-gray-600">This gallery link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b border-wedding-pink/20 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col items-start">
            <h1 className="font-semibold text-xl flex items-center gap-2">
              <Camera className="h-5 w-5 text-wedding-pink" />
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