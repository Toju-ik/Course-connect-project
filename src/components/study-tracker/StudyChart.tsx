
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, startOfWeek, addDays } from 'date-fns';

interface StudySession {
  id: string;
  module_id: string | null;
  duration: number;
  date: string;
}

interface Module {
  id: string;
  module_code: string;
  module_title: string;
}

interface StudyChartProps {
  sessions: StudySession[];
  modules: Module[];
}

interface ChartData {
  date: string;
  displayDate: string;
  total: number;
  [key: string]: any;
}

const StudyChart: React.FC<StudyChartProps> = ({ sessions, modules }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [moduleColors, setModuleColors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Generate a color for each module
    const colors: Record<string, string> = {
      'default': '#3B82F6', // Primary color for general study
    };
    
    modules.forEach((module, index) => {
      // Generate a variety of colors
      const colorOptions = [
        '#10B981', // Green
        '#8B5CF6', // Purple
        '#F59E0B', // Amber
        '#EC4899', // Pink
        '#0EA5E9', // Sky
        '#F43F5E', // Rose
        '#14B8A6', // Teal
        '#6366F1', // Indigo
      ];
      
      colors[module.id] = colorOptions[index % colorOptions.length];
    });
    
    setModuleColors(colors);
    
    // Prepare data for the chart
    const today = new Date();
    const lastWeekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start from Monday
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(lastWeekStart, i);
      return {
        date: format(date, 'yyyy-MM-dd'),
        displayDate: format(date, 'EEE'),
        total: 0,
      };
    });
    
    // Aggregate session data by date and module
    sessions.forEach(session => {
      const dayIndex = last7Days.findIndex(day => day.date === session.date);
      if (dayIndex !== -1) {
        // Add to total minutes
        last7Days[dayIndex].total += session.duration;
        
        // Add module-specific duration
        const moduleKey = session.module_id || 'default';
        if (!last7Days[dayIndex][moduleKey]) {
          last7Days[dayIndex][moduleKey] = 0;
        }
        last7Days[dayIndex][moduleKey] += session.duration;
      }
    });
    
    setChartData(last7Days);
  }, [sessions, modules]);
  
  const getModuleName = (moduleId: string) => {
    if (moduleId === 'default') return 'General Study';
    const module = modules.find(m => m.id === moduleId);
    return module ? module.module_code : 'Unknown';
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded border border-gray-200">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center mt-1 text-sm">
              <div 
                className="w-3 h-3 mr-2 rounded-full" 
                style={{ backgroundColor: entry.fill }}
              />
              <span>{getModuleName(entry.dataKey)}: </span>
              <span className="ml-1 font-medium">{entry.value} min</span>
            </div>
          ))}
          <p className="mt-2 text-sm font-medium border-t pt-1">
            Total: {payload.reduce((sum: number, entry: any) => sum + entry.value, 0)} min
          </p>
        </div>
      );
    }
    return null;
  };
  
  const allModuleIds = ['default', ...modules.map(m => m.id)];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium mb-4">Weekly Study Activity</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <XAxis dataKey="displayDate" />
            <YAxis unit="m" />
            <Tooltip content={<CustomTooltip />} />
            {allModuleIds.map(moduleId => (
              sessions.some(s => (s.module_id || 'default') === moduleId) && (
                <Bar 
                  key={moduleId}
                  dataKey={moduleId}
                  stackId="a" 
                  fill={moduleColors[moduleId] || '#3B82F6'}
                />
              )
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {allModuleIds.map(moduleId => (
          sessions.some(s => (s.module_id || 'default') === moduleId) && (
            <div key={moduleId} className="flex items-center text-sm">
              <div 
                className="w-3 h-3 mr-2 rounded-full" 
                style={{ backgroundColor: moduleColors[moduleId] }}
              />
              <span className="truncate">{getModuleName(moduleId)}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default StudyChart;
