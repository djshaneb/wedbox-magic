import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PhotoGallery } from "@/components/photos/PhotoGallery";
import { supabase } from "@/integrations/supabase/client";
import { SharedGalleryHeader } from "@/components/shared-gallery/SharedGalleryHeader";

interface WeddingDetails {
  id: string;
  user_id: string;
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

  const validateAccessCode = async () => {
    if (!accessCode) {
      setIsValid(false);
      return;
    }

    const { data, error } = await supabase
      .from('shared_galleries')
      .select('owner_id')
      .eq('access_code', accessCode)
      .single();

    if (error || !data) {
      console.error('Error validating access code:', error);
      setIsValid(false);
      return;
    }

    setOwnerId(data.owner_id);
    setIsValid(true);
  };

  useEffect(() => {
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
          <p className="text-gray-600">
            This gallery link is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SharedGalleryHeader 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        setIsPhotoBooth={setIsPhotoBooth}
        sharedGalleryOwnerId={ownerId || undefined}
      />

      <div className="container mx-auto px-4 py-8 pt-20">
        {ownerId && (
          <PhotoGallery 
            sharedGalleryOwnerId={ownerId}
            isSharedView={true}
            isPhotoBooth={isPhotoBooth}
            setIsPhotoBooth={setIsPhotoBooth}
          />
        )}
      </div>
    </div>
  );
};

export default SharedGallery;