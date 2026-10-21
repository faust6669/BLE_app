import { useState, useCallback, useRef } from 'react';
import { BLEDevice, TrafficLog } from '../types';
import {
  getServiceName,
  getCharacteristicName,
  bytesToHex,
  bytesToString,
  stringToBytes,
  generateId,
} from '../utils/bleUtils';

export function useBLE() {
  const [devices, setDevices] = useState<BLEDevice[]>([]);
  const [logs, setLogs] = useState<TrafficLog[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const deviceRefs = useRef<Map<string, any>>(new Map());
  const serverRefs = useRef<Map<string, any>>(new Map());

  const addLog = useCallback((log: Omit<TrafficLog, 'id' | 'timestamp'>) => {
    setLogs((prev) => [
      { ...log, id: generateId(), timestamp: new Date() },
      ...prev.slice(0, 499),
    ]);
  }, []);

  const checkSupport = useCallback(() => {
    if (!navigator.bluetooth) {
      setIsSupported(false);
      return false;
    }
    return true;
  }, []);

  const startScan = useCallback(async () => {
    if (!checkSupport()) return;

    setIsScanning(true);
    addLog({
      type: 'scan',
      deviceName: 'System',
      deviceId: 'system',
      details: 'BLE scan initiated - requesting device picker...',
    });

    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'device_information', 'heart_rate', 'generic_access'],
      });

      const rssi = device.gatt?.connected ? -50 : Math.floor(Math.random() * 40) - 80;

      const newDevice: BLEDevice = {
        id: device.id,
        name: device.name || `Unknown (${device.id.substring(0, 8)})`,
        rssi,
        connected: device.gatt?.connected || false,
        lastSeen: new Date(),
        services: [],
      };

      deviceRefs.current.set(device.id, device);

      setDevices((prev) => {
        const existing = prev.findIndex((d) => d.id === device.id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = { ...updated[existing], ...newDevice };
          return updated;
        }
        return [...prev, newDevice];
      });

      addLog({
        type: 'scan',
        deviceName: newDevice.name,
        deviceId: device.id,
        details: `Device discovered: ${newDevice.name} (ID: ${device.id.substring(0, 12)}...)`,
      });

      // Listen for disconnection
      device.addEventListener('gattserverdisconnected', () => {
        setDevices((prev) =>
          prev.map((d) => (d.id === device.id ? { ...d, connected: false } : d))
        );
        serverRefs.current.delete(device.id);
        addLog({
          type: 'disconnect',
          deviceName: newDevice.name,
          deviceId: device.id,
          details: 'GATT server disconnected',
        });
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      if (!message.includes('User cancelled')) {
        addLog({
          type: 'error',
          deviceName: 'System',
          deviceId: 'system',
          details: `Scan error: ${message}`,
        });
      }
    } finally {
      setIsScanning(false);
    }
  }, [checkSupport, addLog]);

  const connectDevice = useCallback(
    async (deviceId: string) => {
      const device = deviceRefs.current.get(deviceId);
      if (!device || !device.gatt) return;

      addLog({
        type: 'connect',
        deviceName: device.name || 'Unknown',
        deviceId,
        details: 'Connecting to GATT server...',
      });

      try {
        const server = await device.gatt.connect();
        serverRefs.current.set(deviceId, server);

        setDevices((prev) =>
          prev.map((d) => (d.id === deviceId ? { ...d, connected: true } : d))
        );

        addLog({
          type: 'connect',
          deviceName: device.name || 'Unknown',
          deviceId,
          details: 'GATT server connected successfully',
        });

        // Discover services
        const services = await server.getPrimaryServices();
        const bleServices = await Promise.all(
          services.map(async (service: any) => {
            try {
              const characteristics = await service.getCharacteristics();
              return {
                uuid: service.uuid,
                name: getServiceName(service.uuid),
                characteristics: characteristics.map((char: any) => ({
                  uuid: char.uuid,
                  name: getCharacteristicName(char.uuid),
                  properties: char.properties as unknown as string[],
                  value: null,
                })),
              };
            } catch {
              return {
                uuid: service.uuid,
                name: getServiceName(service.uuid),
                characteristics: [],
              };
            }
          })
        );

        setDevices((prev) =>
          prev.map((d) =>
            d.id === deviceId
              ? { ...d, connected: true, services: bleServices }
              : d
          )
        );

        addLog({
          type: 'connect',
          deviceName: device.name || 'Unknown',
          deviceId,
          details: `Discovered ${bleServices.length} services`,
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        addLog({
          type: 'error',
          deviceName: device.name || 'Unknown',
          deviceId,
          details: `Connection failed: ${message}`,
        });
      }
    },
    [addLog]
  );

  const disconnectDevice = useCallback(
    async (deviceId: string) => {
      const server = serverRefs.current.get(deviceId);
      if (server) {
        server.disconnect();
        serverRefs.current.delete(deviceId);
      }
      setDevices((prev) =>
        prev.map((d) => (d.id === deviceId ? { ...d, connected: false } : d))
      );
      const device = deviceRefs.current.get(deviceId);
      addLog({
        type: 'disconnect',
        deviceName: device?.name || 'Unknown',
        deviceId,
        details: 'Disconnected from device',
      });
    },
    [addLog]
  );

  const readCharacteristic = useCallback(
    async (deviceId: string, serviceUuid: string, charUuid: string) => {
      const server = serverRefs.current.get(deviceId);
      if (!server) return;

      const device = deviceRefs.current.get(deviceId);
      const deviceName = device?.name || 'Unknown';

      try {
        const service = await server.getPrimaryService(serviceUuid);
        const characteristic = await service.getCharacteristic(charUuid);
        const value = await characteristic.readValue();

        const hexValue = bytesToHex(new Uint8Array(value.buffer));
        const stringValue = bytesToString(new Uint8Array(value.buffer));

        setDevices((prev) =>
          prev.map((d) =>
            d.id === deviceId
              ? {
                  ...d,
                  services: d.services.map((s) =>
                    s.uuid === serviceUuid
                      ? {
                          ...s,
                          characteristics: s.characteristics.map((c) =>
                            c.uuid === charUuid ? { ...c, value: hexValue } : c
                          ),
                        }
                      : s
                  ),
                }
              : d
          )
        );

        addLog({
          type: 'read',
          deviceName,
          deviceId,
          service: serviceUuid,
          characteristic: charUuid,
          data: hexValue,
          direction: 'in',
          details: `Read: ${stringValue || hexValue}`,
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        addLog({
          type: 'error',
          deviceName,
          deviceId,
          service: serviceUuid,
          characteristic: charUuid,
          details: `Read failed: ${message}`,
        });
      }
    },
    [addLog]
  );

  const writeCharacteristic = useCallback(
    async (deviceId: string, serviceUuid: string, charUuid: string, data: string) => {
      const server = serverRefs.current.get(deviceId);
      if (!server) return;

      const device = deviceRefs.current.get(deviceId);
      const deviceName = device?.name || 'Unknown';

      try {
        const service = await server.getPrimaryService(serviceUuid);
        const characteristic = await service.getCharacteristic(charUuid);
        const bytes = stringToBytes(data);
        await characteristic.writeValue(bytes);

        addLog({
          type: 'write',
          deviceName,
          deviceId,
          service: serviceUuid,
          characteristic: charUuid,
          data: bytesToHex(bytes),
          direction: 'out',
          details: `Wrote: "${data}" (${bytes.length} bytes)`,
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        addLog({
          type: 'error',
          deviceName,
          deviceId,
          service: serviceUuid,
          characteristic: charUuid,
          details: `Write failed: ${message}`,
        });
      }
    },
    [addLog]
  );

  const subscribeCharacteristic = useCallback(
    async (deviceId: string, serviceUuid: string, charUuid: string) => {
      const server = serverRefs.current.get(deviceId);
      if (!server) return;

      const device = deviceRefs.current.get(deviceId);
      const deviceName = device?.name || 'Unknown';

      try {
        const service = await server.getPrimaryService(serviceUuid);
        const characteristic = await service.getCharacteristic(charUuid);

        await characteristic.startNotifications();

        characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
          const value = event.target?.value;
          if (value) {
            const hexValue = bytesToHex(new Uint8Array(value.buffer));
            addLog({
              type: 'notify',
              deviceName,
              deviceId,
              service: serviceUuid,
              characteristic: charUuid,
              data: hexValue,
              direction: 'in',
              details: `Notification: ${hexValue}`,
            });
          }
        });

        addLog({
          type: 'notify',
          deviceName,
          deviceId,
          service: serviceUuid,
          characteristic: charUuid,
          details: 'Subscribed to notifications',
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        addLog({
          type: 'error',
          deviceName,
          deviceId,
          service: serviceUuid,
          characteristic: charUuid,
          details: `Subscribe failed: ${message}`,
        });
      }
    },
    [addLog]
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const removeDevice = useCallback((deviceId: string) => {
    const server = serverRefs.current.get(deviceId);
    if (server) {
      server.disconnect();
      serverRefs.current.delete(deviceId);
    }
    deviceRefs.current.delete(deviceId);
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
  }, []);

  return {
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
  };
}
