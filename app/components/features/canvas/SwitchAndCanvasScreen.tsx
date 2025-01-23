import { useState } from 'react';
import { SwitchAndCanvas } from '@/app/components/features/home/SwitchAndCanvas';
import { CanvasDrawing } from '@/app/components/features/canvas/CanvasDrawing';
import { router } from 'expo-router';

export function SwitchAndCanvasScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleCloseCanvas = () => {
    router.back();
  };

  return (
    <CanvasDrawing onClose={handleCloseCanvas} isDarkMode={isDarkMode} />
  );
} 