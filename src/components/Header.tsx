import { Bluetooth, Wifi, Shield, Activity } from 'lucide-react';

interface HeaderProps {
  deviceCount: number;
  connectedCount: number;
  logCount: number;
}

export function Header({ deviceCount, connectedCount, logCount }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-blue-800/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Bluetooth className="w-5 h-5 text-blue-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">BLE Monitor</h1>
            <p className="text-xs text-blue-300/70">Bluetooth Low Energy Device Scanner & Traffic Analyzer</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-slate-300">
              <span className="text-emerald-400 font-semibold">{deviceCount}</span> devices
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs text-slate-300">
              <span className="text-blue-400 font-semibold">{connectedCount}</span> connected
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs text-slate-300">
              <span className="text-purple-400 font-semibold">{logCount}</span> events
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
