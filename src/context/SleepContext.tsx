// context/SleepContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { analyzeSleepData } from "@/lib/sleepAnalyzer";
import { fetchSleepDataFromFirebase } from "@/lib/firebase"; // your implementation

type SleepContextType = {
    analysis: any;
    isConnected: boolean;
    setIsConnected: (val: boolean) => void;
};

const SleepContext = createContext<SleepContextType | null>(null);

export const SleepProvider = ({ children }: { children: React.ReactNode }) => {
    const [analysis, setAnalysis] = useState({});
    const [isConnected, setIsConnected] = useState(null);

    const loadData = async () => {

        const rawData = await fetchSleepDataFromFirebase();
        const analyzed = analyzeSleepData(rawData);
        setAnalysis(analyzed);
    };


    useEffect(() => {

        if(isConnected){
            loadData();
        }else if(isConnected === false){
            setAnalysis({})
        }

    }, [isConnected]);

    return (
        <SleepContext.Provider value={{ analysis, isConnected, setIsConnected }}>
            {children}
        </SleepContext.Provider>
    );
};

export const useSleep = () => {
    const context = useContext(SleepContext);
    if (!context) {
        throw new Error("useSleep must be used within a SleepProvider");
    }
    return context;
};
