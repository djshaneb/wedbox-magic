const optimizeImage = async (imageData: ArrayBuffer, fileName: string): Promise<{ blob: Blob, type: string, thumbnail: Blob }> => {
  const img = new Image();
  const canvas = new OffscreenCanvas(192, 192);
  const thumbnailCanvas = new OffscreenCanvas(48, 48); // Reduced from 96x96 to 48x48
  const ctx = canvas.getContext('2d');
  const thumbnailCtx = thumbnailCanvas.getContext('2d');
  
  if (!ctx || !thumbnailCtx) throw new Error('Could not get canvas context');

  // Create a bitmap from the array buffer
  const bitmap = await createImageBitmap(new Blob([imageData]));
  
  // Calculate new dimensions (max 192px while maintaining aspect ratio)
  const maxSize = 192;
  const thumbnailSize = 48; // Reduced from 96 to 48
  let width = bitmap.width;
  let height = bitmap.height;
  let thumbnailWidth = width;
  let thumbnailHeight = height;

  if (width > height && width > maxSize) {
    height = (height * maxSize) / width;
    width = maxSize;
  } else if (height > maxSize) {
    width = (width * maxSize) / height;
    height = maxSize;
  }

  // Calculate thumbnail dimensions
  if (thumbnailWidth > thumbnailHeight && thumbnailWidth > thumbnailSize) {
    thumbnailHeight = (thumbnailHeight * thumbnailSize) / thumbnailWidth;
    thumbnailWidth = thumbnailSize;
  } else if (thumbnailHeight > thumbnailSize) {
    thumbnailWidth = (thumbnailWidth * thumbnailSize) / thumbnailHeight;
    thumbnailHeight = thumbnailSize;
  }

  // Set canvas sizes
  canvas.width = width;
  canvas.height = height;
  thumbnailCanvas.width = thumbnailWidth;
  thumbnailCanvas.height = thumbnailHeight;
  
  // Use better image rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  thumbnailCtx.imageSmoothingEnabled = true;
  thumbnailCtx.imageSmoothingQuality = 'medium';
  
  // Draw main image and thumbnail
  ctx.drawImage(bitmap, 0, 0, width, height);
  thumbnailCtx.drawImage(bitmap, 0, 0, thumbnailWidth, thumbnailHeight);

  // Convert both to WebP with reduced quality
  const blob = await canvas.convertToBlob({
    type: 'image/webp',
    quality: 0.85
  });

  const thumbnail = await thumbnailCanvas.convertToBlob({
    type: 'image/webp',
    quality: 0.60 // Reduced quality for thumbnails
  });

  return { 
    blob,
    thumbnail,
    type: 'image/webp'
  };
};

// Handle messages from the main thread
self.onmessage = async (e: MessageEvent) => {
  try {
    const { imageData, fileName } = e.data;
    const result = await optimizeImage(imageData, fileName);
    self.postMessage({ success: true, result });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};