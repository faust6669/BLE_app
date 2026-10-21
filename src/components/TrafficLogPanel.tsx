import { Activity, Trash2, ArrowDown, ArrowUp, Radio, Zap, AlertTriangle, Search, Wifi, WifiOff } from 'lucide-react';
import { TrafficLog } from '../types';
import { formatTimestamp, getShortUuid } from '../utils/bleUtils';
import { useState } from 'react';

interface TrafficLogPanelProps {
  logs: TrafficLog[];
  onClear: () => void;
}

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  read: { icon: <ArrowDown className="w-3 h-3" />, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  write: { icon: <ArrowUp className="w-3 h-3" />, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  notify: { icon: <Radio className="w-3 h-3" />, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  connect: { icon: <Wifi className="w-3 h-3" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  disconnect: { icon: <WifiOff className="w-3 h-3" />, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  scan: { icon: <Zap className="w-3 h-3" />, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  error: { icon: <AlertTriangle className="w-3 h-3" />, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
};

export function TrafficLogPanel({ logs, onClear }: TrafficLogPanelProps) {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter((log) => {
    if (filter !== 'all' && log.type !== filter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        log.deviceName.toLowerCase().includes(search) ||
        log.details?.toLowerCase().includes(search) ||
        log.data?.toLowerCase().includes(search) ||
        log.characteristic?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">Traffic Monitor</h3>
            <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-full">
              {logs.length} events
            </span>
          </div>
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs..."
              className="w-full pl-7 pr-2 py-1.5 rounded-md text-xs bg-slate-900/50 border border-slate-700/30 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <div className="flex gap-1">
            {['all', 'read', 'write', 'notify', 'connect', 'disconnect', 'scan', 'error'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-2 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                  filter === type
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Log entries */}
      <div className="flex-1 overflow-y-auto font-mono">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity className="w-8 h-8 text-slate-600 mb-2" />
            <p className="text-xs text-slate-500">
              {logs.length === 0 ? 'No traffic captured yet' : 'No logs match current filters'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/20">
            {filteredLogs.map((log) => {
              const config = typeConfig[log.type] || typeConfig.scan;
              return (
                <div
                  key={log.id}
                  className={`px-4 py-2 hover:bg-slate-700/10 transition-colors border-l-2 ${
                    log.type === 'error' ? 'border-l-red-500/50' :
                    log.type === 'connect' ? 'border-l-emerald-500/50' :
                    log.type === 'disconnect' ? 'border-l-red-500/50' :
                    log.type === 'read' ? 'border-l-blue-500/50' :
                    log.type === 'write' ? 'border-l-amber-500/50' :
                    log.type === 'notify' ? 'border-l-purple-500/50' :
                    'border-l-slate-700/50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 ${config.color}`}>{config.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] text-slate-500">
                          {formatTimestamp(log.timestamp)}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${config.bg} ${config.color} font-medium uppercase`}>
                          {log.type}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">
                          {log.deviceName}
                        </span>
                      </div>
                      {log.service && (
                        <div className="text-[10px] text-slate-500">
                          Service: <span className="text-slate-400">{getShortUuid(log.service)}</span>
                          {log.characteristic && (
                            <> → Char: <span className="text-slate-400">{getShortUuid(log.characteristic)}</span></>
                          )}
                        </div>
                      )}
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        {log.details}
                      </div>
                      {log.data && (
                        <div className="text-[10px] text-blue-300/70 mt-0.5 bg-slate-900/30 rounded px-1.5 py-0.5 inline-block break-all">
                          {log.data}
                        </div>
                      )}
                    </div>
                    {log.direction && (
                      <span className={`text-[10px] ${log.direction === 'in' ? 'text-blue-400' : 'text-amber-400'}`}>
                        {log.direction === 'in' ? '← IN' : '→ OUT'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
