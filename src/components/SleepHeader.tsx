import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Watch, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { useSleep } from "@/context/SleepContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// Type definition for Bluetooth device
type BluetoothDeviceType = {
  id: string;
  name?: string;
  gatt?: BluetoothRemoteGATTServer;
};

const SleepHeader = () => {
  const { isConnected, setIsConnected } = useSleep();
  const [connectedText, setConnectedText] = useState<string>(
      isConnected ? "Connected" : "Connect"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [devices, setDevices] = useState<BluetoothDeviceType[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanForDevices = async () => {
    try {
      if (!navigator.bluetooth) {
        throw new Error("Bluetooth API not supported in this browser");
      }

      setIsScanning(true);
      setError(null);

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["heart_rate", "battery_service"],
      });

      setDevices([
        {
          id: device.id,
          name: device.name || "Unnamed Device",
          gatt: device.gatt,
        },
      ]);

      device.addEventListener("gattserverdisconnected", () => {
        setConnectedText("Connect");
        setIsConnected(false);
      });

      return device;
    } catch (err) {
      console.error("Bluetooth error:", err);
      setError(
          err instanceof Error ? err.message : "Failed to scan for devices"
      );
      return null;
    } finally {
      setIsScanning(false);
    }
  };

  const handleDeviceConnect = async (device: BluetoothDeviceType) => {
    try {
      setConnectedText("...Connecting...");
      if (!device.gatt) {
        throw new Error("Device GATT server not available");
      }

      const server = await device.gatt.connect();
      if (server) {
        setConnectedText("Connected");
        setIsConnected(true);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Connection error:", err);
      setConnectedText("Connect");
      setError(
          err instanceof Error ? err.message : "Failed to connect to device"
      );
    }
  };

  const onConnect = async () => {
    if (isConnected) {
      // Disconnect logic
      setConnectedText("Connect");
      setIsConnected(false);
      return;
    }

    setIsModalOpen(true);
    setConnectedText("...Scanning...");
    await scanForDevices();
  };

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
            <p className="text-muted-foreground">Be Fit And Active</p>
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
            {connectedText === "Connect"
                ? "Watch Disconnected"
                : "Watch Connected"}
          </Badge>

          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={onConnect}>
            {connectedText}
          </Button>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>Connect to Bluetooth Device</span>
                <X
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => setIsModalOpen(false)}
                />
              </DialogTitle>
              <DialogDescription>
                {isScanning
                    ? "Scanning for nearby devices..."
                    : "Select your device from the list"}
              </DialogDescription>
            </DialogHeader>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
            )}

            <ScrollArea className="h-64 rounded-md border">
              {devices.length > 0 ? (
                  <div className="space-y-2 p-2">
                    {devices.map((device) => (
                        <div
                            key={device.id}
                            className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors"
                            onClick={() => handleDeviceConnect(device)}
                        >
                          <div>
                            <p className="font-medium">{device.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {device.id}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            Connect
                          </Button>
                        </div>
                    ))}
                  </div>
              ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                    {isScanning ? (
                        <div className="animate-pulse space-y-2">
                          <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto"></div>
                          <p>Looking for devices...</p>
                        </div>
                    ) : (
                        <>
                          <p className="mb-2">No devices found.</p>
                          <p className="text-sm text-muted-foreground">
                            Make sure your device is in pairing mode and nearby.
                          </p>
                        </>
                    )}
                  </div>
              )}
            </ScrollArea>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    setConnectedText("Connect");
                    setError(null);
                  }}
              >
                Cancel
              </Button>
              <Button
                  onClick={scanForDevices}
                  disabled={isScanning}
              >
                {isScanning ? (
                    <>
                      <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                      >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Scanning...
                    </>
                ) : (
                    "Scan Again"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default SleepHeader;