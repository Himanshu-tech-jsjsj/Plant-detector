/**
 * Ultra-fast client-side image compression for instantaneous AI leaf diagnosis
 * Reduces multi-megabyte camera photos to ~60-80KB for sub-second uploads
 */
export async function compressLeafImage(imageSource: File | string, maxDimension = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve) => {
    let rawFallback = typeof imageSource === 'string' ? imageSource : '';

    const processDataUrl = (dataUrl: string) => {
      rawFallback = dataUrl;
      const img = new Image();

      img.onload = () => {
        try {
          let width = img.width || 600;
          let height = img.height || 400;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawFallback);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'medium';
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl || rawFallback);
        } catch (err) {
          console.warn('Compression error, falling back to raw dataUrl:', err);
          resolve(rawFallback);
        }
      };

      img.onerror = (err) => {
        console.warn('Image load error during compression, using raw dataUrl:', err);
        resolve(rawFallback);
      };

      img.src = dataUrl;
    };

    if (typeof imageSource === 'string') {
      processDataUrl(imageSource);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          processDataUrl(e.target.result as string);
        } else {
          resolve('');
        }
      };
      reader.onerror = () => {
        resolve('');
      };
      reader.readAsDataURL(imageSource);
    }
  });
}
