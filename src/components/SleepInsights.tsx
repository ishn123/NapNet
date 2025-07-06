import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, Target, AlertCircle } from "lucide-react";
import { useSleep } from "@/context/SleepContext";
import {generateRecommendations} from "@/lib/sleepAnalyzer.ts";

const iconMap: Record<string, JSX.Element> = {
  "trending-up": <TrendingUp className="h-4 w-4" />,
  "lightbulb": <Lightbulb className="h-4 w-4" />,
  "target": <Target className="h-4 w-4" />,
  "alert-circle": <AlertCircle className="h-4 w-4" />
};

const SleepInsights = () => {
  const sleep = useSleep();

  const insights = sleep?.analysis?.insights ?? [];
  const recommendations = generateRecommendations(sleep?.analysis?.sleepData||[])

  return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Sleep Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.length > 0 ? insights.map((insight, index) => (
                <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Badge className={`${insight.color} mb-2 flex items-center gap-1 w-fit`}>
                    {iconMap[insight.icon] ?? <Lightbulb className="h-4 w-4" />}
                    {insight.title}
                  </Badge>
                  <p className="text-sm text-muted-foreground ml-1">
                    {insight.description}
                  </p>
                </div>
            )) : (
                <p className="text-sm text-muted-foreground">No insights available.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recommendations.length > 0 ? (
                <ul className="space-y-3">
                  {recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-muted-foreground">{rec}</span>
                      </li>
                  ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground">No recommendations available.</p>
            )}
          </CardContent>
        </Card>
      </div>
  );
};

export default SleepInsights;
