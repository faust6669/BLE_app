# BLE Device Monitor

A web-based Bluetooth Low Energy (BLE) device scanner and traffic analyzer built with React, TypeScript, and Tailwind CSS.

![BLE Monitor](https://img.shields.io/badge/BLE-4.0%2B-blue) ![React](https://img.shields.io/badge/React-18-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![Tailwind](https://img.shields.io/badge/Tailwind-4-06b6d4)

## Features

- 🔍 **Device Scanner** — Discover nearby BLE devices using the Web Bluetooth API
- 🔗 **Connection Management** — Connect/disconnect to devices with GATT service discovery
- 📊 **Traffic Monitoring** — Real-time logging of all BLE communications (reads, writes, notifications)
- 📈 **Statistics Dashboard** — Visual breakdown of device counts, connections, and traffic
- 📶 **Signal Strength** — RSSI display with signal bars and quality indicators
- 🧬 **GATT Explorer** — Browse services and characteristics with UUID resolution
- 🎛️ **Interactive Controls** — Read, write, and subscribe to characteristic notifications
- 🔎 **Filterable Logs** — Search and filter traffic logs by type and content

## Screenshots

The app features a dark-themed monitoring dashboard with three panels:
- **Left**: Scanner, statistics, and BLE protocol info
- **Center**: Device list with expandable service/characteristic tree
- **Right**: Real-time traffic log with filtering

## Prerequisites

- **Browser**: Chrome, Edge, or Opera (Web Bluetooth API support required)
- **Protocol**: Must be served over HTTPS or `localhost`
- **Hardware**: Bluetooth 4.0+ adapter with BLE support

> ⚠️ **Note**: Web Bluetooth API requires explicit user interaction for security. The browser's native device picker will appear when scanning.

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Build

```bash
npm run build
```

The production build will be output to the `dist/` directory.

## Project Structure

```
src/
├── App.tsx                    # Main application component
├── main.tsx                   # Entry point
├── index.css                  # Global styles
├── types.ts                   # TypeScript interfaces
├── components/
│   ├── Header.tsx             # App header with stats
│   ├── ScanPanel.tsx          # BLE device scanner
│   ├── DeviceList.tsx         # Device list with GATT explorer
│   ├── TrafficLogPanel.tsx    # Traffic monitoring panel
│   ├── StatsPanel.tsx         # Statistics dashboard
│   └── InfoPanel.tsx          # BLE protocol information
├── hooks/
│   └── useBLE.ts              # Core BLE logic hook
└── utils/
    └── bleUtils.ts            # UUID lookup, formatting utilities
```

## How It Works

### Web Bluetooth API

The app uses the [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API) to communicate with BLE devices. Due to browser security policies:

1. Scanning requires user interaction (button click)
2. The browser shows a native device picker
3. Users must explicitly grant access to each device

### GATT Structure

BLE devices expose data through a hierarchy:

```
Device → Services → Characteristics → Descriptors
```

- **Services** group related functionality (e.g., Heart Rate, Battery)
- **Characteristics** hold individual data points (e.g., Heart Rate Measurement)
- Each has a UUID that identifies its type and purpose

### Traffic Types

| Type | Icon | Description |
|------|------|-------------|
| Read | 🔵 | Reading a characteristic value |
| Write | 🟡 | Writing data to a characteristic |
| Notify | 🟣 | Receiving notification updates |
| Connect | 🟢 | GATT server connection established |
| Disconnect | 🔴 | GATT server disconnected |
| Scan | 🔵 | Device discovery |
| Error | 🔴 | Operation failed |

## Supported Browsers

| Browser | Support |
|---------|---------|
| Chrome 56+ | ✅ Full |
| Edge 79+ | ✅ Full |
| Opera 43+ | ✅ Full |
| Firefox | ❌ Not supported |
| Safari | ❌ Not supported |

## Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type safety
- **Tailwind CSS 4** — Styling
- **Vite** — Build tool
- **Lucide React** — Icons
- **Web Bluetooth API** — BLE communication

## Known Limitations

- Background scanning is not supported (requires user interaction per scan)
- Cannot scan for devices without user permission
- RSSI values may not be accurate on all platforms
- Some characteristics may not be readable/writable depending on device permissions

## License

MIT License — see [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
