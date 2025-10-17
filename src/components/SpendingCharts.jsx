import React, { useState, useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Sector, LineChart, Line, AreaChart, Area
} from 'recharts';
import { ChartControls } from './ChartControls';
import { formatCurrency } from '../utils/format';
import html2canvas from 'html2canvas';

// Custom color themes
const THEMES = {
  default: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9FA0FF'],
  ocean: ['#005f73', '#0a9396', '#94d2bd', '#e9d8a6', '#ee9b00', '#ca6702', '#bb3e03'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc'],
  sunset: ['#ff7b00', '#ff8800', '#ff9500', '#ffa200', '#ffaa00', '#ffb700', '#ffc300'],
};

const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value
  } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={-20} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={10} textAnchor="middle" fill="#999">
        {formatCurrency(value)}
      </text>
      <text x={cx} y={cy} dy={30} textAnchor="middle" fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

export function SpendingCharts({ monthlyData = [], categoryData = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeRange, setTimeRange] = useState('6');
  const [chartType, setChartType] = useState('bar');
  const [colorTheme, setColorTheme] = useState('default');
  const chartRef = useRef(null);

  const colors = THEMES[colorTheme];
  const filteredMonthlyData = monthlyData.slice(-parseInt(timeRange));

  const handleExport = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'expense-chart.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const renderMonthlyChart = () => {
    const CommonProps = {
      data: filteredMonthlyData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...CommonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={formatCurrency} />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke={colors[0]} 
              strokeWidth={2}
              dot={{ fill: colors[0] }}
              animationDuration={1500}
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...CommonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={formatCurrency} />
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke={colors[0]} 
              fill="url(#colorAmount)"
              animationDuration={1500}
            />
          </AreaChart>
        );
      default:
        return (
          <BarChart {...CommonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={formatCurrency} />
            <Bar 
              dataKey="amount" 
              fill={colors[0]}
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          </BarChart>
        );
    }
  };

  return (
    <div className="spending-charts" ref={chartRef}>
      <div className="charts-header">
        <h2 className="text-xl font-semibold">Spending Analysis</h2>
        
        <div className="controls-wrapper">
          <ChartControls 
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            chartType={chartType}
            onChartTypeChange={setChartType}
            onExport={handleExport}
          />
          
          <select 
            value={colorTheme}
            onChange={(e) => setColorTheme(e.target.value)}
            className="theme-select"
          >
            <option value="default">Default Theme</option>
            <option value="ocean">Ocean Theme</option>
            <option value="forest">Forest Theme</option>
            <option value="sunset">Sunset Theme</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Chart */}
        <div className="chart-card">
          <h3 className="text-lg font-medium mb-4">Monthly Spending Trend</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              {renderMonthlyChart()}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="chart-card">
          <h3 className="text-lg font-medium mb-4">Category Distribution</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  animationDuration={1500}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={index}
                      fill={entry.color || colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}