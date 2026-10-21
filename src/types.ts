export interface BLEDevice {
  id: string;
  name: string;
  rssi: number;
  connected: boolean;
  connecting: boolean;
  lastSeen: Date;
  services: BLEService[];
}

export interface BLEService {
  uuid: string;
  name: string;
  characteristics: BLECharacteristic[];
}

export interface BLECharacteristic {
  uuid: string;
  name: string;
  properties: string[];
  value: string | null;
}

export interface TrafficLog {
  id: string;
  timestamp: Date;
  type: 'read' | 'write' | 'notify' | 'connect' | 'disconnect' | 'scan' | 'error';
  deviceName: string;
  deviceId: string;
  service?: string;
  characteristic?: string;
  data?: string;
  direction?: 'in' | 'out';
  details?: string;
}

export interface ScanFilter {
  name?: string;
  services?: string[];
  acceptAllAdvertisements: boolean;
}
