//@flow

// Material Design 500
const COLORS: Array<string> = [
  "#2196F3", // Blue
  "#03A9F4", // Light Blue
  "#00BCD4", // Cyan
  "#009688", // Teal
  "#4CAF50", // Green
  "#8BC34A", // Light Green
  "#CDDC39", // Lime
  "#FFEB3B", // Yellow
  "#FFC107", // Amber
  "#FFB74D", // Orange
  "#FF5722", // Deep Orange
  "#F44336", // Red
  "#E91E63", // Pink
  "#9C27B0", // Purple
  "#673AB7", // Deep Purple
  "#3F51B5" // Indigo
];

export function getColorByIndex(index: number): string {
  return COLORS[((index % COLORS.length) + COLORS.length) % COLORS.length];
}
