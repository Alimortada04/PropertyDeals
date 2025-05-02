import React from "react";

// Mock chart components for demonstration purposes
// In a real application, you would use a proper chart library like Recharts

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface ChartProps {
  data: ChartData[];
  height?: number;
  width?: number;
}

// Bar Chart component
export function BarChart({ data, height = 200, width = "100%" }: ChartProps) {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div style={{ height, width }} className="flex items-end justify-around">
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * (height - 30);
        return (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="w-12 bg-[#09261E] hover:bg-[#135341] rounded-t-sm transition-colors"
              style={{ height: barHeight }}
            ></div>
            <div className="text-xs text-gray-500 mt-2 whitespace-nowrap overflow-hidden text-ellipsis w-16 text-center">
              {item.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Line Chart component
export function LineChart({ data, height = 200, width = "100%" }: ChartProps) {
  return (
    <div style={{ height, width }} className="relative">
      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
        Line Chart visualization would be displayed here
      </div>
      <svg width="100%" height="100%" viewBox={`0 0 100 ${height}`}>
        <path
          d="M10,80 L30,40 L50,60 L70,20 L90,50"
          fill="none"
          stroke="#09261E"
          strokeWidth="3"
        />
        {data.map((item, index) => (
          <circle 
            key={index} 
            cx={10 + (index * 20)} 
            cy={80 - (item.value / 2)} 
            r="4" 
            fill="#09261E" 
          />
        ))}
      </svg>
    </div>
  );
}

// Area Chart component
export function AreaChart({ data, height = 200, width = "100%" }: ChartProps) {
  return (
    <div style={{ height, width }} className="relative">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#09261E" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#09261E" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,80 L20,60 L40,70 L60,40 L80,30 L100,50 L100,100 L0,100 Z"
          fill="url(#gradient)"
        />
        <path
          d="M0,80 L20,60 L40,70 L60,40 L80,30 L100,50"
          fill="none"
          stroke="#09261E"
          strokeWidth="2"
        />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
        {data.map((item, index) => (
          <div key={index}>{item.name}</div>
        ))}
      </div>
    </div>
  );
}

// Pie Chart component
export function PieChartComponent({ data, height = 200, width = height }: ChartProps) {
  // Simple mock Pie Chart
  let cumulativePercent = 0;
  
  function slicePathD(percent: number, startPercent: number) {
    // SVG coordinates: 0,0 is top-left, 100,100 is bottom-right
    const radius = 50; // pie radius (out of viewBox 100x100)
    const center = { x: 50, y: 50 };
    
    // Convert percentage to radians (360 degrees = 2π radians)
    const startAngle = startPercent * 2 * Math.PI;
    const endAngle = (startPercent + percent) * 2 * Math.PI;
    
    // Calculate start and end points
    const startX = center.x + radius * Math.sin(startAngle);
    const startY = center.y - radius * Math.cos(startAngle);
    const endX = center.x + radius * Math.sin(endAngle);
    const endY = center.y - radius * Math.cos(endAngle);
    
    // Determine whether to use the large-arc-flag (more than 180 degrees?)
    const largeArcFlag = percent > 0.5 ? 1 : 0;
    
    // Create SVG arc path
    return [
      `M ${center.x},${center.y}`,
      `L ${startX},${startY}`,
      `A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY}`,
      'Z'
    ].join(' ');
  }
  
  return (
    <div style={{ height, width }} className="relative">
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        {data.map((item, index) => {
          const percent = item.value / 100;
          const path = slicePathD(percent, cumulativePercent);
          cumulativePercent += percent;
          return (
            <path
              key={index}
              d={path}
              fill={item.color || `hsl(${index * 45}, 70%, 50%)`}
            />
          );
        })}
        {/* Optional: add a smaller circle in the center for a donut chart */}
        <circle cx="50" cy="50" r="30" fill="white" />
      </svg>
    </div>
  );
}