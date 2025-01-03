import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all photos that don't have thumbnails
    const { data: photos, error: fetchError } = await supabase
      .from('photos')
      .select('*')
      .is('thumbnail_path', null)

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${photos?.length || 0} photos without thumbnails`);

    if (!photos || photos.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No photos need thumbnail generation' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const results = [];

    for (const photo of photos) {
      try {
        // Download the original image
        const { data: fileData, error: downloadError } = await supabase
          .storage
          .from('photos')
          .download(photo.storage_path)

        if (downloadError) throw downloadError;

        // Create thumbnail path
        const thumbnailPath = `thumbnails/${photo.storage_path}`;

        // Upload the file as a thumbnail (Supabase will handle the resizing)
        const { error: uploadError } = await supabase
          .storage
          .from('photos')
          .upload(thumbnailPath, fileData, {
            contentType: 'image/webp',
            upsert: true
          });

        if (uploadError) throw uploadError;

        // Update the photo record with the thumbnail path
        const { error: updateError } = await supabase
          .from('photos')
          .update({ thumbnail_path: thumbnailPath })
          .eq('id', photo.id);

        if (updateError) throw updateError;

        results.push({
          id: photo.id,
          status: 'success',
          thumbnailPath
        });

      } catch (error) {
        console.error(`Error processing photo ${photo.id}:`, error);
        results.push({
          id: photo.id,
          status: 'error',
          error: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Thumbnail generation complete',
        results 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate thumbnails',
        details: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    )
  }
})