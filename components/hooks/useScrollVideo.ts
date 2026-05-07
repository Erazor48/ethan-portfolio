import { useEffect, useRef, useState } from "react";

export function useScrollVideo(
  totalFrames: number,
  framePath: (index: number) => string
) {
  const imagesRef = useRef<(HTMLImageElement | null)[]>(Array(totalFrames).fill(null));
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    imagesRef.current = Array(totalFrames).fill(null);
    setFirstFrameReady(false);

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.onload = () => {
        if (!isMounted) return;
        imagesRef.current[i - 1] = img;
        if (i === 1) setFirstFrameReady(true);
      };
      img.onerror = () => {
        if (!isMounted) return;
        imagesRef.current[i - 1] = null;
        if (i === 1) setFirstFrameReady(true);
      };
      img.src = framePath(i);
    }

    return () => {
      isMounted = false;
    };
  }, [totalFrames, framePath]);

  return { imagesRef, firstFrameReady };
}
