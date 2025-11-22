# Joshua AI Robotics Website

This repository hosts the official website for Joshua AI Robotics, built with Vite and React.

## Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- Yarn

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Start the development server:
```bash
yarn dev
```

3. Build for production:
```bash
yarn build
```

4. Preview production build:
```bash
yarn preview
```

## Deployment

### Automatic Deployment (Recommended)

This site is hosted on GitHub Pages and automatically deploys via GitHub Actions when you push to the `main` branch.

**Setup Instructions:**
1. Go to your repository Settings → Pages
2. Under "Source", select "GitHub Actions"
3. The workflow will automatically build and deploy on every push to `main`

The GitHub Actions workflow:
- Builds the React app using Vite
- Copies `CNAME` and `.nojekyll` files to the dist folder
- Deploys to GitHub Pages
- Verifies the build output

### Manual Deployment (Alternative)

If you prefer to deploy manually:
```bash
yarn deploy
```

This requires the `gh-pages` package to be installed globally or as a dev dependency (already included).

### Build Verification

To test the production build locally:
```bash
yarn build
yarn preview
```

This will build the app and serve it locally so you can verify everything works before deploying.

### Custom Domain

The domain `joshua-ai-robotics.org` is configured via the `CNAME` file. The build process automatically copies this file to the dist folder for GitHub Pages deployment.
