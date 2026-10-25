export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: PixelCrop,
  outputSize: number = 300
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context available');
  }

  canvas.width = outputSize;
  canvas.height = outputSize;

  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize,
    outputSize
  );

  return canvas.toDataURL('image/jpeg', 0.92);
}

/** Largest centred square of the image, in source pixels. */
export async function getCenteredSquareCrop(imageSrc: string): Promise<PixelCrop> {
  const image = await createImage(imageSrc);
  const side = Math.min(image.naturalWidth, image.naturalHeight);
  return {
    x: Math.round((image.naturalWidth - side) / 2),
    y: Math.round((image.naturalHeight - side) / 2),
    width: side,
    height: side,
  };
}
