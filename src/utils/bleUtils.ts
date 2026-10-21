// Known BLE GATT Service UUIDs
export const KNOWN_SERVICES: Record<string, string> = {
  '00001800-0000-1000-8000-00805f9b34fb': 'Generic Access',
  '00001801-0000-1000-8000-00805f9b34fb': 'Generic Attribute',
  '00001802-0000-1000-8000-00805f9b34fb': 'Immediate Alert',
  '00001803-0000-1000-8000-00805f9b34fb': 'Link Loss',
  '00001804-0000-1000-8000-00805f9b34fb': 'Tx Power',
  '00001805-0000-1000-8000-00805f9b34fb': 'Current Time',
  '0000180a-0000-1000-8000-00805f9b34fb': 'Device Information',
  '0000180d-0000-1000-8000-00805f9b34fb': 'Heart Rate',
  '0000180f-0000-1000-8000-00805f9b34fb': 'Battery',
  '00001810-0000-1000-8000-00805f9b34fb': 'Blood Pressure',
  '00001811-0000-1000-8000-00805f9b34fb': 'Alert Notification',
  '00001812-0000-1000-8000-00805f9b34fb': 'Human Interface Device',
  '00001813-0000-1000-8000-00805f9b34fb': 'Scan Parameters',
  '00001814-0000-1000-8000-00805f9b34fb': 'Running Speed & Cadence',
  '00001816-0000-1000-8000-00805f9b34fb': 'Cycling Speed & Cadence',
  '00001818-0000-1000-8000-00805f9b34fb': 'Cycling Power',
  '0000181a-0000-1000-8000-00805f9b34fb': 'Environmental Sensing',
  '0000181c-0000-1000-8000-00805f9b34fb': 'User Data',
  '0000181d-0000-1000-8000-00805f9b34fb': 'Weight Scale',
  '0000feaa-0000-1000-8000-00805f9b34fb': 'Google Eddystone (Beacon)',
  '0000fff0-0000-1000-8000-00805f9b34fb': 'Custom Service (FFF0)',
};

// Known BLE GATT Characteristic UUIDs
export const KNOWN_CHARACTERISTICS: Record<string, string> = {
  '00002a00-0000-1000-8000-00805f9b34fb': 'Device Name',
  '00002a01-0000-1000-8000-00805f9b34fb': 'Appearance',
  '00002a04-0000-1000-8000-00805f9b34fb': 'Peripheral Preferred Connection Params',
  '00002a05-0000-1000-8000-00805f9b34fb': 'Service Changed',
  '00002a19-0000-1000-8000-00805f9b34fb': 'Battery Level',
  '00002a23-0000-1000-8000-00805f9b34fb': 'System ID',
  '00002a24-0000-1000-8000-00805f9b34fb': 'Model Number',
  '00002a25-0000-1000-8000-00805f9b34fb': 'Serial Number',
  '00002a26-0000-1000-8000-00805f9b34fb': 'Firmware Revision',
  '00002a27-0000-1000-8000-00805f9b34fb': 'Hardware Revision',
  '00002a28-0000-1000-8000-00805f9b34fb': 'Software Revision',
  '00002a29-0000-1000-8000-00805f9b34fb': 'Manufacturer Name',
  '00002a37-0000-1000-8000-00805f9b34fb': 'Heart Rate Measurement',
  '00002a38-0000-1000-8000-00805f9b34fb': 'Body Sensor Location',
  '00002a39-0000-1000-8000-00805f9b34fb': 'Heart Rate Control Point',
  '00002a6e-0000-1000-8000-00805f9b34fb': 'Temperature',
  '00002a6f-0000-1000-8000-00805f9b34fb': 'Humidity',
  '00002a76-0000-1000-8000-00805f9b34fb': 'UV Index',
  '00002a30-0000-1000-8000-00805f9b34fb': 'Manufacturer Name String',
};

export function getShortUuid(uuid: string): string {
  if (uuid.length === 36) {
    return uuid.substring(4, 8).toUpperCase();
  }
  return uuid.substring(0, 8).toUpperCase();
}

export function getServiceName(uuid: string): string {
  const lower = uuid.toLowerCase();
  return KNOWN_SERVICES[lower] || `Unknown Service (${getShortUuid(uuid)})`;
}

export function getCharacteristicName(uuid: string): string {
  const lower = uuid.toLowerCase();
  return KNOWN_CHARACTERISTICS[lower] || `Unknown Char (${getShortUuid(uuid)})`;
}

export function hexToBytes(hex: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  return bytes;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ')
    .toUpperCase();
}

export function bytesToString(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

export function stringToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  } as Intl.DateTimeFormatOptions);
}

export function getSignalStrength(rssi: number): { label: string; color: string } {
  if (rssi >= -50) return { label: 'Excellent', color: 'text-green-400' };
  if (rssi >= -60) return { label: 'Good', color: 'text-green-300' };
  if (rssi >= -70) return { label: 'Fair', color: 'text-yellow-400' };
  if (rssi >= -80) return { label: 'Weak', color: 'text-orange-400' };
  return { label: 'Very Weak', color: 'text-red-400' };
}

export function getSignalBars(rssi: number): number {
  if (rssi >= -50) return 4;
  if (rssi >= -60) return 3;
  if (rssi >= -70) return 2;
  return 1;
}
