import { Bluetooth, Shield, Globe, Cpu, ArrowRight, Zap, Signal, Radio } from 'lucide-react';

export function InfoPanel() {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-semibold text-white">BLE Protocol Info</h3>
      </div>

      <div className="space-y-3">
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
          <h4 className="text-xs font-medium text-blue-300 mb-2 flex items-center gap-1.5">
            <Globe className="w-3 h-3" /> Web Bluetooth API
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            This monitor uses the Web Bluetooth API to discover and communicate with BLE devices.
            User interaction is required to initiate scanning for security purposes.
          </p>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
          <h4 className="text-xs font-medium text-purple-300 mb-2 flex items-center gap-1.5">
            <Cpu className="w-3 h-3" /> GATT Structure
          </h4>
          <div className="text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-blue-300">Device</span>
              <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
              <span className="text-emerald-300">Services</span>
              <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
              <span className="text-purple-300">Characteristics</span>
            </div>
            <p className="text-slate-500 mt-1">
              BLE devices expose data through a hierarchy of Services → Characteristics → Descriptors
            </p>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
          <h4 className="text-xs font-medium text-amber-300 mb-2 flex items-center gap-1.5">
            <Zap className="w-3 h-3" /> Operations
          </h4>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="text-slate-400">Read values</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-slate-400">Write values</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span className="text-slate-400">Subscribe to notifications</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-slate-400">Monitor RSSI</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
          <h4 className="text-xs font-medium text-cyan-300 mb-2 flex items-center gap-1.5">
            <Signal className="w-3 h-3" /> Signal Strength
          </h4>
          <div className="space-y-1 text-[10px]">
            <div className="flex justify-between">
              <span className="text-green-400">≥ -50 dBm</span>
              <span className="text-slate-400">Excellent</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-300">-50 to -60 dBm</span>
              <span className="text-slate-400">Good</span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-400">-60 to -70 dBm</span>
              <span className="text-slate-400">Fair</span>
            </div>
            <div className="flex justify-between">
              <span className="text-orange-400">-70 to -80 dBm</span>
              <span className="text-slate-400">Weak</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-400">&lt; -80 dBm</span>
              <span className="text-slate-400">Very Weak</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
          <h4 className="text-xs font-medium text-rose-300 mb-2 flex items-center gap-1.5">
            <Radio className="w-3 h-3" /> Common BLE Services
          </h4>
          <div className="space-y-1 text-[10px] text-slate-400">
            <div className="flex justify-between">
              <span>Heart Rate</span>
              <span className="font-mono text-slate-500">0x180D</span>
            </div>
            <div className="flex justify-between">
              <span>Battery</span>
              <span className="font-mono text-slate-500">0x180F</span>
            </div>
            <div className="flex justify-between">
              <span>Device Info</span>
              <span className="font-mono text-slate-500">0x180A</span>
            </div>
            <div className="flex justify-between">
              <span>Temperature</span>
              <span className="font-mono text-slate-500">0x181A</span>
            </div>
            <div className="flex justify-between">
              <span>Blood Pressure</span>
              <span className="font-mono text-slate-500">0x1810</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
