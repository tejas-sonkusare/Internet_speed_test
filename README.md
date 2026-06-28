# Quantum Speed Test — Vercel Deployment

## Quick Deploy

1. Extract this zip
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel` inside this folder
4. Follow the prompts — done!

## Manual (Vercel Dashboard)

1. Go to https://vercel.com/new
2. Choose "Import Third-Party Git Repository" → or drag-and-drop this folder
3. No environment variables needed
4. Framework: **Other**
5. Deploy

## Structure

```
├── api/
│   └── index.js        ← Express API (ping / download / upload)
├── public/
│   ├── index.html
│   └── assets/
├── vercel.json          ← Routing config
└── package.json
```
