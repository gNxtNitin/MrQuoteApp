import { useState, useEffect } from 'react';
import { SplashScreen } from './components/features/splashScreen/SplashScreen';
import { HomePage } from './components/features/home/HomePage';
import { CanvasDrawing } from './components/features/canvas/CanvasDrawing';
import { LoginScreen } from './components/features/login/LoginScreen';
import { lockLandscapeOrientation, preventOrientationChange } from './config/orientation';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    lockLandscapeOrientation();
    const cleanup = preventOrientationChange();

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return cleanup;
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleOpenCanvas = () => {
    setShowCanvas(true);
  };

  const handleCloseCanvas = () => {
    setShowCanvas(false);
  };

  const handleToggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} isDarkMode={isDarkMode} />;
  }

  if (showCanvas) {
    return <CanvasDrawing onClose={handleCloseCanvas} isDarkMode={isDarkMode} />;
  }

  return (
    <HomePage 
      onOpenCanvas={handleOpenCanvas}
      onToggleTheme={handleToggleTheme}
      isDarkMode={isDarkMode}
    />
  );
} 

