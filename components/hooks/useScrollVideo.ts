import { useEffect, useState } from "react";

export function useScrollVideo(
  totalFrames: number,
  framePath: (index: number) => string
) {
  const [images, setImages] = useState<(HTMLImageElement | null)[]>(
    Array(totalFrames).fill(null)
  );

  useEffect(() => {
    let isMounted = true;
    const newImages = [...images];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();

      img.onload = () => {
        if (!isMounted) return;
        newImages[i - 1] = img;
        setImages([...newImages]);
      };

      img.onerror = () => {
        if (!isMounted) return;
        newImages[i - 1] = null;
        setImages([...newImages]);
      };

      img.src = framePath(i);
    }

    return () => {
      isMounted = false;
    };
  }, [totalFrames, framePath]);

  return images;
}