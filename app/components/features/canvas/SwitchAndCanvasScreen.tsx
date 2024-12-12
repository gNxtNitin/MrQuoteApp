import { useState } from 'react';
import { SwitchAndCanvas } from '@/app/components/features/home/SwitchAndCanvas';
import { CanvasDrawing } from '@/app/components/features/canvas/CanvasDrawing';

export function SwitchAndCanvasScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  const handleOpenCanvas = () => {
    setShowCanvas(true);
  };

  const handleCloseCanvas = () => {
    setShowCanvas(false);
  };

  const handleToggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  if (showCanvas) {
    return <CanvasDrawing onClose={handleCloseCanvas} isDarkMode={isDarkMode} />;
  }

  return (
    <SwitchAndCanvas 
      onOpenCanvas={handleOpenCanvas}
      onToggleTheme={handleToggleTheme}
      isDarkMode={isDarkMode}
    />
  );
} 