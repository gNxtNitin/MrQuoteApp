import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Button, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Canvas,
  Path,
  Group,
  Rect,
  Skia,
  useCanvasRef,
  vec,
  type SkPath,
  Circle,
} from "@shopify/react-native-skia";

type DrawingMode = 'pipe' | 'dottedLine';
type Point = { x: number; y: number; elementX?: number; elementY?: number; lastRotation?: number };

interface PipeElement {
  id: string;
  type: 'pipe';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface DottedLineElement {
  id: string;
  type: 'dottedLine';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  rotation: number;
}

type Element = PipeElement | DottedLineElement;

interface DragHandle {
  x: number;
  y: number;
}

interface RotateHandle {
  x: number;
  y: number;
  initialAngle?: number;
  centerX?: number;
  centerY?: number;
  lastRotation?: number;
}

const DRAG_SENSITIVITY = 1; // Adjust this value to control drag sensitivity (lower = less sensitive)

const CanvasDrawingAppSketch: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('pipe');
  const [drawingStart, setDrawingStart] = useState<Point | null>(null);
  const [currentPath, setCurrentPath] = useState<SkPath | null>(null);
  const canvasRef = useCanvasRef();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [dragHandle, setDragHandle] = useState<DragHandle | null>(null);
  const [rotateHandle, setRotateHandle] = useState<RotateHandle | null>(null);
  const [dragOffset, setDragOffset] = useState<Point | null>(null);

