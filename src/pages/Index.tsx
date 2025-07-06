
import SleepHeader from "@/components/SleepHeader";
import SleepMetrics from "@/components/SleepMetrics";
import SleepChart from "@/components/SleepChart";
import SleepInsights from "@/components/SleepInsights";
import WeeklyTrends from "@/components/WeeklyTrends";
import WatchUI from "@/components/WatchUI";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <SleepHeader />
        <WatchUI />
        <SleepMetrics />
        <SleepChart />
        <SleepInsights />
        <WeeklyTrends />
      </div>
    </div>
  );
};

export default Index;
