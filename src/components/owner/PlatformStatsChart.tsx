import React, { useState } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

interface PlatformStatsChartProps {
  customData?: Array<{ date: string; orders: number; revenue: number }>;
}

export const PlatformStatsChart: React.FC<PlatformStatsChartProps> = ({ customData }) => {
  const [timeRange, setTimeRange] = useState('Last 7 days');

  if (customData && customData.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs text-center space-y-3 py-16">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-800 text-base">No Order Analytics Yet</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Revenue curves and order volume trends will automatically render here as orders are placed across the platform.
        </p>
      </div>
    );
  }

  // Dynamic or default 7-day data points matching Project.png Screen 7 (Apr 18 - Apr 24)
  const defaultData = [
    { date: 'Apr 18', orders: 42, revenue: 11200 },
    { date: 'Apr 19', orders: 68, revenue: 15400 },
    { date: 'Apr 20', orders: 55, revenue: 13800 },
    { date: 'Apr 21', orders: 90, revenue: 21500 },
    { date: 'Apr 22', orders: 74, revenue: 18200 },
    { date: 'Apr 23', orders: 110, revenue: 26800 },
    { date: 'Apr 24', orders: 135, revenue: 32400 },
  ];

  const data = customData && customData.length >= 2 ? customData : defaultData;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG dimensions
  const width = 800;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const highestRevenue = Math.max(...data.map(d => d.revenue), 1000);
  const highestOrders = Math.max(...data.map(d => d.orders), 10);
  const maxRevenue = Math.ceil(highestRevenue * 1.15);
  const maxOrders = Math.ceil(highestOrders * 1.2);

  const pointsRevenue = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (d.revenue / maxRevenue) * (height - 2 * paddingY);
    return { x, y, ...d };
  });

  const pointsOrders = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (d.orders / maxOrders) * (height - 2 * paddingY);
    return { x, y, ...d };
  });

  // Create smooth SVG cubic path
  const createSmoothPath = (pts: Array<{ x: number; y: number }>) => {
    if (pts.length === 0) return '';
    return pts.reduce((acc, point, i, arr) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const prev = arr[i - 1];
      const cx = (prev.x + point.x) / 2;
      return `${acc} C ${cx},${prev.y} ${cx},${point.y} ${point.x},${point.y}`;
    }, '');
  };

  const revenuePath = createSmoothPath(pointsRevenue);
  const ordersPath = createSmoothPath(pointsOrders);

  const revenueArea = `${revenuePath} L ${width - paddingX},${height - paddingY} L ${paddingX},${height - paddingY} Z`;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
      
      {/* Header Bar matching Project.png Screen 7 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
            Platform Statistics
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Gross B2B restocking volume and daily transaction trends
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          {/* Legend */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
              Orders
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
              Revenue
            </span>
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{timeRange}</span>
          </div>
        </div>
      </div>

      {/* SVG Dual Wave Curve matching Project.png Screen 7 */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56 sm:h-64"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio, i) => {
            const y = paddingY + ratio * (height - 2 * paddingY);
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#f1f5f9"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Revenue Fill Area */}
          <path d={revenueArea} fill="url(#revenueGrad)" />

          {/* Revenue Smooth Curve (Teal) */}
          <path
            d={revenuePath}
            fill="none"
            stroke="#0d9488"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Orders Smooth Curve (Cyan) */}
          <path
            d={ordersPath}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.5"
            strokeDasharray="5 5"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {pointsRevenue.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIndex === i ? 6 : 4}
                className="fill-teal-600 stroke-white stroke-2 cursor-pointer transition-all"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              <circle
                cx={pointsOrders[i].x}
                cy={pointsOrders[i].y}
                r={hoveredIndex === i ? 5 : 3.5}
                className="fill-cyan-500 stroke-white stroke-2 cursor-pointer transition-all"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </g>
          ))}
        </svg>

        {/* X-Axis Date Labels matching Screen 7 */}
        <div className="flex justify-between px-6 -mt-2 text-[11px] font-semibold text-slate-400">
          {data.map((d) => (
            <span key={d.date}>{d.date}</span>
          ))}
        </div>

        {/* Hover Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute top-2 bg-slate-900 text-white text-xs rounded-xl p-2.5 shadow-xl pointer-events-none transform -translate-x-1/2 space-y-1 transition-all"
            style={{
              left: `${(hoveredIndex / (data.length - 1)) * 90 + 5}%`,
            }}
          >
            <p className="font-bold text-slate-300 border-b border-slate-700 pb-1">
              {data[hoveredIndex].date}, 2025
            </p>
            <p className="text-teal-400 font-extrabold">
              Revenue: ৳{data[hoveredIndex].revenue.toLocaleString()}
            </p>
            <p className="text-cyan-300">
              Orders: {data[hoveredIndex].orders} placed
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

