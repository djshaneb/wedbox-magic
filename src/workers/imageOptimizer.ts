const optimizeImage = async (imageData: ArrayBuffer, fileName: string): Promise<{ blob: Blob, type: string }> => {
  const img = new Image();
  const canvas = new OffscreenCanvas(256, 256);
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');

  // Create a bitmap from the array buffer
  const bitmap = await createImageBitmap(new Blob([imageData]));
  
  // Calculate new dimensions (max 256px while maintaining aspect ratio)
  const maxSize = 256;
  let width = bitmap.width;
  let height = bitmap.height;

  if (width > height && width > maxSize) {
    height = (height * maxSize) / width;
    width = maxSize;
  } else if (height > maxSize) {
    width = (width * maxSize) / height;
    height = maxSize;
  }

  // Set canvas size and draw image
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(bitmap, 0, 0, width, height);

  // Convert to WebP with lower quality for faster processing
  const blob = await canvas.convertToBlob({
    type: 'image/webp',
    quality: 0.75
  });

  return { 
    blob,
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