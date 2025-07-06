
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Watch, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {useState} from "react";
import {useSleep} from "@/context/SleepContext.tsx";

const SleepHeader = () => {
  const {isConnected, setIsConnected } = useSleep();
  const [connectedText,setConnectedText] = useState<string>(isConnected?"Connected":"Connect");
  const onConnect = ()=>{
    if(connectedText === "Connected"){
      setConnectedText("Connect");
      setIsConnected(false);
      return;
    }
    setConnectedText("...Connecting....");
    setTimeout(()=>{
      setConnectedText("...Fetching Data...")
    },1000)

    setTimeout(()=>{
      setConnectedText("Connected")
      setIsConnected(true);
    },2000)
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b">
      <div className="flex items-center gap-3 mb-4 sm:mb-0">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
          <Watch className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            NapNet Dashboard
          </h1>
          <p className="text-muted-foreground">
            Be Fit And Active
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Badge
            variant="outline"
            className={
              connectedText === "Connect"
                  ? "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                  : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
            }
        >
          <div
              className={`w-2 h-2 rounded-full mr-2 ${
                  connectedText === "Connect" ? "bg-red-500" : "bg-green-500"
              }`}
          ></div>
          {connectedText === "Connect" ? "Watch Disconnected" : "Watch Connected"}
        </Badge>

        <ThemeToggle />
        <Button variant="outline" size="sm" onClick={()=>onConnect()}>
          {connectedText}
        </Button>
      </div>
    </div>
  );
};

export default SleepHeader;
