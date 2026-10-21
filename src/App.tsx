import { Header } from './components/Header';
import { ScanPanel } from './components/ScanPanel';
import { DeviceList } from './components/DeviceList';
import { TrafficLogPanel } from './components/TrafficLogPanel';
import { StatsPanel } from './components/StatsPanel';
import { InfoPanel } from './components/InfoPanel';
import { useBLE } from './hooks/useBLE';
import { useEffect } from 'react';

function App() {
  const {
    devices,
    logs,
    isScanning,
    isSupported,
    startScan,
    connectDevice,
    disconnectDevice,
    readCharacteristic,
    writeCharacteristic,
    subscribeCharacteristic,
    clearLogs,
    removeDevice,
  } = useBLE();

  useEffect(() => {
    // Check Web Bluetooth support on mount
    if (!navigator.bluetooth) {
      console.warn('Web Bluetooth API is not supported in this browser');
    }
  }, []);

  const connectedCount = devices.filter((d) => d.connected).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative z-10">
        <Header
          deviceCount={devices.length}
          connectedCount={connectedCount}
          logCount={logs.length}
        />

        <main className="max-w-[1600px] mx-auto p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            {/* Left sidebar - Scanner + Stats + Info */}
            <div className="lg:col-span-3 space-y-4">
              <ScanPanel
                isScanning={isScanning}
                isSupported={isSupported}
                onScan={startScan}
              />
              <StatsPanel
                logs={logs}
                deviceCount={devices.length}
                connectedCount={connectedCount}
              />
              <InfoPanel />
            </div>

            {/* Center - Device List */}
            <div className="lg:col-span-5">
              <DeviceList
                devices={devices}
                onConnect={connectDevice}
                onDisconnect={disconnectDevice}
                onRead={readCharacteristic}
                onWrite={writeCharacteristic}
                onSubscribe={subscribeCharacteristic}
                onRemove={removeDevice}
              />
            </div>

            {/* Right - Traffic Log */}
            <div className="lg:col-span-4 min-h-[600px]">
              <TrafficLogPanel logs={logs} onClear={clearLogs} />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 mt-8 px-6 py-4">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>BLE Monitor v1.0</span>
            </div>
            <div className="text-xs text-slate-600">
              Web Bluetooth API • Bluetooth Low Energy 4.0+
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
