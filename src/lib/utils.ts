import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.9): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      resolve(file); // Return original file if not an image
      return;
    }

    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const reader = new FileReader();

    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        img.src = e.target.result;
      } else {
        reject(new Error('FileReader did not return a string.'));
      }
    };

    reader.onerror = reject;

    img.onload = () => {
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        const maxHeight = maxWidth; // Use same value for max height for simplicity
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
          console.log(`Compressed size: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);
          resolve(blob);
        } else {
          reject(new Error('Canvas to Blob conversion failed'));
        }
      }, file.type, quality);
    };

    img.onerror = reject;
    reader.readAsDataURL(file);
  });
};
