import { useState } from 'react';
import {
  Bluetooth,
  BluetoothOff,
  ChevronDown,
  ChevronRight,
  Link2,
  Unlink,
  Trash2,
  Signal,
  Cpu,
  Eye,
  Pencil,
  Bell,
} from 'lucide-react';
import { BLEDevice } from '../types';
import { getSignalBars, getSignalStrength, getShortUuid, formatTimestamp } from '../utils/bleUtils';

interface DeviceListProps {
  devices: BLEDevice[];
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onRead: (deviceId: string, serviceUuid: string, charUuid: string) => void;
  onWrite: (deviceId: string, serviceUuid: string, charUuid: string, data: string) => void;
  onSubscribe: (deviceId: string, serviceUuid: string, charUuid: string) => void;
  onRemove: (id: string) => void;
}

export function DeviceList({
  devices,
  onConnect,
  onDisconnect,
  onRead,
  onWrite,
  onSubscribe,
  onRemove,
}: DeviceListProps) {
  const [expandedDevices, setExpandedDevices] = useState<Set<string>>(new Set());
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [writeValues, setWriteValues] = useState<Record<string, string>>({});

  const toggleDevice = (id: string) => {
    setExpandedDevices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleService = (key: string) => {
    setExpandedServices((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (devices.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="text-center py-8">
          <Bluetooth className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-slate-400 mb-1">No Devices Found</h3>
          <p className="text-xs text-slate-500">Click "Scan for BLE Devices" to discover nearby Bluetooth devices</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/50 flex items-center gap-2">
        <Signal className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-white">Discovered Devices</h3>
        <span className="ml-auto text-xs text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-full">
          {devices.length}
        </span>
      </div>
      <div className="divide-y divide-slate-700/30 max-h-[600px] overflow-y-auto">
        {devices.map((device) => {
          const signal = getSignalStrength(device.rssi);
          const bars = getSignalBars(device.rssi);
          const isExpanded = expandedDevices.has(device.id);

          return (
            <div key={device.id} className="group">
              <div className="px-4 py-3 hover:bg-slate-700/20 transition-colors">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleDevice(device.id)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    device.connected ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-slate-700/50 border border-slate-600/30'
                  }`}>
                    {device.connected ? (
                      <Bluetooth className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <BluetoothOff className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">{device.name}</span>
                      {device.connected && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          CONNECTED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[11px] text-slate-500 font-mono">
                        {device.id.substring(0, 12)}...
                      </span>
                      <span className={`text-[11px] ${signal.color}`}>
                        {device.rssi} dBm • {signal.label}
                      </span>
                    </div>
                  </div>

                  {/* Signal bars */}
                  <div className="flex items-end gap-0.5 mr-2">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={`w-1 rounded-full transition-colors ${
                          bar <= bars ? 'bg-blue-400' : 'bg-slate-700'
                        }`}
                        style={{ height: `${bar * 3 + 2}px` }}
                      />
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {device.connected ? (
                      <button
                        onClick={() => onDisconnect(device.id)}
                        className="p-1.5 rounded-md hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Disconnect"
                      >
                        <Unlink className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onConnect(device.id)}
                        className="p-1.5 rounded-md hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                        title="Connect"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onRemove(device.id)}
                      className="p-1.5 rounded-md hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded device details */}
                {isExpanded && device.services.length > 0 && (
                  <div className="mt-3 ml-7 space-y-1">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Cpu className="w-3 h-3 text-purple-400" />
                      <span className="text-xs text-purple-300 font-medium">
                        {device.services.length} Services Discovered
                      </span>
                    </div>
                    {device.services.map((service) => {
                      const serviceKey = `${device.id}-${service.uuid}`;
                      const isServiceExpanded = expandedServices.has(serviceKey);

                      return (
                        <div key={service.uuid} className="bg-slate-900/50 rounded-lg border border-slate-700/30">
                          <button
                            onClick={() => toggleService(serviceKey)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer hover:bg-slate-700/20 rounded-lg transition-colors"
                          >
                            {isServiceExpanded ? (
                              <ChevronDown className="w-3 h-3 text-slate-400" />
                            ) : (
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            )}
                            <span className="text-xs text-slate-300 font-medium truncate flex-1">
                              {service.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {getShortUuid(service.uuid)}
                            </span>
                          </button>

                          {isServiceExpanded && (
                            <div className="px-3 pb-2 space-y-1.5">
                              {service.characteristics.map((char) => {
                                const writeKey = `${device.id}-${char.uuid}`;
                                return (
                                  <div
                                    key={char.uuid}
                                    className="bg-slate-800/50 rounded-md border border-slate-700/20 p-2"
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-[11px] text-slate-300 font-medium">
                                        {char.name}
                                      </span>
                                      <span className="text-[10px] text-slate-500 font-mono">
                                        {getShortUuid(char.uuid)}
                                      </span>
                                    </div>
                                    {char.value && (
                                      <div className="text-[10px] text-blue-300 font-mono bg-blue-500/10 rounded px-1.5 py-0.5 mb-1.5 break-all">
                                        {char.value}
                                      </div>
                                    )}
                                    <div className="flex flex-wrap gap-1 mb-1.5">
                                      {char.properties.map((prop: string) => (
                                        <span
                                          key={prop}
                                          className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400"
                                        >
                                          {prop}
                                        </span>
                                      ))}
                                    </div>
                                    <div className="flex gap-1">
                                      {char.properties.includes('read') && (
                                        <button
                                          onClick={() => onRead(device.id, service.uuid, char.uuid)}
                                          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors cursor-pointer"
                                        >
                                          <Eye className="w-3 h-3" /> Read
                                        </button>
                                      )}
                                      {char.properties.includes('write') && (
                                        <div className="flex items-center gap-1">
                                          <input
                                            type="text"
                                            value={writeValues[writeKey] || ''}
                                            onChange={(e) =>
                                              setWriteValues((prev) => ({
                                                ...prev,
                                                [writeKey]: e.target.value,
                                              }))
                                            }
                                            placeholder="Data..."
                                            className="w-20 px-1.5 py-1 rounded text-[10px] bg-slate-900/50 border border-slate-700/30 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500/50"
                                          />
                                          <button
                                            onClick={() => {
                                              onWrite(device.id, service.uuid, char.uuid, writeValues[writeKey] || '');
                                              setWriteValues((prev) => ({ ...prev, [writeKey]: '' }));
                                            }}
                                            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors cursor-pointer"
                                          >
                                            <Pencil className="w-3 h-3" /> Write
                                          </button>
                                        </div>
                                      )}
                                      {char.properties.includes('notify') && (
                                        <button
                                          onClick={() => onSubscribe(device.id, service.uuid, char.uuid)}
                                          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors cursor-pointer"
                                        >
                                          <Bell className="w-3 h-3" /> Subscribe
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {isExpanded && device.services.length === 0 && device.connected && (
                  <div className="mt-3 ml-7 text-xs text-slate-500 italic">
                    Discovering services...
                  </div>
                )}

                {isExpanded && device.services.length === 0 && !device.connected && (
                  <div className="mt-3 ml-7 text-xs text-slate-500 italic">
                    Connect to device to discover services and characteristics
                  </div>
                )}
              </div>

              {/* Last seen */}
              <div className="px-4 pb-1">
                <span className="text-[10px] text-slate-600">
                  Last seen: {formatTimestamp(device.lastSeen)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
