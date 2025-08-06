# Easy Resume Builder

This is a simple resume builder built with Next.js and Tailwind CSS.

## Requirements

- **Node.js**: 18.x or 20.x (recommended: 20.x)
- **npm**: 9.x or higher

## Developer Recovery Steps

### Cache Issues or Dependency Problems

If you encounter build errors, dependency conflicts, or other issues, follow these steps to completely reset your environment:

```bash
# 1. Remove all cached data and dependencies
rm -rf node_modules
rm -rf .next
rm package-lock.json

# 2. Clear npm cache
npm cache clean --force

# 3. Clear Next.js cache (if exists)
npx next clean

# 4. Reinstall dependencies
npm install
```

### ⚠️ Important: React Version Warning

**DO NOT upgrade React to version 19.x** until all project dependencies officially announce support for React 19. This project is intentionally locked to React 18.2.0 due to compatibility requirements with current dependencies.

The following overrides are in place to prevent accidental upgrades:
```json
"overrides": {
  "react": "18.2.0",
  "react-dom": "18.2.0"
}
```

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

This project is distributed under the MIT License. You are free to use, modify, and distribute the software in accordance with the license terms.