  const findElementAt = useCallback((x: number, y: number): Element | null => {
    // Reverse the array to check from top to bottom
    for (const element of [...elements].reverse()) {
      if (element.type === 'pipe') {
        // For pipes, consider rotation
        const center = { x: element.x, y: element.y };
        const rotatedPoint = rotatePoint(x, y, center.x, center.y, -element.rotation);
        
        const halfWidth = element.width / 2;
        const halfHeight = element.height / 2;
        
        if (rotatedPoint.x >= element.x - halfWidth && 
            rotatedPoint.x <= element.x + halfWidth &&
            rotatedPoint.y >= element.y - halfHeight && 
            rotatedPoint.y <= element.y + halfHeight) {
          return element;
        }
      } else {
        // For dotted lines, consider rotation
        const center = {
          x: (element.x1 + element.x2) / 2,
          y: (element.y1 + element.y2) / 2
        };
        const rotatedPoint = rotatePoint(x, y, center.x, center.y, -element.rotation);
        
        const dx = element.x2 - element.x1;
        const dy = element.y2 - element.y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length === 0) continue;
        
        const t = ((rotatedPoint.x - element.x1) * dx + (rotatedPoint.y - element.y1) * dy) / (length * length);
        if (t < 0 || t > 1) continue;
        
        const nearestX = element.x1 + t * dx;
        const nearestY = element.y1 + t * dy;
        const dist = Math.sqrt((rotatedPoint.x - nearestX) ** 2 + (rotatedPoint.y - nearestY) ** 2);
        
        if (dist <= 20) {
          return element;
        }
      }
    }
    return null;
  }, [elements]);

  const rotatePoint = (x: number, y: number, cx: number, cy: number, angle: number) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
    const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return { x: nx, y: ny };
  };

  useEffect(() => {
    if (selectedElement && isEditMode) {
      if (selectedElement.type === 'pipe') {
        setDragHandle({
          x: selectedElement.x,
          y: selectedElement.y - selectedElement.height/2 - 20
        });
        setRotateHandle({
          x: selectedElement.x + selectedElement.width/2 + 20,
          y: selectedElement.y
        });
      } else {
        const centerX = (selectedElement.x1 + selectedElement.x2) / 2;
        const centerY = (selectedElement.y1 + selectedElement.y2) / 2;
        const dx = selectedElement.x2 - selectedElement.x1;
        const dy = selectedElement.y2 - selectedElement.y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        const normalizedDx = dx / length;
        const normalizedDy = dy / length;
        
        setDragHandle({
          x: centerX - normalizedDy * 20,
          y: centerY + normalizedDx * 20
        });
        setRotateHandle({
          x: selectedElement.x2 + normalizedDx * 20,
          y: selectedElement.y2 + normalizedDy * 20
        });
      }
    } else {
      setDragHandle(null);
      setRotateHandle(null);
    }
  }, [selectedElement, isEditMode]);

  const handleGestureStart = useCallback((x: number, y: number) => {
    try {
      if (dragHandle && isNearPoint(x, y, dragHandle.x, dragHandle.y, 20)) {
        if (selectedElement) {
          if (selectedElement.type === 'pipe') {
            setDragOffset({
              x: x - selectedElement.x,
              y: y - selectedElement.y
            });
          } else {
            const centerX = (selectedElement.x1 + selectedElement.x2) / 2;
            const centerY = (selectedElement.y1 + selectedElement.y2) / 2;
            setDragOffset({
              x: x - centerX,
              y: y - centerY
            });
          }
        }
        setIsDragging(true);
        return;
      }
      if (rotateHandle && isNearPoint(x, y, rotateHandle.x, rotateHandle.y, 20)) {
        setIsRotating(true);
        return;
      }

      const element = findElementAt(x, y);
      setSelectedElement(element);
      if (!element) {
        setDrawingStart({ x, y });
      }
    } catch (error) {
      console.error('Gesture start error:', error);
    }
  }, [findElementAt, dragHandle, rotateHandle, selectedElement]);

  const isNearPoint = (x1: number, y1: number, x2: number, y2: number, threshold: number) => {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy) <= threshold;
  };

  const handleGestureUpdate = useCallback((absoluteX: number, absoluteY: number, translationX: number, translationY: number) => {
    try {
      if (selectedElement && isDragging && dragOffset) {
        if (selectedElement.type === 'pipe') {
          setElements(prev => prev.map(el => {
            if (el.id === selectedElement.id && el.type === 'pipe') {
              const newX = absoluteX - dragOffset.x;
              const newY = absoluteY - dragOffset.y;
              
              setDragHandle({
                x: newX,
                y: newY - el.height/2 - 20
              });
              
              setRotateHandle({
                x: newX + el.width/2 + 20,
                y: newY
              });

              return {
                ...el,
                x: newX,
                y: newY
              };
            }
            return el;
          }));
        } else {
          setElements(prev => prev.map(el => {
            if (el.id === selectedElement.id && el.type === 'dottedLine') {
              const centerX = absoluteX - dragOffset.x;
              const centerY = absoluteY - dragOffset.y;
              
              const dx = (el.x2 - el.x1) / 2;
              const dy = (el.y2 - el.y1) / 2;
              
              const newX1 = centerX - dx;
              const newY1 = centerY - dy;
              const newX2 = centerX + dx;
              const newY2 = centerY + dy;

              const length = Math.sqrt(dx * dx + dy * dy);
              const normalizedDx = dx / length;
              const normalizedDy = dy / length;

              setDragHandle({
                x: centerX - normalizedDy * 20,
                y: centerY + normalizedDx * 20
              });

              setRotateHandle({
                x: newX2 + normalizedDx * 20,
                y: newY2 + normalizedDy * 20
              });

              return {
                ...el,
                x1: newX1,
                y1: newY1,
                x2: newX2,
                y2: newY2
              };
            }
            return el;
          }));
        }
      } else if (!isEditMode && drawingStart) {
        const path = Skia.Path.Make();
        const currentX = drawingStart.x + translationX;
        const currentY = drawingStart.y + translationY;

        if (drawingMode === 'pipe') {
          const x = Math.min(drawingStart.x, currentX);
          const y = Math.min(drawingStart.y, currentY);
          const width = Math.abs(currentX - drawingStart.x);
          const height = 20;

          if (width > 0 && height > 0) {
            path.addRect({ x, y, width, height });
            setCurrentPath(path);
          }
        } else {
          path.moveTo(drawingStart.x, drawingStart.y);
          path.lineTo(currentX, currentY);
          const dashedPath = path.copy();
          dashedPath.dash(10, 5, 0);
          setCurrentPath(dashedPath);
        }
      }
    } catch (error) {
      console.error('Gesture update error:', error);
    }
  }, [selectedElement, isDragging, dragOffset, drawingStart, drawingMode, isEditMode]);

  const handleGestureEnd = useCallback((translationX: number, translationY: number) => {
    try {
      if (!isEditMode && drawingStart && currentPath) {
        const finalX = drawingStart.x + translationX;
        const finalY = drawingStart.y + translationY;

        if (drawingMode === 'pipe') {
          const bounds = currentPath.getBounds();
          if (bounds && bounds.width > 0 && bounds.height > 0) {
            const newElement: PipeElement = {
              id: Date.now().toString(),
              type: 'pipe',
              x: bounds.x + (bounds.width / 2),
              y: bounds.y + 10,
              width: bounds.width,
              height: 20,
              rotation: 0,
            };
            setElements(prevElements => [...prevElements, newElement]);
          }
        } else {
          const newElement: DottedLineElement = {
            id: Date.now().toString(),
            type: 'dottedLine',
            x1: drawingStart.x,
            y1: drawingStart.y,
            x2: finalX,
            y2: finalY,
            rotation: 0,
          };
          setElements(prevElements => [...prevElements, newElement]);
        }
      }

      setDrawingStart(null);
      setCurrentPath(null);
      
      if (!isEditMode) {
        setSelectedElement(null);
      }
    } catch (error) {
      console.error('Gesture end error:', error);
    }
  }, [isEditMode, drawingStart, currentPath, drawingMode]);

  useEffect(() => {
    if (elements.length > 0) {
      console.log('Elements updated:', elements);
    }
  }, [elements]);

  useEffect(() => {
    return () => {
      setElements([]);
      setSelectedElement(null);
      setDrawingStart(null);
      setCurrentPath(null);
      setIsEditMode(false);
      setIsDragging(false);
      setIsRotating(false);
    };
  }, []);

  const handleClear = useCallback(() => {
    setElements([]);
    setSelectedElement(null);
    setDrawingStart(null);
    setCurrentPath(null);
    setIsEditMode(false);
    setIsDragging(false);
    setIsRotating(false);
  }, []);

  const longPressGesture = Gesture.LongPress()
    .runOnJS(true)
    .minDuration(800)
    .onStart((e) => {
      try {
        if (!isEditMode) {
          const element = findElementAt(e.x || 0, e.y || 0);
          if (element) {
            setSelectedElement(element);
            setIsEditMode(true);
          }
        }
      } catch (error) {
        console.error('Long press gesture error:', error);
      }
    });

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onStart((e) => {
      const x = e.absoluteX || 0;
      const y = e.absoluteY || 0;
      
      if (isEditMode) {
        if (dragHandle && isNearPoint(x, y, dragHandle.x, dragHandle.y, 20)) {
          setIsDragging(true);
          if (selectedElement) {
            setDragOffset({
              x: x,
              y: y,
              elementX: selectedElement.type === 'pipe' ? selectedElement.x : 
                (selectedElement.x1 + selectedElement.x2) / 2,
              elementY: selectedElement.type === 'pipe' ? selectedElement.y : 
                (selectedElement.y1 + selectedElement.y2) / 2
            });
          }
        }
      } else {
        setDrawingStart({ x, y });
      }
    })
    .onUpdate((e) => {
      if (isEditMode && isDragging && selectedElement && dragOffset) {
        const deltaX = (e.absoluteX || 0) - dragOffset.x;
        const deltaY = (e.absoluteY || 0) - dragOffset.y;
        
        const newX = (dragOffset.elementX || 0) + deltaX;
        const newY = (dragOffset.elementY || 0) + deltaY;
        
        setElements(prev => prev.map(el => {
          if (el.id === selectedElement.id) {
            if (el.type === 'pipe') {
              return {
                ...el,
                x: newX,
                y: newY
              };
            } else {
              const dx = (el.x2 - el.x1) / 2;
              const dy = (el.y2 - el.y1) / 2;
              return {
                ...el,
                x1: newX - dx,
                y1: newY - dy,
                x2: newX + dx,
                y2: newY + dy
              };
            }
          }
          return el;
        }));

        // Update handles after element position update
        if (selectedElement.type === 'pipe') {
          setDragHandle({
            x: newX,
            y: newY - selectedElement.height/2 - 20
          });
          setRotateHandle({
            x: newX + selectedElement.width/2 + 20,
            y: newY
          });
        } else {
          const dx = selectedElement.x2 - selectedElement.x1;
          const dy = selectedElement.y2 - selectedElement.y1;
          const length = Math.sqrt(dx * dx + dy * dy);
          const normalizedDx = dx / length;
          const normalizedDy = dy / length;
          
          setDragHandle({
            x: newX - normalizedDy * 20,
            y: newY + normalizedDx * 20
          });
          setRotateHandle({
            x: newX + dx/2 + normalizedDx * 20,
            y: newY + dy/2 + normalizedDy * 20
          });
        }
      } else if (!isEditMode && drawingStart) {
        updateDrawingPath(e.translationX || 0, e.translationY || 0);
      }
    })
    .onEnd((e) => {
      if (!isEditMode && drawingStart) {
        finalizeDrawing(e.translationX || 0, e.translationY || 0);
      }
      setIsDragging(false);
      setDragOffset(null);
    });

  const rotateGesture = Gesture.Rotation()
    .runOnJS(true)
    .enabled(isEditMode)
    .onUpdate((e) => {
      if (selectedElement) {
        setElements(prev => prev.map(el => {
          if (el.id === selectedElement.id) {
            const newRotation = (el.rotation || 0) + e.rotation;
            
            // Update element rotation
            return {
              ...el,
              rotation: newRotation
            };
          }
          return el;
        }));

        // Update handle positions based on new rotation
        if (selectedElement.type === 'pipe') {
          const center = { x: selectedElement.x, y: selectedElement.y };
          setDragHandle(prev => prev ? {
            ...prev,
            x: center.x + 20 * Math.sin(selectedElement.rotation),
            y: center.y - selectedElement.height/2 - 20 * Math.cos(selectedElement.rotation)
          } : null);
        } else {
          const center = {
            x: (selectedElement.x1 + selectedElement.x2) / 2,
            y: (selectedElement.y1 + selectedElement.y2) / 2
          };
          
          setDragHandle(prev => prev ? {
            ...prev,
            x: center.x - 20 * Math.sin(selectedElement.rotation),
            y: center.y + 20 * Math.cos(selectedElement.rotation)
          } : null);
        }
      }
    });

  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .onEnd(() => {
      if (isEditMode) {
        setIsEditMode(false);
        setSelectedElement(null);
        setIsDragging(false);
        setIsRotating(false);
        setDrawingStart(null);
        setCurrentPath(null);
      }
    });

  const updateHandlePositions = useCallback((element: PipeElement | DottedLineElement, angle: number) => {
    if (element.type === 'pipe') {
      const radius = element.width / 2 + 20;
      const rotatedX = element.x + radius * Math.cos(angle);
      const rotatedY = element.y + radius * Math.sin(angle);

      // Update rotate handle
      setRotateHandle(prev => prev ? {
        ...prev,
        x: rotatedX,
        y: rotatedY,
        lastRotation: angle
      } : null);

      // Update drag handle - keep it above the pipe considering rotation
      const dragX = element.x + 20 * Math.sin(angle);
      const dragY = element.y - element.height/2 - 20 * Math.cos(angle);
      
      setDragHandle(prev => prev ? {
        ...prev,
        x: dragX,
        y: dragY
      } : null);
    } else {
      // For dotted lines, rotate handles around the center point
      const centerX = (element.x1 + element.x2) / 2;
      const centerY = (element.y1 + element.y2) / 2;
      
      // Calculate the line vector
      const dx = element.x2 - element.x1;
      const dy = element.y2 - element.y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate normalized direction vectors
      const normalizedDx = dx / length;
      const normalizedDy = dy / length;
      
      // Rotate the direction vectors
      const rotatedDx = normalizedDx * Math.cos(angle) - normalizedDy * Math.sin(angle);
      const rotatedDy = normalizedDx * Math.sin(angle) + normalizedDy * Math.cos(angle);
      
      // Update rotate handle - keep it at the end of the line
      const rotateX = centerX + (length/2) * rotatedDx + 20 * rotatedDx;
      const rotateY = centerY + (length/2) * rotatedDy + 20 * rotatedDy;
      
      setRotateHandle(prev => prev ? {
        ...prev,
        x: rotateX,
        y: rotateY,
        lastRotation: angle
      } : null);
      
      // Update drag handle - keep it perpendicular to the line
      const dragX = centerX - 20 * rotatedDy;
      const dragY = centerY + 20 * rotatedDx;
      
      setDragHandle(prev => prev ? {
        ...prev,
        x: dragX,
        y: dragY
      } : null);
    }
  }, []);

  const calculateDragOffset = (element: Element, x: number, y: number): Point => {
    if (element.type === 'pipe') {
      return {
        x: x - element.x,
        y: y - element.y
      };
    } else {
      const centerX = (element.x1 + element.x2) / 2;
      const centerY = (element.y1 + element.y2) / 2;
      return {
        x: x - centerX,
        y: y - centerY
      };
    }
  };

  const calculateElementCenter = (element: Element): Point => {
    if (element.type === 'pipe') {
      return { x: element.x, y: element.y };
    } else {
      return {
        x: (element.x1 + element.x2) / 2,
        y: (element.y1 + element.y2) / 2
      };
    }
  };

  const updateElementPosition = (element: Element, newX: number, newY: number, offset: Point) => {
    setElements(prev => prev.map(el => {
      if (el.id === element.id) {
        if (el.type === 'pipe') {
          const x = newX - offset.x;
          const y = newY - offset.y;
          updateHandlePositions({ ...el, x, y }, el.rotation);
          return { ...el, x, y };
        } else {
          const centerX = newX - offset.x;
          const centerY = newY - offset.y;
          const dx = (el.x2 - el.x1) / 2;
          const dy = (el.y2 - el.y1) / 2;
          const newElement = {
            ...el,
            x1: centerX - dx,
            y1: centerY - dy,
            x2: centerX + dx,
            y2: centerY + dy
          };
          updateHandlePositions(newElement, el.rotation);
          return newElement;
        }
      }
      return el;
    }));
  };

  const updateElementRotation = (element: Element, angle: number) => {
    setElements(prev => prev.map(el => {
      if (el.id === element.id) {
        const newElement = { ...el, rotation: angle };
        updateHandlePositions(newElement, angle);
        return newElement;
      }
      return el;
    }));
  };

  const updateDrawingPath = (translationX: number, translationY: number) => {
    if (!drawingStart) return;

    const path = Skia.Path.Make();
    const currentX = drawingStart.x + translationX;
    const currentY = drawingStart.y + translationY;

    if (drawingMode === 'pipe') {
      const x = Math.min(drawingStart.x, currentX);
      const y = Math.min(drawingStart.y, currentY);
      const width = Math.abs(currentX - drawingStart.x);
      const height = 20;

      if (width > 0 && height > 0) {
        path.addRect({ x, y, width, height });
        setCurrentPath(path);
      }
    } else {
      path.moveTo(drawingStart.x, drawingStart.y);
      path.lineTo(currentX, currentY);
      const dashedPath = path.copy();
      dashedPath.dash(10, 5, 0);
      setCurrentPath(dashedPath);
    }
  };

  const finalizeDrawing = useCallback((translationX: number, translationY: number) => {
    try {
      if (!drawingStart || !currentPath) return;

      const finalX = drawingStart.x + translationX;
      const finalY = drawingStart.y + translationY;

      if (drawingMode === 'pipe') {
        const bounds = currentPath.getBounds();
        if (bounds && bounds.width > 0 && bounds.height > 0) {
          const newElement: PipeElement = {
            id: Date.now().toString(),
            type: 'pipe',
            x: bounds.x + (bounds.width / 2),
            y: bounds.y + 10,
            width: bounds.width,
            height: 20,
            rotation: 0,
          };
          setElements(prevElements => [...prevElements, newElement]);
        }
      } else {
        // Only create dotted line if there's a meaningful distance
        const dx = finalX - drawingStart.x;
        const dy = finalY - drawingStart.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 10) { // Minimum distance threshold
          const newElement: DottedLineElement = {
            id: Date.now().toString(),
            type: 'dottedLine',
            x1: drawingStart.x,
            y1: drawingStart.y,
            x2: finalX,
            y2: finalY,
            rotation: 0,
          };
          setElements(prevElements => [...prevElements, newElement]);
        }
      }

      // Clear drawing state
      setDrawingStart(null);
      setCurrentPath(null);
      setSelectedElement(null);
    } catch (error) {
      console.error('Error finalizing drawing:', error);
    }
  }, [drawingStart, currentPath, drawingMode]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <GestureDetector 
          gesture={Gesture.Race(
            longPressGesture,
            Gesture.Simultaneous(
              panGesture,
              rotateGesture
            ),
            tapGesture
          )}
        >
          <Canvas style={styles.canvas} ref={canvasRef}>
            {elements.map((element) => {
              if (element.type === 'pipe') {
                return (
                  <Group
                    key={element.id}
                    transform={[
                      { translateX: element.x },
                      { translateY: element.y },
                      { rotate: element.rotation },
                      { translateX: -element.width / 2 },
                      { translateY: -element.height / 2 },
                    ]}
                  >
                    <Rect
                      x={0}
                      y={0}
                      width={element.width}
                      height={element.height}
                      color={selectedElement?.id === element.id ? "#4CAF50" : "#2f95dc"}
                    />
                  </Group>
                );
              } else {
                const dx = element.x2 - element.x1;
                const dy = element.y2 - element.y1;
                const center = vec(
                  (element.x1 + element.x2) / 2,
                  (element.y1 + element.y2) / 2
                );
                
                return (
                  <Group
                    key={element.id}
                    transform={[
                      { translateX: center.x },
                      { translateY: center.y },
                      { rotate: element.rotation },
                      { translateX: -dx/2 },
                      { translateY: -dy/2 },
                    ]}
                  >
                    <Path
                      path={(() => {
                        const path = Skia.Path.Make();
                        path.moveTo(0, 0);
                        path.lineTo(dx, dy);
                        path.dash(10, 5, 0);
                        return path;
                      })()}
                      color={selectedElement?.id === element.id ? "#4CAF50" : "#ff3b30"}
                      style="stroke"
                      strokeWidth={2}
                    />
                  </Group>
                );
              }
            })}
            {currentPath && !isEditMode && (
              <Path path={currentPath} color="#666" style="stroke" strokeWidth={2} />
            )}
            
            {isEditMode && dragHandle && (
              <Group>
                <Circle
                  cx={dragHandle.x}
                  cy={dragHandle.y}
                  r={15}
                  color="#4CAF50"
                />
                <Path
                  path={(() => {
                    const path = Skia.Path.Make();
                    path.moveTo(dragHandle.x - 8, dragHandle.y - 3);
                    path.lineTo(dragHandle.x + 8, dragHandle.y - 3);
                    path.moveTo(dragHandle.x - 8, dragHandle.y + 3);
                    path.lineTo(dragHandle.x + 8, dragHandle.y + 3);
                    return path;
                  })()}
                  color="white"
                  style="stroke"
                  strokeWidth={2.5}
                />
              </Group>
            )}
            
            {isEditMode && rotateHandle && (
              <Group>
                <Circle
                  cx={rotateHandle.x}
                  cy={rotateHandle.y}
                  r={15}
                  color="#4CAF50"
                />
                <Path
                  path={(() => {
                    const path = Skia.Path.Make();
                    const r = 8;
                    path.addCircle(rotateHandle.x, rotateHandle.y, r);
                    path.moveTo(rotateHandle.x + r, rotateHandle.y);
                    path.lineTo(rotateHandle.x + r + 6, rotateHandle.y - 6);
                    return path;
                  })()}
                  color="white"
                  style="stroke"
                  strokeWidth={2.5}
                />
              </Group>
            )}
          </Canvas>
        </GestureDetector>
        
        <View style={styles.controls}>
          {isEditMode ? (
            <Button
              title="Exit Edit Mode"
              onPress={() => {
                setIsEditMode(false);
                setSelectedElement(null);
                setIsDragging(false);
                setIsRotating(false);
              }}
              color="#ff3b30"
            />
          ) : (
            <>
              <Button
                title="Pipe"
                onPress={() => setDrawingMode('pipe')}
                color={drawingMode === 'pipe' ? '#2f95dc' : undefined}
              />
              <Button
                title="Dotted Line"
                onPress={() => setDrawingMode('dottedLine')}
                color={drawingMode === 'dottedLine' ? '#ff3b30' : undefined}
              />
              <Button
                title="Clear"
                onPress={handleClear}
                color="#34c759"
              />
            </>
          )}
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  canvas: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
});

export default CanvasDrawingAppSketch;

