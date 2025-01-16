import React, { useEffect, useState, useRef } from 'react';
import { TextInput } from 'react-native';
import { View, StyleSheet, GestureResponderEvent, Alert, useWindowDimensions, TouchableOpacity, Text } from 'react-native';
import { Svg, Path, Text as SvgText } from 'react-native-svg';
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

  return (
    <View style={styles.container}>
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
            
            {paths.map((pathWithLabel, index) => {
              const match = pathWithLabel.path.match(/M([\d.]+),([\d.]+) L([\d.]+),([\d.]+)/);
              let midX = 0, midY = 0;
              if (match) {
                const [, startX, startY, endX, endY] = match.map(Number);
                midX = (startX + endX) / 2;
                midY = (startY + endY) / 2;
              }

              return (
                <React.Fragment key={`path-${index}`}>
                  <Path
                    d={pathWithLabel.path}
                    stroke="red"
                    fill="none"
                    strokeWidth={3}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  <SvgText
                    x={midX - 10}
                    y={midY - 10}
                    fontSize="12"
                    fill="black"
                    textAnchor="middle"
                    fontWeight='bold'
                  >
                    {pathWithLabel.label}
                  </SvgText>
                </React.Fragment>
              );
            })}

            {currentPath && (
              <Path
                d={currentPath}
                stroke="blue"
                fill="none"
                strokeWidth={3}
                strokeLinejoin="round"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
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
}); 


function saveCanvasData() {
  throw new Error('Function not implemented.');
}

