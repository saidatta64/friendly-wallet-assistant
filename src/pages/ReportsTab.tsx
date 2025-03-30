
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ReportsTab: React.FC = () => {
  const { users, totalToGet, totalToGive } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data for overview pie chart
  const overviewData = [
    { name: 'To Get', value: totalToGet },
    { name: 'To Give', value: totalToGive },
  ].filter(item => item.value > 0); // Only include non-zero values
  
  // Data for detailed pie charts
  const toGetData = users
    .filter(user => user.balance > 0)
    .map(user => ({
      name: user.name,
      value: user.balance,
    }));
  
  const toGiveData = users
    .filter(user => user.balance < 0)
    .map(user => ({
      name: user.name,
      value: Math.abs(user.balance),
    }));
  
  // Colors for the charts
  const COLORS = ['#3b82f6', '#f87171', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];
  
  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">₹{payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="pb-20">
      <h1 className="text-2xl font-bold mb-4">Financial Summary</h1>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Balance Overview</CardTitle>
          <CardDescription>Summary of money to get and give</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">To Get</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{totalToGet.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">To Give</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹{totalToGive.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="h-64">
            {overviewData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={overviewData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {overviewData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#f87171'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No data to display
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Detailed Analysis</CardTitle>
          <CardDescription>Breakdown by contact</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="toGet">To Get</TabsTrigger>
              <TabsTrigger value="toGive">To Give</TabsTrigger>
            </TabsList>
            
            <TabsContent value="toGet" className="mt-4">
              <div className="h-64">
                {toGetData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={toGetData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {toGetData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    No money to get
                  </div>
                )}
              </div>
              
              {/* Legend for To Get */}
              {toGetData.length > 0 && (
                <div className="mt-4 grid grid-cols-1 gap-2">
                  {toGetData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                      <div 
                        className="w-3 h-3 mr-2" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                      />
                      <span className="text-sm">{entry.name}: ₹{entry.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="toGive" className="mt-4">
              <div className="h-64">
                {toGiveData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={toGiveData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {toGiveData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    No money to give
                  </div>
                )}
              </div>
              
              {/* Legend for To Give */}
              {toGiveData.length > 0 && (
                <div className="mt-4 grid grid-cols-1 gap-2">
                  {toGiveData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                      <div 
                        className="w-3 h-3 mr-2" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                      />
                      <span className="text-sm">{entry.name}: ₹{entry.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsTab;
