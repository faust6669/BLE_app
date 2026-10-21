# Contributing to BLE Device Monitor

Thank you for your interest in contributing to BLE Device Monitor! This document provides guidelines and information for contributors.

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to maintain a welcoming and inclusive community.

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates. When creating a bug report, include:

- Clear descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Browser and version
- Operating system
- Screenshots if applicable

### Suggesting Features

Feature suggestions are welcome! Please provide:

- Clear description of the feature
- Use case or problem it solves
- Any implementation ideas you have

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ble-device-monitor.git

# Navigate to project
cd ble-device-monitor

# Install dependencies
npm install

# Start development server
npm run dev
```

## Code Style

- Use TypeScript for all new code
- Follow existing code formatting (Prettier/ESLint)
- Write meaningful commit messages
- Add comments for complex logic
- Keep components focused and modular

## Testing

Before submitting a PR:

- Ensure the app builds without errors (`npm run build`)
- Test in Chrome/Edge (Web Bluetooth supported browsers)
- Verify no console errors
- Test with actual BLE devices if possible

## Project Structure

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── types.ts       # TypeScript definitions
└── App.tsx        # Main app component
```

## Commit Messages

Use conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example: `feat: add RSSI signal strength visualization`

## Questions?

Feel free to open an issue for any questions not covered here.

Thank you for contributing! 🎉
