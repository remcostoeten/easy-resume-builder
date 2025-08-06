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

## Environment Variables

Copy the example environment file and configure your variables:

```bash
cp .env.example .env.local
```

### Required Environment Variables

- `DATABASE_URL`: Database connection string
- `BA_SECRET`: Basic auth secret
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GITHUB_CLIENT_ID`: GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET`: GitHub OAuth client secret
- `DOMAIN`: Your domain URL (defaults to http://localhost:3000 for local development)

### Optional Environment Variables

- `NEXT_PUBLIC_API_URL`: API base URL for server-side rendering (optional for local development)

#### Production Deployment: NEXT_PUBLIC_API_URL

For production deployments, set `NEXT_PUBLIC_API_URL` to your production domain:

```bash
# Example for production
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

This environment variable is used for server-side API calls during build time and server-side rendering. For local development, the application automatically uses the current origin, so this variable is not required.

**Deployment platforms:**
- **Vercel**: Add to Environment Variables in project settings
- **Netlify**: Add to Site settings > Environment variables
- **Docker**: Include in your Dockerfile or docker-compose.yml
- **Other platforms**: Set via your platform's environment variable configuration

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

This project is distributed under the MIT License. You are free to use, modify, and distribute the software in accordance with the license terms.
