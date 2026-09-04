'use client';

import { useState, useRef, useCallback } from 'react';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Use a ref to always have the latest stream for cleanup, avoiding stale closures
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async (mode?: 'environment' | 'user') => {
    const targetMode = mode ?? facingMode;
    try {
      // Stop any existing stream tracks before starting new one
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: targetMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = newStream;
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
      }
      setIsStreaming(true);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not access camera';
      setError(message);
      setIsStreaming(false);
    }
  }, [facingMode]); // Only depends on facingMode, not on stream (stream tracked via ref)

  const stopCamera = useCallback(() => {
    // Always uses streamRef.current to get the latest stream — no stale closure
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []); // No dependencies needed — reads from ref

  const toggleFacingMode = useCallback(() => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  }, [facingMode, startCamera]);

  /**
   * Captures the current video frame as a JPEG Blob.
   * Returns a Promise<Blob | null> — awaitable by callers.
   */
  const capturePhoto = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!videoRef.current) {
        resolve(null);
        return;
      }
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.85);
    });
  }, []);

  return {
    videoRef,
    isStreaming,
    error,
    startCamera,
    stopCamera,
    toggleFacingMode,
    capturePhoto,
    facingMode,
  };
}
