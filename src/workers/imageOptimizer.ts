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
): Promise<{ blob: Blob; type: string; thumbnail: Blob }> => {
  const img = new Image();
  // Set full size image to 1200px max
  const canvas = new OffscreenCanvas(1200, 1200);
  // Set thumbnail to 150px max for gallery view
  const thumbnailCanvas = new OffscreenCanvas(150, 150);
  const ctx = canvas.getContext('2d');
  const thumbnailCtx = thumbnailCanvas.getContext('2d');

  if (!ctx || !thumbnailCtx) {
    throw new Error('Failed to get canvas context');
  }

  const blob = new Blob([imageData]);
  const bitmap = await createImageBitmap(blob);

  const mainDimensions = calculateDimensions(bitmap.width, bitmap.height, 1200);
  const thumbnailDimensions = calculateDimensions(bitmap.width, bitmap.height, 150);

  canvas.width = mainDimensions.width;
  canvas.height = mainDimensions.height;
  thumbnailCanvas.width = thumbnailDimensions.width;
  thumbnailCanvas.height = thumbnailDimensions.height;

  // Higher quality for full-size images
  const optimizedImage = await createOptimizedImage(bitmap, canvas, ctx, 0.85);
  // Lower quality for thumbnails since they're smaller
  const optimizedThumbnail = await createOptimizedImage(bitmap, thumbnailCanvas, thumbnailCtx, 0.6);

  return {
    blob: optimizedImage,
    type: 'image/webp',
    thumbnail: optimizedThumbnail,
  };
};

export { optimizeImage };