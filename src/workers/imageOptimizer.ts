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
  const canvas = new OffscreenCanvas(192, 192);
  const thumbnailCanvas = new OffscreenCanvas(48, 48);
  const ctx = canvas.getContext('2d');
  const thumbnailCtx = thumbnailCanvas.getContext('2d');

  if (!ctx || !thumbnailCtx) {
    throw new Error('Failed to get canvas context');
  }

  const blob = new Blob([imageData]);
  const bitmap = await createImageBitmap(blob);

  const mainDimensions = calculateDimensions(bitmap.width, bitmap.height, 192);
  const thumbnailDimensions = calculateDimensions(bitmap.width, bitmap.height, 48);

  canvas.width = mainDimensions.width;
  canvas.height = mainDimensions.height;
  thumbnailCanvas.width = thumbnailDimensions.width;
  thumbnailCanvas.height = thumbnailDimensions.height;

  const optimizedImage = await createOptimizedImage(bitmap, canvas, ctx, 0.85);
  const optimizedThumbnail = await createOptimizedImage(bitmap, thumbnailCanvas, thumbnailCtx, 0.60);

  return {
    blob: optimizedImage,
    type: 'image/webp',
    thumbnail: optimizedThumbnail,
  };
};

export { optimizeImage };