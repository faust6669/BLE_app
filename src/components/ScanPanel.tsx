import { Bluetooth, Radar, Loader2 } from 'lucide-react';

interface ScanPanelProps {
  isScanning: boolean;
  isSupported: boolean;
  onScan: () => void;
}

export function ScanPanel({ isScanning, isSupported, onScan }: ScanPanelProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Radar className={`w-4 h-4 ${isScanning ? 'text-blue-400 animate-spin' : 'text-slate-400'}`} />
          <h3 className="text-sm font-semibold text-white">Device Scanner</h3>
        </div>
        {isScanning && (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs text-blue-300">Scanning...</span>
          </div>
        )}
      </div>

      {!isSupported ? (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
          <p className="text-sm text-red-300">
            ⚠️ Web Bluetooth API is not supported in this browser. Please use Chrome, Edge, or Opera on desktop.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Click the button below to open the browser's device picker. Select a BLE device to add it to the monitor.
          </p>
          <button
            onClick={onScan}
            disabled={isScanning}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-medium transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Waiting for device selection...
              </>
            ) : (
              <>
                <Bluetooth className="w-4 h-4" />
                Scan for BLE Devices
              </>
            )}
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-1 h-1 rounded-full bg-slate-600" />
            <span>Requires HTTPS or localhost</span>
          </div>
        </div>
      )}
    </div>
  );
}
