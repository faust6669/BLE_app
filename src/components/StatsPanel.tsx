import { BarChart3, TrendingUp, Clock, Radio } from 'lucide-react';
import { TrafficLog } from '../types';

interface StatsPanelProps {
  logs: TrafficLog[];
  deviceCount: number;
  connectedCount: number;
}

export function StatsPanel({ logs, deviceCount, connectedCount }: StatsPanelProps) {
  const readCount = logs.filter((l) => l.type === 'read').length;
  const writeCount = logs.filter((l) => l.type === 'write').length;
  const notifyCount = logs.filter((l) => l.type === 'notify').length;
  const errorCount = logs.filter((l) => l.type === 'error').length;
  const totalBytes = logs.reduce((acc, l) => {
    if (l.data) {
      return acc + (l.data.match(/[0-9A-F]{2}/g)?.length || 0);
    }
    return acc;
  }, 0);

  const stats = [
    {
      label: 'Devices Found',
      value: deviceCount,
      icon: <Radio className="w-4 h-4" />,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'Connected',
      value: connectedCount,
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Total Traffic',
      value: logs.length,
      icon: <BarChart3 className="w-4 h-4" />,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      label: 'Bytes Transferred',
      value: totalBytes,
      icon: <Clock className="w-4 h-4" />,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
  ];

  const trafficBreakdown = [
    { label: 'Reads', count: readCount, color: 'bg-blue-500', percentage: logs.length ? (readCount / logs.length) * 100 : 0 },
    { label: 'Writes', count: writeCount, color: 'bg-amber-500', percentage: logs.length ? (writeCount / logs.length) * 100 : 0 },
    { label: 'Notifications', count: notifyCount, color: 'bg-purple-500', percentage: logs.length ? (notifyCount / logs.length) * 100 : 0 },
    { label: 'Errors', count: errorCount, color: 'bg-red-500', percentage: logs.length ? (errorCount / logs.length) * 100 : 0 },
  ];

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-semibold text-white">Statistics</h3>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-lg border p-2.5 ${stat.bg}`}>
            <div className={`mb-1 ${stat.color}`}>{stat.icon}</div>
            <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Traffic breakdown */}
      <div className="space-y-2">
        <h4 className="text-xs text-slate-400 font-medium">Traffic Breakdown</h4>
        {trafficBreakdown.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-300">{item.label}</span>
              <span className="text-[11px] text-slate-400">{item.count}</span>
            </div>
            <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${item.color} transition-all duration-500`}
                style={{ width: `${Math.min(item.percentage, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
