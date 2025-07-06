import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Moon } from "lucide-react";
import {useSleep} from "@/context/SleepContext.tsx";
import {useEffect, useState} from "react";
import { format } from "date-fns"

const SleepChart = () => {
  // Mock sleep phase data
  const sleepData = useSleep();
  const [sleepDatas,setSleepDatas] = useState<any>([]);
  const [sleepStart,setSleepStart] = useState<string>("");
  const [sleepEnd,setSleepEnd] = useState<string>("");

  useEffect(() => {

    if(sleepData?.isConnected === false){
      setSleepDatas([]);
      return;
    }
    if (sleepData?.analysis?.sleepData) {

      const raw = sleepData?.analysis?.sleepData;

      const DOWNSAMPLE_FACTOR = 4;
      const downsampled = raw.filter((_, i) => i % DOWNSAMPLE_FACTOR === 0);

      // ✅ Always check if time exists and is valid
      if (downsampled.length > 0) {
        const startTime = new Date(downsampled[0].time);
        const endTime = new Date(downsampled[downsampled.length - 1].time);

        // Defensive check for valid date
        if (!isNaN(startTime.getTime()) && !isNaN(endTime.getTime())) {
          const sStart = format(startTime, "hh:mm a");
          const sEnd = format(endTime, "hh:mm a");
          setSleepStart(sStart);
          setSleepEnd(sEnd);
        }
      }

      setSleepDatas(downsampled); // ✅ set this after processing
    }
  }, [sleepData?.analysis]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm" style={{ color: payload[0].payload.color }}>
            {payload[0].payload.phase} Sleep
          </p>
        </div>
      );
    }
    return null;
  };


  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-purple-500" />
          Last Night's Sleep Phases
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your sleep cycle from {sleepStart} to {sleepEnd}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sleepDatas}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 4]}
                ticks={[1, 2, 3, 4]}
                tickFormatter={(value) => {
                  const phases = { 1: 'Light', 2: 'REM', 3: 'Deep', 4: 'Awake' };
                  return phases[value as keyof typeof phases] || '';
                }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="stepAfter"
                dataKey="value"
                stroke="#8b5cf6"
                fill="url(#sleepGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm">Light Sleep</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            <span className="text-sm">Deep Sleep</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
            <span className="text-sm">REM Sleep</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm">Awake</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepChart;
