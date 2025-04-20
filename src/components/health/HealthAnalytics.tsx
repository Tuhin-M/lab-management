
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { ArrowUp, ArrowDown, Activity, Heart, Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HealthMetric {
  date: string;
  weight?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bloodSugar?: number;
  cholesterolTotal?: number;
}

interface HealthAnalyticsProps {
  healthData: HealthMetric[];
}

const HealthAnalytics: React.FC<HealthAnalyticsProps> = ({ healthData }) => {
  // Mock data for demo
  const mockData = [
    { date: '2023-01-01', weight: 75, bloodPressureSystolic: 120, bloodPressureDiastolic: 80, bloodSugar: 90, cholesterolTotal: 190 },
    { date: '2023-02-01', weight: 74, bloodPressureSystolic: 118, bloodPressureDiastolic: 78, bloodSugar: 88, cholesterolTotal: 185 },
    { date: '2023-03-01', weight: 73.5, bloodPressureSystolic: 122, bloodPressureDiastolic: 82, bloodSugar: 92, cholesterolTotal: 180 },
    { date: '2023-04-01', weight: 72, bloodPressureSystolic: 119, bloodPressureDiastolic: 79, bloodSugar: 87, cholesterolTotal: 178 },
    { date: '2023-05-01', weight: 72.5, bloodPressureSystolic: 121, bloodPressureDiastolic: 80, bloodSugar: 86, cholesterolTotal: 175 },
    { date: '2023-06-01', weight: 71, bloodPressureSystolic: 118, bloodPressureDiastolic: 78, bloodSugar: 85, cholesterolTotal: 172 },
  ];

  const data = healthData.length > 0 ? healthData : mockData;
  
  // Calculate trends
  const calculateTrend = (dataKey: keyof typeof data[0]) => {
    if (data.length < 2) return 0;
    
    const lastValue = data[data.length - 1][dataKey] as number;
    const firstValue = data[0][dataKey] as number;
    
    return ((lastValue - firstValue) / firstValue) * 100;
  };

  const weightTrend = calculateTrend('weight');
  const bloodPressureTrend = calculateTrend('bloodPressureSystolic');
  const bloodSugarTrend = calculateTrend('bloodSugar');
  const cholesterolTrend = calculateTrend('cholesterolTotal');

  const renderTrendIcon = (trend: number) => {
    if (trend < 0) {
      return <ArrowDown className="h-4 w-4 text-green-500" />;
    } else if (trend > 0) {
      return <ArrowUp className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weight</p>
                <h3 className="text-2xl font-bold mt-1">
                  {data[data.length - 1].weight} kg
                </h3>
              </div>
              <Activity className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              {renderTrendIcon(weightTrend)}
              <span className={weightTrend < 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(weightTrend).toFixed(1)}% from start
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blood Pressure</p>
                <h3 className="text-2xl font-bold mt-1">
                  {data[data.length - 1].bloodPressureSystolic}/{data[data.length - 1].bloodPressureDiastolic}
                </h3>
              </div>
              <Heart className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              {renderTrendIcon(bloodPressureTrend)}
              <span className={bloodPressureTrend < 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(bloodPressureTrend).toFixed(1)}% from start
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blood Sugar</p>
                <h3 className="text-2xl font-bold mt-1">
                  {data[data.length - 1].bloodSugar} mg/dL
                </h3>
              </div>
              <Droplets className="h-5 w-5 text-purple-500" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              {renderTrendIcon(bloodSugarTrend)}
              <span className={bloodSugarTrend < 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(bloodSugarTrend).toFixed(1)}% from start
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cholesterol</p>
                <h3 className="text-2xl font-bold mt-1">
                  {data[data.length - 1].cholesterolTotal} mg/dL
                </h3>
              </div>
              <Activity className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              {renderTrendIcon(cholesterolTrend)}
              <span className={cholesterolTrend < 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(cholesterolTrend).toFixed(1)}% from start
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Health Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weight">
            <TabsList>
              <TabsTrigger value="weight">Weight</TabsTrigger>
              <TabsTrigger value="bloodPressure">Blood Pressure</TabsTrigger>
              <TabsTrigger value="bloodSugar">Blood Sugar</TabsTrigger>
              <TabsTrigger value="cholesterol">Cholesterol</TabsTrigger>
            </TabsList>
            
            <TabsContent value="weight" className="pt-4">
              <div className="h-80">
                <ChartContainer
                  config={{
                    weight: {
                      label: "Weight",
                      color: "#3b82f6",
                    },
                  }}
                >
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                    />
                    <YAxis />
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="border rounded-lg shadow-sm bg-background p-2">
                              <div className="text-xs font-medium">{formatDate(label)}</div>
                              <div className="text-sm font-semibold">
                                {payload[0].value} kg
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#3b82f6" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="bloodPressure" className="pt-4">
              <div className="h-80">
                <ChartContainer
                  config={{
                    systolic: {
                      label: "Systolic",
                      color: "#ef4444",
                    },
                    diastolic: {
                      label: "Diastolic",
                      color: "#f97316",
                    },
                  }}
                >
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                    />
                    <YAxis />
                    <Legend />
                    <ChartTooltip />
                    <Line 
                      type="monotone" 
                      dataKey="bloodPressureSystolic" 
                      name="Systolic"
                      stroke="#ef4444" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bloodPressureDiastolic" 
                      name="Diastolic"
                      stroke="#f97316" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="bloodSugar" className="pt-4">
              <div className="h-80">
                <ChartContainer
                  config={{
                    sugar: {
                      label: "Blood Sugar",
                      color: "#8b5cf6",
                    },
                  }}
                >
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                    />
                    <YAxis />
                    <ChartTooltip />
                    <Line 
                      type="monotone" 
                      dataKey="bloodSugar" 
                      name="Blood Sugar"
                      stroke="#8b5cf6" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="cholesterol" className="pt-4">
              <div className="h-80">
                <ChartContainer
                  config={{
                    cholesterol: {
                      label: "Total Cholesterol",
                      color: "#22c55e",
                    },
                  }}
                >
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                    />
                    <YAxis />
                    <ChartTooltip />
                    <Line 
                      type="monotone" 
                      dataKey="cholesterolTotal" 
                      name="Total Cholesterol"
                      stroke="#22c55e" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button>Add Health Metric</Button>
      </div>
    </div>
  );
};

export default HealthAnalytics;
