import React from 'react';
import { Line, Text as SvgText } from 'react-native-svg';

type RulerProps = {
  width: number;
  height: number;
};

export const Ruler: React.FC<RulerProps> = ({ width, height }) => {
  return (
    <>
      {/* Horizontal Ruler */}
      {[...Array(Math.floor(width / 3.78))].map((_, index) => {
        const x = index * 3.78;
        const isMajorLine = index % 10 === 0;
        return (
          <React.Fragment key={`top-ruler-${index}`}>
            <Line
              x1={x}
              y1={0}
              x2={x}
              y2={isMajorLine ? 10 : 5}
              stroke="black"
              strokeWidth={1}
            />
            {isMajorLine && (
              <SvgText x={x + 2} y={20} fontSize="8" fill="black">
                {index / 10} cm
              </SvgText>
            )}
          </React.Fragment>
        );
      })}

      {/* Vertical Ruler */}
      {[...Array(Math.floor(height / 3.78))].map((_, index) => {
        const y = index * 3.78;
        const isMajorLine = index % 10 === 0;
        return (
          <React.Fragment key={`left-ruler-${index}`}>
            <Line
              x1={0}
              y1={y}
              x2={isMajorLine ? 10 : 5}
              y2={y}
              stroke="black"
              strokeWidth={1}
            />
            {isMajorLine && (
              <SvgText x={15} y={y + 4} fontSize="8" fill="black">
                {index / 10} cm
              </SvgText>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}; 