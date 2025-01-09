import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { View, StyleSheet, GestureResponderEvent, Alert, useWindowDimensions } from 'react-native';
import { Svg, Path, Text as SvgText } from 'react-native-svg';
// import { lockLandscapeOrientation, preventOrientationChange } from '@/app/config/orientation';
import { PathWithLabel, PathType, Label } from '@/app/types/drawing';
import { DrawingControls } from './DrawingControls';
import { Ruler } from './Ruler';

export default function CanvasDrawingApp() {
  const { width, height } = useWindowDimensions();
  const [paths, setPaths] = useState<PathWithLabel[]>([]);
  const [currentPath, setCurrentPath] = useState<PathType>('');
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [isFreeForm, setIsFreeForm] = useState(false);
  const [labels, setLabels] = useState<Label[]>([]);
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [isEditingLabel, setIsEditingLabel] = useState(false);

  const CLOSE_THRESHOLD = 20;

  // useEffect(() => {
  //   lockLandscapeOrientation();
  //   const cleanup = preventOrientationChange();
  //   return cleanup;
  // }, []);

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

  const onTouchEnd = () => {
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
  };

  const handleRemoveLabelClick = () => {
    setLabels((prevLabels) => prevLabels.slice(0, -1));
  };
  

  const handleClearButtonClick = () => {
    setPaths([]);
    setCurrentPath('');
    setStartPoint(null);
    setLabels([]);
    setIsAddingLabel(false);
    setIsEditingLabel(false);

  };

  const handleEraserClick = () => {
    setPaths((prevPaths) => prevPaths.slice(0, -1));
    setIsAddingLabel(false);
    setIsEditingLabel(false);
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

      <DrawingControls
        onAddLabel={() => setIsAddingLabel(true)}
        onEraser={handleEraserClick}
        onFreeForm={handleFreeFormClick}
        onLineStraight={handleLineStraightClick}
        onClear={handleClearButtonClick}
        onRemoveLabel={handleRemoveLabelClick}
      />
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
}); 

