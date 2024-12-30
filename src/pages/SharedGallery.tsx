import { useState, useEffect } from "react";
import { PhotoGallery } from "@/components/photos/PhotoGallery";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { SharedGalleryHeader } from "@/components/shared-gallery/SharedGalleryHeader";

interface WeddingDetails {
  id: string;
  user_id: string;
  couple_names: string;
  wedding_date: string;
  photo_url: string | null;
}

const SharedGallery = () => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPhotoBooth, setIsPhotoBooth] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const accessCode = params.get('code');

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Access Code</h1>
          <p className="text-gray-600">
            The shared gallery access code is invalid or has expired.
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