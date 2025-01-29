import { Point } from "react-native-svg/lib/typescript/elements/Shape";

export type PathType = string;

export interface PathWithLabel {
  path: PathType;
  label: string;
  isDragging?: boolean;
  rotation?: number;
  width?: number;
  offset?: number;
  transform?: string;
}

export type Label = {
  id: number;
  x: number;
  y: number;
  text: string;
};

// We can remove DrawingElement since we're using PathWithLabel
// export interface DrawingElement {
//   type: 'line' | 'pipe';
//   points: Point[];
//   color: string;
//   width: number;
//   isDragging?: boolean;
//   rotation?: number;
// } 