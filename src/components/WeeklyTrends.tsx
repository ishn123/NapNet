import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Calendar } from "lucide-react";
import { useSleep } from "@/context/SleepContext";
import { useMemo } from "react";
import {getWeeklyTrends} from "@/lib/sleepAnalyzer.ts";

const WeeklyTrends = () => {
  const sleep = useSleep();
  const weeklyData = useMemo(() => getWeeklyTrends(sleep?.analysis?.sleepData || []), [sleep]);

  const avgSleep = useMemo(() => (
      weeklyData.reduce((sum, d) => sum + d.hours, 0) / weeklyData.length || 0
  ), [weeklyData]);

  const avgQuality = useMemo(() => (
      weeklyData.reduce((sum, d) => sum + d.quality, 0) / weeklyData.length || 0
  ), [weeklyData]);

  const goalDays = useMemo(() => (
      weeklyData.filter(d => d.hours >= 8).length
  ), [weeklyData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      const data = payload[0].payload;
      return (
          <div className="bg-white p-3 border rounded-lg shadow-lg">
            <p className="font-medium">{label}</p>
            <p className="text-sm text-blue-600">Sleep: {data.hours}h</p>
            <p className="text-sm text-purple-600">Quality: {data.quality}%</p>
            <p className="text-sm text-gray-600">Bedtime: {data.bedtime}</p>
          </div>
      );
    }
    return null;
  };

  return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Weekly Sleep Trends
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Your sleep patterns over the past week
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 10]} label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="hours" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-600">{avgSleep.toFixed(1)}h</div>
              <div className="text-xs text-muted-foreground">Avg Sleep</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-semibold text-purple-600">{avgQuality.toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">Avg Quality</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-600">{goalDays}/7</div>
              <div className="text-xs text-muted-foreground">Goal Days</div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
};

export default WeeklyTrends;
