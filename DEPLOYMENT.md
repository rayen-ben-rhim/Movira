# Movira - Deployment Guide

## Overview

Movira is a Next.js 15 application for discovering movies and TV shows. This guide covers deployment to various platforms.

## Prerequisites

1. **TMDB API Key**: Get one from [The Movie Database (TMDB)](https://www.themoviedb.org/settings/api)
2. **Clerk Authentication**: Set up authentication at [Clerk](https://clerk.com/)
3. **Node.js 18.x or higher**

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `CLERK_SECRET_KEY`: Your Clerk secret key
- `NEXT_PUBLIC_TMDB_API_KEY`: Your TMDB API key
- `NEXT_PUBLIC_BASE_URL`: TMDB API base URL (default: https://api.themoviedb.org/3)
- `NEXT_PUBLIC_IMAGE_BASE_URL`: TMDB image base URL (default: https://image.tmdb.org/t/p/w500)
- `NEXT_PUBLIC_BACKDROP_BASE_URL`: TMDB backdrop URL (default: https://image.tmdb.org/t/p/w1920_and_h800_multi_faces)

## Build Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start

# Development server
npm run dev
```

## Platform-Specific Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard

### Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000

CMD ["npm", "start"]
```

## Features

- **Authentication**: Clerk-based user authentication
- **Movie Discovery**: Browse trending movies and TV shows
- **Favorites**: Save favorite content (stored in localStorage)
- **Responsive Design**: Mobile-first responsive design
- **Modern UI**: Beautiful animations and modern interface
- **Fast Performance**: Optimized for speed with Next.js 15

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **API**: The Movie Database (TMDB)
- **Icons**: Lucide React
- **Deployment**: Optimized for Vercel

## Post-Deployment Checklist

- [ ] Verify environment variables are set correctly
- [ ] Test authentication flow
- [ ] Verify TMDB API calls are working
- [ ] Check responsive design on different devices
- [ ] Test favorites functionality
- [ ] Verify all pages load correctly

## Support

For issues or questions, please check the repository's issues section.
