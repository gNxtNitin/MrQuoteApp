import React, { useEffect, useState, useRef } from 'react';
import { TextInput } from 'react-native';
import { View, StyleSheet, GestureResponderEvent, Alert, useWindowDimensions, TouchableOpacity, Text, Modal } from 'react-native';
import { Svg, Path, Text as SvgText, Circle, G } from 'react-native-svg';
// import { lockLandscapeOrientation, preventOrientationChange } from '@/app/config/orientation';
import { PathWithLabel, PathType, Label } from '@/app/types/drawing';
import { DrawingControls } from './DrawingControls';
import { Ruler } from './Ruler';
import { useEstimateStore } from '@/app/stores/estimateStore';
import { useAuth } from '@/app/hooks/useAuth';
import { Canvas } from '@/app/database/models/Canvas';
import * as FileSystem from 'expo-file-system';
import ViewShot from 'react-native-view-shot';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { PanGestureHandler, PanGestureHandlerGestureEvent, State, GestureHandlerRootView } from 'react-native-gesture-handler';

export default function CanvasDrawingApp() {
  const { width, height } = useWindowDimensions();
  const [paths, setPaths] = useState<PathWithLabel[]>([]);
  const [currentPath, setCurrentPath] = useState<PathType>('');
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [isFreeForm, setIsFreeForm] = useState(false);
  const [labels, setLabels] = useState<Label[]>([]);
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const { user } = useAuth();
  const selectedPageId = useEstimateStore(state => state.selectedPageId);
  const canvasRef = useRef<ViewShot>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedElement, setSelectedElement] = useState<PathWithLabel | null>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout>();
  const [rotation, setRotation] = useState(0);
  const lastPointerPosition = useRef<{ x: number; y: number } | null>(null);
  const [activeDragHandle, setActiveDragHandle] = useState<'start' | 'end' | 'line' | 'rotate' | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [currentRotation, setCurrentRotation] = useState(0);

  const CLOSE_THRESHOLD = 20;

  // Load canvas data when component mounts or pageId changes
  useEffect(() => {
    if (selectedPageId && user?.id) {
      loadCanvasData();
    }
  }, [selectedPageId]);

  const loadCanvasData = async () => {
    try {
      if (!selectedPageId) return;
      
      const canvasData = await Canvas.getByPageId(selectedPageId);
      if (canvasData) {
        setPaths(JSON.parse(canvasData.paths));
        setCurrentPath(canvasData.current_path || '');
      }
    } catch (error) {
      console.error('Error loading canvas data:', error);
    }
  };

  const captureCanvas = async (): Promise<string | null> => {
    if (!canvasRef.current) return null;
    if (!canvasRef.current?.capture) return null; // Check if capture method is defined
    try {
      const uri = await canvasRef.current.capture();
      const fileName = `canvas_${Date.now()}.png`;
      const newPath = `${FileSystem.documentDirectory}canvasImages/${fileName}`;
      
      // Ensure directory exists
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}canvasImages/`,
        { intermediates: true }
      );
      
      // Move the captured image to our app's documents directory
      await FileSystem.moveAsync({
        from: uri,
        to: newPath
      });
      
      return newPath;
    } catch (error) {
      console.error('Error capturing canvas:', error);
      return null;
    }
  };

  const handleSave = async () => {
    try {
      if (!selectedPageId || !user?.id) {
        Alert.alert('Error', 'Missing required data for save operation');
        return;
      }

      setIsSaving(true);
      
      // Capture the canvas as an image
      const imagePath = await captureCanvas();
      
      const canvasData = await Canvas.getByPageId(selectedPageId);
      const now = new Date().toISOString();

      if (canvasData) {
        // Update existing canvas
        await Canvas.update(canvasData.id!, {
          paths: JSON.stringify(paths),
          current_path: currentPath,
          canvas_image_path: imagePath || undefined,
          modified_by: user.id,
          modified_date: now
        });
      } else {
        // Create new canvas
        await Canvas.insert({
          page_id: selectedPageId,
          paths: JSON.stringify(paths),
          current_path: currentPath,
          canvas_image_path: imagePath || undefined,
          created_by: user.id,
          created_date: now,
          is_active: true
        });
      }

      Alert.alert('Success', 'Canvas saved successfully');
    } catch (error) {
      console.error('Error saving canvas:', error);
      Alert.alert('Error', 'Failed to save canvas');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddLabelClick = () => {
    setIsAddingLabel(true);
  };

  const updateLabelText = (id: number, newText: string) => {
    setLabels((prevLabels) =>
      prevLabels.map((label) =>
        label.id === id ? { ...label, text: newText } : label
      )
    );
  };

  const findClosestEndpoint = (
    x: number,
    y: number
  ): { x: number; y: number } | null => {
    let closestPoint: { x: number; y: number } | null = null;
    let closestDistance = CLOSE_THRESHOLD;

    paths.forEach((pathWithLabel) => {
      // Extract the start (M) and end (L) points of the path
      const match = pathWithLabel.path.match(/M([\d.]+),([\d.]+) L([\d.]+),([\d.]+)/);
      if (match) {
        const [, startX, startY, endX, endY] = match.map(Number);

        // Check distance to start point
        const startDistance = calculateDistance(x, y, startX, startY);
        if (startDistance < closestDistance) {
          closestPoint = { x: startX, y: startY };
          closestDistance = startDistance;
        }

        // Check distance to end point
        const endDistance = calculateDistance(x, y, endX, endY);
        if (endDistance < closestDistance) {
          closestPoint = { x: endX, y: endY };
          closestDistance = endDistance;
        }
      }
    });

    return closestPoint;
  };

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const onTouchStart = (event: GestureResponderEvent) => {
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;
    
    if (isAddingLabel) {
      const { locationX, locationY } = event.nativeEvent;
      setLabels((prevLabels) => [
        ...prevLabels,
        { id: Date.now(), x: locationX, y: locationY, text: 'Edit me' },
      ]);
      setIsEditingLabel(true);
      setIsAddingLabel(false);
      return;
    }

    const closestEndpoint = findClosestEndpoint(locationX, locationY);
    if (closestEndpoint) {
      setStartPoint(closestEndpoint);
      setCurrentPath(`M${closestEndpoint.x},${closestEndpoint.y}`);
    } else {
      setStartPoint({ x: locationX, y: locationY });
      setCurrentPath(`M${locationX},${locationY}`);
    }
  };

  const onTouchMove = (event: GestureResponderEvent) => {
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;

    if (isEditingLabel) {
      return ;
    }

    setCurrentPath((prevPath) =>
      isFreeForm
        ? `${prevPath} L${locationX},${locationY}`
        : prevPath.replace(/ L[\d.]+,[\d.]+$/, '') + ` L${locationX},${locationY}`
    );
  };

  const onTouchEnd = async () => {
    if (currentPath) {
      const match = currentPath.match(/L([\d.]+),([\d.]+)$/); // Extract the end point of the current path
      if (match) {
        const [_, endX, endY] = match.map(Number);
        const middleX = (startPoint?.x || 0 + endX) / 2;
        const middleY = (startPoint?.y || 0 + endY) / 2;

        // Find the closest endpoint if within CLOSE_THRESHOLD
        const closestEndpoint = findClosestEndpoint(endX, endY);
        if (closestEndpoint) {
          // If found, connect to the closest endpoint by modifying the current path
          const newPath = isFreeForm ? currentPath : `M${startPoint?.x},${startPoint?.y} L${closestEndpoint.x},${closestEndpoint.y}`;

          if (isFreeForm) {
            const newPathWithLabel: PathWithLabel = {
              path: newPath,
              label: '',
            };
            setPaths((prevPaths) => [...prevPaths, newPathWithLabel]);

          }

          // Ask the user for input at the middle of the line
          !isFreeForm && Alert.prompt(
            'Enter something',
            'Please enter a label for the line',
            (text) => {
              // Store the connected path and label
              const newPathWithLabel: PathWithLabel = {
                path: newPath,
                label: text,
              };
              setPaths((prevPaths) => [...prevPaths, newPathWithLabel]);
            },
            'plain-text',
            ''
          );
        } else {
          if (isFreeForm) {
            const newPathWithLabel: PathWithLabel = {
              path: currentPath,
              label: '',
            };
            setPaths((prevPaths) => [...prevPaths, newPathWithLabel]);

          }
          // Otherwise, just add the current path as it is
          !isFreeForm && Alert.prompt(
            'Enter something',
            'Please enter a label for the line',
            (text) => {
              const newPathWithLabel: PathWithLabel = {
                path: currentPath,
                label: text,
              };
              setPaths((prevPaths) => [...prevPaths, newPathWithLabel]);
            },
            'plain-text',
            ''
          );
        }
      }
    }
    setCurrentPath('');
    saveCanvasData();
  };

  const handleRemoveLabelClick = () => {
    setLabels((prevLabels) => prevLabels.slice(0, -1));
  };
  
  const handleClearButtonClick = async () => {
    setPaths([]);
    setCurrentPath('');
    setStartPoint(null);
    setLabels([]);
    setIsAddingLabel(false);
    setIsEditingLabel(false);
    await saveCanvasData();
  };

  const handleEraserClick = async () => {
    setPaths((prevPaths) => prevPaths.slice(0, -1));
    setIsAddingLabel(false);
    setIsEditingLabel(false);
    await saveCanvasData();
  };

  const handleFreeFormClick = () => {
    setIsFreeForm(true);
    setIsAddingLabel(false);
    setIsEditingLabel(false);
  };

  const handleLineStraightClick = () => {
    setIsFreeForm(false);
    setIsAddingLabel(false);
    setIsEditingLabel(false);
  };

  const createPipePath = (startX: number, startY: number, endX: number, endY: number, offset: number = 10) => {
    // Calculate perpendicular offset for parallel lines
    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const normalizedDx = dx / length;
    const normalizedDy = dy / length;
    
    // Perpendicular vector with wider offset (10 instead of 5)
    const perpX = -normalizedDy * offset;
    const perpY = normalizedDx * offset;
    
    // Create path for filled pipe with rounded ends
    const pipePath = `
      M${startX + perpX},${startY + perpY}
      L${endX + perpX},${endY + perpY}
      A${offset},${offset} 0 0,1 ${endX - perpX},${endY - perpY}
      L${startX - perpX},${startY - perpY}
      A${offset},${offset} 0 0,1 ${startX + perpX},${startY + perpY}
      Z
    `;
    
    return pipePath;
  };

  const handleLongPress = (pathWithLabel: PathWithLabel, event: GestureResponderEvent) => {
    setSelectedElement(pathWithLabel);
    setShowActionMenu(true);
    setMenuPosition({
      x: event.nativeEvent.locationX,
      y: event.nativeEvent.locationY
    });
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setActiveDragHandle('line');
    setShowActionMenu(false);
  };

  const handleRotateStart = () => {
    setShowActionMenu(false);
    if (selectedElement) {
      const currentRotation = selectedElement.rotation || 0;
      setCurrentRotation(currentRotation);
    }
  };

  const handleRotate = (event: PanGestureHandlerGestureEvent) => {
    if (!selectedElement) return;

    const { translationX, translationY, state } = event.nativeEvent;
    
    if (state === State.BEGAN) {
      const currentRot = selectedElement.rotation || 0;
      setCurrentRotation(currentRot);
      return;
    }

    const pathMatch = selectedElement.path.match(/M([\d.]+),([\d.]+).*L([\d.]+),([\d.]+)/);
    if (!pathMatch) return;
    
    const [, startX, startY, endX, endY] = pathMatch.map(Number);
    const centerX = (Number(startX) + Number(endX)) / 2;
    const centerY = (Number(startY) + Number(endY)) / 2;

    // Calculate angle from center to current position
    const angle = Math.atan2(translationY, translationX) * (180 / Math.PI);
    const newRotation = angle;

    const newPaths = paths.map(el =>
      el === selectedElement
        ? { 
            ...el, 
            rotation: newRotation,
            transform: `rotate(${newRotation} ${centerX} ${centerY})`
          }
        : el
    );
    setPaths(newPaths);

    if (state === State.END) {
      setCurrentRotation(newRotation);
    }
  };

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    if (!selectedElement) return;

    const { translationX, translationY, absoluteX, absoluteY, state } = event.nativeEvent;
    
    if (state === State.BEGAN) {
      lastPointerPosition.current = { x: absoluteX, y: absoluteY };
      return;
    }

    if (!lastPointerPosition.current) return;

    const dx = absoluteX - lastPointerPosition.current.x;
    const dy = absoluteY - lastPointerPosition.current.y;
    
    const pathMatch = selectedElement.path.match(/M([\d.]+),([\d.]+).*L([\d.]+),([\d.]+)/);
    if (!pathMatch) return;
    
    const [, startX, startY, endX, endY] = pathMatch.map(Number);

    switch (activeDragHandle) {
      case 'rotate':
        // Handle rotation
        const centerX = (startX + endX) / 2;
        const centerY = (startY + endY) / 2;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const newPaths = paths.map(el =>
          el === selectedElement
            ? { 
                ...el,
                rotation: angle,
                transform: `rotate(${angle} ${centerX} ${centerY})`
              }
            : el
        );
        setPaths(newPaths);
        break;
      
      default:
        // Handle dragging
        const newPath = createPipePath(
          startX + dx,
          startY + dy,
          endX + dx,
          endY + dy,
          10
        );
        const draggedPaths = paths.map(el =>
          el === selectedElement
            ? { 
                ...el, 
                path: newPath,
                transform: el.transform
              }
            : el
        );
        setPaths(draggedPaths);
        break;
    }

    lastPointerPosition.current = { x: absoluteX, y: absoluteY };

    if (state === State.END) {
      lastPointerPosition.current = null;
    }
  };

  const renderPath = (pathWithLabel: PathWithLabel, index: number) => {
    const isSelected = pathWithLabel === selectedElement;
    const pathMatch = pathWithLabel.path.match(/M([\d.]+),([\d.]+).*L([\d.]+),([\d.]+)/);
    
    if (!pathMatch) return null;
    
    const [, startX, startY, endX, endY] = pathMatch.map(Number);
    const midX = (Number(startX) + Number(endX)) / 2;
    const midY = (Number(startY) + Number(endY)) / 2;

    return (
      <G key={`path-group-${index}`}>
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          minDist={5}
          maxPointers={1}
        >
          <Path
            d={pathWithLabel.path}
            fill={isSelected ? "#4a90e2" : "#666"}
            fillOpacity={0.5}
            stroke={isSelected ? "#4a90e2" : "#666"}
            strokeWidth={2}
            onPress={() => setSelectedElement(pathWithLabel)}
            transform={pathWithLabel.transform}
          />
        </PanGestureHandler>

        {/* Label */}
        <SvgText
          x={midX}
          y={midY - 10}
          fontSize="14"
          fill="black"
          textAnchor="middle"
          fontWeight="bold"
          transform={pathWithLabel.transform}
        >
          {pathWithLabel.label}
        </SvgText>

        {/* Rotation handle */}
        {isSelected && (
          <G transform={pathWithLabel.transform}>
            <PanGestureHandler onGestureEvent={handleRotate}>
              <G>
                <Circle
                  cx={endX + 20}
                  cy={endY}
                  r={12}
                  fill="#4a90e2"
                  fillOpacity={0.2}
                  onPress={() => setActiveDragHandle('rotate')}
                />
                <Path
                  d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"
                  fill="#4a90e2"
                  transform={`translate(${endX + 14},${endY - 6}) scale(0.6)`}
                />
              </G>
            </PanGestureHandler>
          </G>
        )}

        {/* Visual feedback for draggability */}
        {isSelected && (
          <G transform={pathWithLabel.transform}>
            <Circle
              cx={startX}
              cy={startY}
              r={6}
              fill="#4a90e2"
              fillOpacity={0.3}
            />
            <Circle
              cx={endX}
              cy={endY}
              r={6}
              fill="#4a90e2"
              fillOpacity={0.3}
            />
          </G>
        )}
      </G>
    );
  };

  const getElementAtPosition = (elements: PathWithLabel[], point: { x: number; y: number }) => {
    return elements.find(element => {
      const pathMatch = element.path.match(/M([\d.]+),([\d.]+) L([\d.]+),([\d.]+)/);
      if (!pathMatch) return false;

      const [, startX, startY, endX, endY] = pathMatch.map(Number);
      const distance = distanceToLine(point, { x: startX, y: startY }, { x: endX, y: endY });
      return distance < 10;
    });
  };

  const distanceToLine = (point: { x: number; y: number }, start: { x: number; y: number }, end: { x: number; y: number }) => {
    const a = { x: end.x - start.x, y: end.y - start.y };
    const b = { x: point.x - start.x, y: point.y - start.y };
    const len = Math.sqrt(a.x * a.x + a.y * a.y);
    const dot = a.x * b.x + a.y * b.y;
    const t = Math.max(0, Math.min(len, dot / len));
    const proj = {
      x: start.x + (t * a.x) / len,
      y: start.y + (t * a.y) / len,
    };
    return Math.sqrt(
      Math.pow(point.x - proj.x, 2) + Math.pow(point.y - proj.y, 2)
    );
  };

  const ActionMenu = () => (
    <Modal
      transparent
      visible={showActionMenu}
      onRequestClose={() => setShowActionMenu(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        onPress={() => setShowActionMenu(false)}
      >
        <View style={[
          styles.actionMenu,
          {
            left: menuPosition.x,
            top: menuPosition.y
          }
        ]}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleDragStart}
          >
            <Text style={styles.actionButtonText}>Drag</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleRotateStart}
          >
            <Text style={styles.actionButtonText}>Rotate</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <ViewShot ref={canvasRef} style={styles.svgContainer}>
        <View 
          style={[
            styles.svgContainer,
            {
              width: Math.max(width, height),
              height: Math.min(width, height) * 0.8,
            }
          ]} 
          onTouchStart={onTouchStart} 
          onTouchMove={onTouchMove} 
          onTouchEnd={onTouchEnd}
        >
          <Svg 
            height={Math.min(width, height) * 0.8} 
            width={Math.max(width, height)}
          >
            <Ruler 
              width={Math.max(width, height)} 
              height={Math.min(width, height) * 0.8} 
            />
            
            {paths.map((pathWithLabel, index) => renderPath(pathWithLabel, index))}

            {currentPath && (
              <Path
                d={currentPath}
                stroke="blue"
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
              />
            )}
          </Svg>

          {labels.map((label) => (
            <TextInput
              key={`input-${label.id}`}
              style={{
                position: 'absolute',
                left: label.x - 50,
                top: label.y - 15,
                backgroundColor: 'transparent',
                width: 100,
                height: 30,
              }}
              value={label.text}
              onChangeText={(text: string) => updateLabelText(label.id, text)}
            />
          ))}
        </View>
      </ViewShot>
      <ActionMenu />

      <View style={styles.controlsContainer}>
        <DrawingControls
          onAddLabel={() => setIsAddingLabel(true)}
          onEraser={handleEraserClick}
          onFreeForm={handleFreeFormClick}
          onLineStraight={handleLineStraightClick}
          onClear={handleClearButtonClick}
          onRemoveLabel={handleRemoveLabelClick}
        />
        <TouchableOpacity 
          style={[
            styles.saveButton,
            isSaving && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Canvas'}
          </Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'flex-start' 
  },
  svgContainer: { 
    borderColor: 'black', 
    backgroundColor: 'white', 
    borderWidth: 1 
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  actionMenu: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
  },
}); 

function saveCanvasData() {
  throw new Error('Function not implemented.');
}

