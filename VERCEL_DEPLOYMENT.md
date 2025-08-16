# Movira - Vercel Deployment Guide

## Quick Deployment Steps

### 1. Prerequisites
- GitHub account with your repository
- Vercel account (free at [vercel.com](https://vercel.com/))
- TMDB API key from [themoviedb.org](https://www.themoviedb.org/settings/api)
- Clerk account for authentication from [clerk.com](https://clerk.com/)

### 2. Deploy to Vercel

#### Option A: One-Click Deploy (Recommended)
1. Click this deploy button: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rayen-ben-rhim/Movira.git&env=NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY,NEXT_PUBLIC_TMDB_API_KEY)

#### Option B: Manual Deployment
1. Go to [vercel.com](https://vercel.com/) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Next.js project
5. Configure environment variables (see below)
6. Click "Deploy"

### 3. Environment Variables Setup

In your Vercel dashboard, add these environment variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_secret_here
NEXT_PUBLIC_TMDB_API_KEY=your_actual_tmdb_api_key_here
NEXT_PUBLIC_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
NEXT_PUBLIC_BACKDROP_BASE_URL=https://image.tmdb.org/t/p/w1920_and_h800_multi_faces
```

### 4. Getting Your API Keys

#### TMDB API Key:
1. Go to [themoviedb.org](https://www.themoviedb.org/)
2. Create an account and verify email
3. Go to Settings → API
4. Request an API key (choose "Developer")
5. Fill out the form (you can use "Personal/Educational" for type)
6. Copy the API Key (v3 auth)

#### Clerk Authentication:
1. Go to [clerk.com](https://clerk.com/) and sign up
2. Create a new application
3. In your dashboard, go to "API Keys"
4. Copy the "Publishable key" and "Secret key"
5. In Clerk dashboard, configure your domain:
   - Go to "Domains" in sidebar
   - Add your Vercel domain (e.g., `your-app.vercel.app`)

### 5. Deployment Settings

Vercel will automatically:
- ✅ Detect Next.js framework
- ✅ Set build command: `npm run build`
- ✅ Set output directory: `.next`
- ✅ Set install command: `npm install`
- ✅ Use Node.js 18.x runtime

### 6. Custom Domain (Optional)

After deployment:
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update Clerk domain settings to include your custom domain

### 7. Automatic Deployments

Vercel will automatically deploy when you:
- Push to your main branch
- Merge pull requests
- Make changes to your repository

### 8. Environment Management

For different environments:
- **Preview deployments**: Use same environment variables
- **Production**: Make sure all environment variables are set
- **Development**: Use your local `.env` file

### 9. Monitoring & Analytics

Vercel provides:
- Automatic HTTPS
- Global CDN
- Real-time analytics
- Function logs
- Performance insights

### 10. Troubleshooting

Common issues:

**Build Fails:**
- Check environment variables are set correctly
- Ensure all dependencies are in package.json
- Check build logs in Vercel dashboard

**Authentication Issues:**
- Verify Clerk keys are correct
- Check domain is added in Clerk dashboard
- Ensure HTTPS is working

**API Issues:**
- Verify TMDB API key is valid
- Check API quotas aren't exceeded
- Ensure environment variables have NEXT_PUBLIC_ prefix for client-side usage

### 11. Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] Authentication works (sign up/sign in)
- [ ] Movies and TV shows load
- [ ] Search functionality works
- [ ] Favorites can be added/removed
- [ ] Mobile responsive design works
- [ ] All pages are accessible

Your Movira app is now live on Vercel! 🎉

**Production URL:** `https://your-app-name.vercel.app`
