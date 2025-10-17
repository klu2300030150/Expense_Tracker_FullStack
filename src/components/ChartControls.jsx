import React from 'react';

export function ChartControls({ 
  timeRange, 
  onTimeRangeChange,
  onExport,
  chartType,
  onChartTypeChange
}) {
  return (
    <div className="chart-controls">
      <div className="control-group">
        <label>Time Range:</label>
        <select 
          value={timeRange} 
          onChange={(e) => onTimeRangeChange(e.target.value)}
          className="select-control"
        >
          <option value="3">Last 3 months</option>
          <option value="6">Last 6 months</option>
          <option value="12">Last 12 months</option>
          <option value="24">Last 2 years</option>
        </select>
      </div>

      <div className="control-group">
        <label>Chart Type:</label>
        <select 
          value={chartType} 
          onChange={(e) => onChartTypeChange(e.target.value)}
          className="select-control"
        >
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="area">Area Chart</option>
        </select>
      </div>

      <button 
        onClick={onExport}
        className="export-button"
      >
        Export Chart
      </button>
    </div>
  );
}