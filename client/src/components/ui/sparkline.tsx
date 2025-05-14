import React from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  fillOpacity?: number;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 80,
  height = 24,
  color = 'currentColor',
  strokeWidth = 1.5,
  fillOpacity = 0.2,
  className = '',
}) => {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // Prevent division by zero

  // Create path data
  const pathData = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');

  // Create area fill path (close the path to the bottom)
  const areaPath = `${pathData} L ${width},${height} L 0,${height} Z`;

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d={areaPath}
        fill={color}
        fillOpacity={fillOpacity}
      />
      <path
        d={pathData}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export default Sparkline;