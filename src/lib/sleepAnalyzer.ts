// utils/sleepAnalyzer.ts
import { format } from "date-fns"
import { differenceInMinutes, parseISO } from "date-fns"

type DataPoint = {
    time: string
    hr: number
    movement: number
}

type SleepPhase = "Awake" | "Light" | "Deep" | "REM"

export function analyzeSleepData(data: DataPoint[]) {
    const sleepData = data.map(({ time, hr, movement }) => {
        let phase: SleepPhase
        if (movement > 50) phase = "Awake"
        else if (movement > 10) phase = "Light"
        else if (hr < 70) phase = "Deep"
        else phase = "REM"

        return {
            time: format(new Date(time), "hh:mm a"),
            phase,
            value: getPhaseValue(phase),
            color: getPhaseColor(phase),
        }
    })

    const duration = sleepData.filter(d => d.phase !== "Awake").length * 1 // each entry = 1 min
    const deep = sleepData.filter(d => d.phase === "Deep").length
    const rem = sleepData.filter(d => d.phase === "REM").length

    const metrics = [
        {
            title: "Sleep Duration",
            value: minutesToDuration(duration),
            subtitle: "Goal: 8h 00m",
            icon: "clock",
            color: "bg-blue-500"
        },
        {
            title: "Sleep Quality",
            value: `${Math.round((duration / sleepData.length) * 100)}%`,
            subtitle: "Good quality",
            icon: "moon",
            color: "bg-purple-500"
        },
        {
            title: "Deep Sleep",
            value: minutesToDuration(deep),
            subtitle: `${Math.round((deep / duration) * 100)}% of total sleep`,
            icon: "zap",
            color: "bg-indigo-500"
        },
        {
            title: "REM Sleep",
            value: minutesToDuration(rem),
            subtitle: `${Math.round((rem / duration) * 100)}% of total sleep`,
            icon: "heart",
            color: "bg-pink-500"
        }
    ]

    const insights = generateInsights(deep, rem, duration)

    return { sleepData, metrics, insights }
}

function minutesToDuration(mins: number) {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${h}h ${m}m`
}

function getPhaseValue(phase: SleepPhase) {
    return {
        "Awake": 4,
        "Light": 1,
        "Deep": 3,
        "REM": 2
    }[phase]
}

function getPhaseColor(phase: SleepPhase) {
    return {
        "Awake": "#ef4444",
        "Light": "#3b82f6",
        "Deep": "#6366f1",
        "REM": "#ec4899"
    }[phase]
}

function generateInsights(deep: number, rem: number, duration: number) {
    const deepPercent = (deep / duration) * 100
    const remPercent = (rem / duration) * 100

    const insights = []

    if (deepPercent >= 15 && deepPercent <= 20) {
        insights.push({
            type: "positive",
            title: "Great Deep Sleep",
            description: `You achieved ${Math.round(deepPercent)}% deep sleep, which is optimal.`,
            color: "bg-green-100 text-green-800 border-green-200",
            icon: "trending-up"
        })
    }

    if (duration < 480) {
        insights.push({
            type: "alert",
            title: "Sleep Debt",
            description: `You're ${Math.round((480 - duration) / 60)}h short of your goal.`,
            color: "bg-orange-100 text-orange-800 border-orange-200",
            icon: "alert-circle"
        })
    }

    return insights
}

export function generateRecommendations(sleepData: any[]): string[] {
    if (!sleepData || sleepData.length < 2) return []

    const recommendations: string[] = []

    // 1. Sleep Duration
    const sleepPhases = sleepData.filter(d => d.phase !== "Awake")
    const sleepMinutes = sleepPhases.length
    const sleepHours = sleepMinutes / 60

    if (sleepHours < 7.5) {
        recommendations.push("Try going to bed 20–30 minutes earlier to increase total sleep time.")
    } else if (sleepHours >= 8) {
        recommendations.push("Great job hitting your sleep goal. Maintain your current routine!")
    }

    // 2. Sleep Start Time
    const firstSleepEntry = parseISO(sleepData[0].time)
    const bedtimeHour = firstSleepEntry.getHours()

    if (bedtimeHour > 23) {
        recommendations.push("Consider shifting your bedtime to before 11:00 PM for better sleep quality.")
    }

    // 3. Deep Sleep Ratio
    const deepSleepCount = sleepData.filter(d => d.phase === "Deep").length
    const deepSleepPercent = (deepSleepCount / sleepPhases.length) * 100

    if (deepSleepPercent < 15) {
        recommendations.push("Incorporate a wind-down routine like reading or meditation to promote deep sleep.")
    }

    // 4. REM Sleep Ratio
    const remSleepCount = sleepData.filter(d => d.phase === "REM").length
    const remSleepPercent = (remSleepCount / sleepPhases.length) * 100

    if (remSleepPercent < 20) {
        recommendations.push("Try to reduce caffeine intake in the evening to improve REM sleep.")
    }

    // 5. Restlessness / Movement Spikes
    const movementSpikes = sleepData.filter(d => d.value === 4).length
    if (movementSpikes > 10) {
        recommendations.push("Keep your bedroom cool and dark to reduce restlessness during sleep.")
    }

    // 6. Bonus general tip
    recommendations.push("Avoid screens 1 hour before bedtime to enhance melatonin production.")

    return recommendations
}

type WeeklyTrend = {
    day: string;
    hours: number;
    quality: number;
    bedtime: string;
};

export const getWeeklyTrends = (sleepData: any[]): WeeklyTrend[] => {
    const daysMap = new Map<string, any[]>();

    // Group entries by date based on earliest time
    sleepData.forEach((entry) => {
        // Parse hour from string time
        const date = new Date(`1970-01-01T${entry.time}`);
        const hour = date.getHours();
        // If time is PM or > 12AM, assume it belongs to previous date
        const shiftDate = hour >= 12 ? -1 : 0;
        const now = new Date();
        now.setDate(now.getDate() + shiftDate);
        const dayKey = now.toLocaleDateString("en-US", { weekday: "short" }); // Mon, Tue...

        if (!daysMap.has(dayKey)) daysMap.set(dayKey, []);
        daysMap.get(dayKey)!.push(entry);
    });

    // Reduce to weekly trend list
    const weeklyData: WeeklyTrend[] = [];

    for (const [day, logs] of daysMap.entries()) {
        const total = logs.length;
        const nonAwake = logs.filter(l => l.phase !== "Awake").length;
        const remDeep = logs.filter(l => l.phase === "REM" || l.phase === "Deep").length;

        const quality = total === 0 ? 0 : Math.round((remDeep / total) * 100);
        const hours = (nonAwake * 1) / 60; // 1 log = ~1 min
        const earliestTime = logs.reduce((min, l) => (l.time < min ? l.time : min), logs[0].time);

        weeklyData.push({
            day,
            hours: parseFloat(hours.toFixed(2)),
            quality,
            bedtime: earliestTime,
        });
    }

    // Sort by day order (Mon–Sun)
    const dayOrder = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    weeklyData.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

    return weeklyData;
};


