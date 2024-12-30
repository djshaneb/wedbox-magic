import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PhotoGallery } from "@/components/photos/PhotoGallery";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Plus, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

interface WeddingDetails {
  couple_names: string;
  wedding_date: string;
  photo_url: string | null;
}

const SharedGallery = () => {
  const { accessCode } = useParams();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPhotoBooth, setIsPhotoBooth] = useState(false);

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

  const { data: weddingDetails } = useQuery({
    queryKey: ['weddingDetails', ownerId],
    queryFn: async () => {
      if (!ownerId) return null;
      
      const { data, error } = await supabase
        .from('wedding_details')
        .select('*')
        .eq('user_id', ownerId)
        .single();

      if (error) throw error;
      return data as WeddingDetails;
    },
    enabled: !!ownerId
  });

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
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start">
              <h1 className="font-semibold text-xl flex items-center gap-2">
                <Camera className="h-5 w-5 text-wedding-pink" />
                <span className="bg-gradient-to-r from-wedding-pink to-pink-400 bg-clip-text text-transparent font-bold">
                  Wedding Win
                </span>
              </h1>
              <span className="text-sm font-medium text-gray-600">PHOTO SHARE</span>
            </div>

            {weddingDetails && (
              <div className="flex items-center gap-4">
                {weddingDetails.photo_url && (
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-wedding-pink">
                    <img
                      src={weddingDetails.photo_url}
                      alt="Wedding couple"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="text-right">
                  <h2 className="font-semibold text-gray-900">
                    {weddingDetails.couple_names}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {format(new Date(weddingDetails.wedding_date), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                size="icon"
                className={`relative h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-105 ${isMenuOpen ? 'rotate-45' : ''}`}
              >
                <Plus className={`h-5 w-5 transition-transform duration-500 ${isMenuOpen ? 'rotate-180' : ''}`} />
              </Button>

              {isMenuOpen && (
                <div className="absolute top-16 right-4 bg-white rounded-lg shadow-xl p-2 space-y-2 animate-fade-in">
                  <Button
                    onClick={() => {
                      document.getElementById("photo-upload")?.click();
                      setIsMenuOpen(false);
                    }}
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Upload className="mr-2 h-4 w-4" /> Upload Photos
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setIsPhotoBooth(!isPhotoBooth);
                      setIsMenuOpen(false);
                    }}
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Image className="mr-2 h-4 w-4" /> Photo Booth Mode
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 pt-20">
        {ownerId && (
          <PhotoGallery 
            sharedGalleryOwnerId={ownerId} 
            isSharedView 
            isPhotoBooth={isPhotoBooth}
            setIsPhotoBooth={setIsPhotoBooth}
          />
        )}
      </div>
    </div>
  );
};

export default SharedGallery;