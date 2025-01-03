interface ImageDimensions {
  width: number;
  height: number;
}

const calculateDimensions = (originalWidth: number, originalHeight: number, maxSize: number): ImageDimensions => {
  let width = originalWidth;
  let height = originalHeight;

  if (width > maxSize || height > maxSize) {
    if (width > height) {
      height = Math.round((height * maxSize) / width);
      width = maxSize;
    } else {
      width = Math.round((width * maxSize) / height);
      height = maxSize;
    }
  }

  return { width, height };
};

const createOptimizedImage = async (
  bitmap: ImageBitmap,
  canvas: OffscreenCanvas,
  ctx: OffscreenCanvasRenderingContext2D,
  quality: number
): Promise<Blob> => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return await canvas.convertToBlob({
    type: 'image/webp',
    quality,
  });
};

const optimizeImage = async (
  imageData: ArrayBuffer,
  fileName: string
): Promise<{ blob: Blob; type: string }> => {
  const blob = new Blob([imageData]);
  const bitmap = await createImageBitmap(blob);
  
  // Create thumbnail (max 300px)
  const thumbnailDimensions = calculateDimensions(bitmap.width, bitmap.height, 300);
  const thumbnailCanvas = new OffscreenCanvas(thumbnailDimensions.width, thumbnailDimensions.height);
  const thumbnailCtx = thumbnailCanvas.getContext('2d');

  if (!thumbnailCtx) {
    throw new Error('Failed to get canvas context');
  }

  const optimizedThumbnail = await createOptimizedImage(bitmap, thumbnailCanvas, thumbnailCtx, 0.7);

  return {
    blob: optimizedThumbnail,
    type: 'image/webp',
  };
};

export { optimizeImage };