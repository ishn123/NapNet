import { Clock, Moon, Zap, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSleep } from "@/context/SleepContext";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

const iconMap: Record<string, React.ReactNode> = {
  clock: <Clock className="h-4 w-4 text-white" />,
  moon: <Moon className="h-4 w-4 text-white" />,
  zap: <Zap className="h-4 w-4 text-white" />,
  heart: <Heart className="h-4 w-4 text-white" />
};

const MetricCard = ({ title, value, subtitle, icon, color }: MetricCardProps) => (
    <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`${color} p-2 rounded-lg`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
);

const SleepMetrics = () => {
  const sleep = useSleep();

  const metrics = sleep?.analysis?.metrics ?? [
    {
      title: "Sleep Duration",
      value: "--",
      subtitle: "--",
      icon: iconMap.clock,
      color: "bg-blue-500"
    },
    {
      title: "Sleep Quality",
      value: "--",
      subtitle: "--",
      icon: iconMap.moon,
      color: "bg-purple-500"
    },
    {
      title: "Deep Sleep",
      value: "--",
      subtitle: "--",
      icon: iconMap.zap,
      color: "bg-indigo-500"
    },
    {
      title: "REM Sleep",
      value: "--",
      subtitle: "--",
      icon: iconMap.heart,
      color: "bg-pink-500"
    }
  ];

  // 🔄 Replace icon string keys with actual Lucide icons
  const enrichedMetrics = metrics.map((m) => ({
    ...m,
    icon: typeof m.icon === "string" ? iconMap[m.icon] : m.icon
  }));

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {enrichedMetrics.map((metric, index) => (
            <div key={metric.title} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <MetricCard {...metric} />
            </div>
        ))}
      </div>
  );
};

export default SleepMetrics;
