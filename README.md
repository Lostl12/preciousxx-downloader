# Deployment Guide

This project is now set up to deploy cleanly on both **Render** and **Railway**.

## Production setup

- **Build command:** `npm install && npm run build`
- **Start command:** `npm start`
- **Node version:** `20`
- **Health check:** `/health`

The app builds with Vite, then serves the compiled `dist` output through `index.js`.

## Why this works

- `index.js` serves the production build on `process.env.PORT`
- `render.yaml` provides Render-ready defaults
- `nixpacks.toml` gives Railway a clean build/start setup
- Deep links like `/dashboard` fall back to `index.html`
- Missing asset files still return `404` correctly

## Deploy to Render

Use these settings if you create the service manually:

- **Environment:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Health Check Path:** `/health`

Or just keep the included `render.yaml` in the repo root.

## Deploy to Railway

Railway should pick this up automatically from:

- `package.json` scripts
- `nixpacks.toml`
- `.node-version`

If Railway asks for commands:

- **Build:** `npm install && npm run build`
- **Start:** `npm start`

## Local production test

```bash
npm install
npm run build
npm start
```

Then open `http://localhost:3000`.
