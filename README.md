# 🏀 DreamTeam - Indiana Pacers Fan Platform

A comprehensive web application for Indiana Pacers fans to explore player statistics, engage in daily challenges, manage rewards, and connect with the community through chat. Features real-time data synchronization, player unlock mechanics, and gamification elements.

**Live Demo:** Coming Soon  
**Repository:** https://github.com/n423DreamTeam/dreamTeamPRT2Laptop

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Configuration](#configuration)
7. [Database Schema](#database-schema)
8. [API Integration](#api-integration)
9. [Game Mechanics](#game-mechanics)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)
12. [Contributing](#contributing)

---

## 🎯 Project Overview

DreamTeam is an interactive Indiana Pacers fan platform that combines real-time NBA statistics with gamification mechanics. Users can:

- **Explore Players:** Browse the current Pacers roster with detailed stats and achievements
- **Daily Challenges:** Complete puzzle-based challenges to earn points
- **Player Unlocks:** Unlock premium players by earning enough points
- **Rewards System:** Collect rewards as they progress through challenges
- **Leaderboards:** Compete with other fans and track your ranking
- **Community Chat:** Connect with other Pacers fans in real-time

The application uses Firebase for authentication, data storage, and real-time synchronization, while integrating with the Ball Don't Lie NBA API for current player statistics.

---

## ✨ Features

### 🔐 Authentication

- **Email/Password Authentication** via Firebase
- **User Profile Creation** with username, display name, and profile picture
- **Persistent Session** using Firebase Auth tokens
- **Account Management** page to update profile information

### 🏀 Player Exploration

- **Complete Pacers Roster** with 18+ players
- **Detailed Player Profiles** including:
  - Season statistics (PPG, RPG, APG, Steals, FG%, 3P%, FT%)
  - Physical attributes (Height, Weight, Age)
  - Career information (College, Draft Year, Experience)
  - Notable achievements and awards
- **Search & Filter** functionality by position
- **Pagination** with 6 players per page
- **Responsive Grid Layout** that works on all devices

### 🎮 Daily Challenges

- **Stats-Based Puzzle Game** on the dashboard
- **Current Roster Integration** combining local player data with API statistics
- **Random Stats Game** where users guess which player matches the given stats
- **Points System** (10-50 points per correct answer)
- **Challenge Completion Modal** with animations and notifications
- **Daily Challenge Alert** when users log in

### 🔓 Player Unlock System

- **Tiered Unlock Requirements** based on player performance:
  - **Tier 1 (200 pts):** Tyrese Haliburton, Pascal Siakam
  - **Tier 2 (150 pts):** Benedict Mathurin
  - **Tier 3 (100 pts):** Aaron Nesmith, Quenton Jackson
  - **Tier 4 (50 pts):** Obi Toppin
  - **Tier 5 (Free):** Remaining roster
- **Progress Tracking** in localStorage and Firebase
- **Unlock Notifications** showing newly unlocked players
- **Visual Indicators** for locked vs. unlocked status

### 🎁 Rewards System

- **Reward Collection** as challenges are completed
- **Toast Notifications** displaying earned rewards
- **Animated Alerts** with smooth slide-in/slide-out animations
- **Persistent Storage** of reward progress in Firebase
- **Rewards Dashboard** viewing all collected rewards

### 📊 Leaderboard

- **Real-Time Rankings** of all players by points earned
- **User Statistics Display** including:
  - Username and profile picture
  - Total points
  - Number of wins
- **Top Players Highlighted** with visual styling
- **Auto-Updating** as users complete challenges

### 💬 Community Chat

- **Real-Time Messaging** via Firebase Firestore
- **User Presence** showing who's online
- **Message Actions:**
  - ✏️ **Edit Messages** - Update your message text
  - 🗑️ **Delete Messages** - Remove your messages
  - **(edited)** Label - Shows when messages have been modified
- **Message Threading** with timestamps
- **User Avatars** with initials
- **Daily Challenge Date** displayed in chat header
- **Message Persistence** in Firestore database

### 🎨 User Interface

- **Dark Theme** with Pacers brand colors (Gold #ffcb05, Blue #5b7fff)
- **Responsive Design** for mobile, tablet, and desktop
- **Smooth Animations** with CSS transitions
- **Gradient Backgrounds** and modern styling
- **Navigation Bar** with user menu and authentication status
- **Modal Popups** for player profiles and challenge results

---

## 🛠 Tech Stack

### Frontend

- **HTML5** - Semantic markup
- **CSS3 & SCSS** - Styling with CSS variables and mixins
- **Vanilla JavaScript (ES6+)** - Core functionality
- **Vite** - Build tool and dev server

### Backend & Services

- **Firebase Authentication** - User sign-up and login
- **Firestore Database** - Real-time data storage
- **Firebase Cloud Storage** - Image hosting
- **Ball Don't Lie NBA API** - Real player statistics
- **Node.js API Proxy** - CORS-compliant backend

### DevOps & Deployment

- **Firebase Hosting** - Production deployment
- **Cloud Firestore Rules** - Security and permissions
- **Cloud Storage Rules** - File access control

### Development Tools

- **Sass/SCSS** - CSS preprocessing
- **Concurrently** - Run multiple servers simultaneously
- **Firebase CLI** - Deployment and configuration

---

## 📁 Project Structure

```
dreamTeamPRT2Laptop/
├── public/                          # Static assets
│   ├── index.html                   # Landing page
│   └── images/
├── src/                             # Source files
│   ├── main.js                      # Entry point & authentication
│   ├── account.html                 # User account/profile page
│   ├── account.js
│   ├── chat.html                    # Community chat interface
│   ├── chat.js                      # Chat functionality
│   ├── dashboard.html               # Daily challenges & stats game
│   ├── dashboard.js                 # Challenge logic & player unlocks
│   ├── leaderboard.html             # Player rankings
│   ├── leaderboard.js
│   ├── login.html                   # Login page
│   ├── players.html                 # Player roster grid
│   ├── players.js                   # Player listing & filtering
│   ├── player-profile.html          # Individual player profile
│   ├── player-profile.js
│   ├── rewards.html                 # Rewards collection
│   ├── rewards.js
│   ├── signup.html                  # Registration page
│   ├── css/
│   │   └── styles.css               # Compiled CSS
│   ├── scss/
│   │   ├── styles.scss              # Main SCSS file
│   │   ├── variables.scss           # Color & sizing variables
│   │   ├── mixins.scss              # Reusable SCSS mixins
│   │   ├── animations.scss          # Animation keyframes
│   │   ├── structure.scss           # Grid & layout
│   │   ├── nav.scss                 # Navigation styling
│   │   ├── login.scss               # Auth pages styling
│   │   ├── dashboard.scss           # Challenge game styling
│   │   ├── players.scss             # Player grid styling
│   │   ├── chat.scss                # Chat interface styling
│   │   ├── leaderboard.scss         # Rankings styling
│   │   ├── rewards.scss             # Rewards page styling
│   │   └── footer.scss              # Footer styling
│   ├── images/
│   │   ├── player-photos/           # Player profile images
│   │   └── pacerslogo.png
│   ├── fonts/                       # Custom fonts
│   └── favicon.ico
├── functions/                       # Firebase Cloud Functions
│   ├── index.js
│   └── package.json
├── scripts/                         # Utility scripts
│   ├── create_test_user.js          # Generate test accounts
│   └── smoke_test.js                # Automated testing
├── firebase.json                    # Firebase config
├── firestore.rules                  # Database security rules
├── storage.rules                    # Cloud Storage permissions
├── FIREBASE_RULES.md                # Rules documentation
├── SETUP.md                         # Initial setup guide
├── SMOKE_TEST.md                    # Testing guide
├── api.js                           # Node.js API proxy
├── cors.json                        # CORS configuration
├── dev-server.js                    # Dev server config
├── vite.config.js                   # Vite bundler config
├── index.html                       # Landing page entry
├── package.json                     # Node dependencies
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **Firebase Account** (https://firebase.google.com)
- **Ball Don't Lie API Key** (https://balldontlie.io/api)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/n423DreamTeam/dreamTeamPRT2Laptop.git
   cd dreamTeamPRT2Laptop
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Compile SCSS**

   ```bash
   npm run compile-sass
   ```

   Or for watch mode:

   ```bash
   npm run compile-sass
   # This will automatically compile on file changes
   ```

4. **Start Development Servers**

   **Option A: Run Both Servers Together**

   ```bash
   npm run dev:full
   ```

   This starts:

   - Backend API on `http://localhost:3001`
   - Frontend on `http://localhost:5173`

   **Option B: Run Separately**

   Terminal 1 - API Server:

   ```bash
   npm run api
   ```

   Terminal 2 - Frontend Dev Server:

   ```bash
   npm run dev
   ```

5. **Access the Application**

   - Open your browser to `http://localhost:5173`
   - You should see the DreamTeam landing page

6. **Create a Test Account**
   ```bash
   node scripts/create_test_user.js
   ```
   This creates a test user for development.

---

## ⚙️ Configuration

### Firebase Setup

1. **Create Firebase Project**

   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project named "n423-6048d" (or your preferred name)

2. **Enable Services**

   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Cloud Storage

3. **Get Firebase Config**

   - Go to Project Settings
   - Copy your Firebase configuration
   - This should be in your `src/main.js` or a separate config file

4. **Firebase Credentials** (Already in project)
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "n423-6048d.firebaseapp.com",
     projectId: "n423-6048d",
     storageBucket: "n423-6048d.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID",
   };
   ```

### Ball Don't Lie API Key

1. **Get Your API Key**

   - Visit https://balldontlie.io/api
   - Sign up for a free account
   - Copy your API key from the dashboard

2. **Configure API Key**

   - Open `api.js`
   - Find: `const API_KEY = "YOUR_API_KEY";`
   - Replace with your actual key

3. **Test the API**
   ```bash
   curl http://localhost:3001/api/players?team_id=12
   ```
   Should return a list of Pacers players.

### Environment Variables (Optional)

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_PROJECT_ID=n423-6048d
```

---

## 📊 Database Schema

### Firestore Collections

#### `users` Collection

Stores user profile information and progression data.

```javascript
{
  userId: {
    username: "player_name",           // Unique username
    displayName: "Player Display",      // Full name
    email: "user@example.com",
    photoURL: "https://...",           // Profile picture
    points: 1250,                       // Total points earned
    wins: 24,                           // Challenge completions
    unlockedPlayers: ["haliburton", "mathurin", "nesmith", ...],
    rewards: [
      {
        name: "First Win",
        date: "2024-01-15",
        description: "Complete your first challenge"
      }
    ],
    createdAt: Timestamp,
    updatedAt: Timestamp
  }
}
```

#### `messages` Collection

Real-time chat messages between users.

```javascript
{
  messageId: {
    uid: "firebase_user_id",           // Message author
    displayName: "Player Name",
    username: "@username",
    text: "Message content here...",
    timestamp: Timestamp,
    edited: false,                      // true if message was edited
    photoURL: "https://...",           // User profile picture
    userInitials: "PN"
  }
}
```

---

## 🔌 API Integration

### Ball Don't Lie NBA API

The application integrates with the Ball Don't Lie API to fetch real player statistics.

#### Endpoints Used

**Get Team Players**

```
GET https://api.balldontlie.io/api/v1/players?team_ids[]=12
```

- Returns all players on the Pacers (team_id: 12)
- Used to populate the player roster

**Get Player Season Stats**

```
GET https://api.balldontlie.io/api/v1/season_averages?season=2024&player_ids[]=123
```

- Returns season statistics for specified players
- Includes PPG, RPG, APG, FG%, 3P%, FT%, etc.

#### API Response Example

```json
{
  "data": [
    {
      "id": 258,
      "first_name": "Tyrese",
      "last_name": "Haliburton",
      "position": "G",
      "height": "6'4\"",
      "weight": "185",
      "jersey_number": 0,
      "college": "Iowa State",
      "country": "USA",
      "draft_year": 2020,
      "team": {
        "id": 12,
        "abbreviation": "IND",
        "city": "Indiana",
        "conference": "East",
        "division": "Central",
        "full_name": "Indiana Pacers",
        "name": "Pacers"
      }
    }
  ]
}
```

### Local API Proxy

The `api.js` file provides CORS-compliant endpoints for the frontend.

**Backend Endpoints**

- `GET /api/players?team_id=12` - Get all team players
- `GET /api/stats?season=2024&player_ids=1,2,3` - Get player season stats
- `POST /api/search?name=haliburton` - Search for players

---

## 🎮 Game Mechanics

### Daily Challenge System

#### How It Works

1. **Challenge Generation**

   - Each day, a new challenge is created
   - Challenge type: Match player to stats
   - Stats are randomly selected from current Pacers players

2. **Player Progression**

   - User reads stats: "20.1 PPG, 3.9 RPG, 10.8 APG"
   - User selects from 4 player options
   - If correct: +10-50 points (random)
   - If incorrect: Challenge can be retried

3. **Points Earned**

   - Points stored in user's Firestore document
   - Points update in real-time across all pages
   - Contributes to leaderboard ranking

4. **Modal Feedback**
   - Shows "Challenge Complete!" modal
   - Displays points earned
   - Shows newly unlocked players (if any)
   - Displays reward toast notification

### Player Unlock System

#### Unlock Tiers

Players are locked by performance tier:

| Tier | PPG Range | Players                 | Points Required |
| ---- | --------- | ----------------------- | --------------- |
| 1    | 20+ PPG   | Haliburton, Siakam      | 200             |
| 2    | 14-20 PPG | Mathurin                | 150             |
| 3    | 10-14 PPG | Nesmith, Quenton        | 100             |
| 4    | 5-10 PPG  | Toppin, Huff, McConnell | 50              |
| 5    | <5 PPG    | Others                  | Free (0)        |

#### Unlock Mechanics

- **Automatic Unlocking**: When user reaches required points, player is automatically unlocked
- **Visual Indicators**: Locked players show 🔒 badge on player cards
- **Unlock Notification**: Gold-bordered box shows "YOU HAVE UNLOCKED THESE PLAYERS!" with player names
- **Progress Persistence**: Unlocked status saved to both localStorage and Firestore

#### Example Progression

```
User starts: 0 points, 0 players unlocked
Complete challenge: +15 points (15 total)
Complete challenge: +25 points (40 total)
Complete challenge: +35 points (75 total)
Complete challenge: +30 points (105 total)
  → Aaron Nesmith UNLOCKED! 🎉
Complete challenges: +50 points (155 total)
  → Benedict Mathurin UNLOCKED! 🎉
```

### Reward System

#### Reward Types

1. **First Win** - Complete your first challenge
2. **Milestone Rewards** - Every 50 points
3. **Player Unlock Bonus** - When unlocking premium players
4. **Daily Streak** - Complete challenges on consecutive days

#### Reward Display

- **Toast Notification**: Bottom-right corner
- **Animation**: Slides in from right, displays for 4 seconds
- **Sound**: Optional notification sound (can be enabled)
- **Rewards Page**: View all collected rewards with dates and descriptions

---

## 🚀 Deployment

### Option 1: Firebase App Hosting (Recommended) ⭐

Firebase
App Hosting is a fully managed hosting platform that provides automatic deployments, free SSL certificates, CDN distribution, and seamless Firebase integration.

#### Why Firebase App Hosting?

- **Automatic Deployments** - Deploy directly from GitHub
- **Zero Configuration SSL** - HTTPS by default
- **Global CDN** - Fast content delivery worldwide
- **Firebase Integration** - Direct access to Firestore, Auth, Storage
- **Free Tier** - Up to 180 build minutes/month
- **Environment Variables** - Secure secret management
- **Preview URLs** - Test PRs before merging
- **Auto Rollback** - Revert failed deployments instantly

#### Prerequisites

- GitHub account with your repository
- Firebase project (n423-6048d)
- Firebase CLI installed

#### Step 1: Connect GitHub Repository

1. **Go to Firebase Console**

   - Visit https://console.firebase.google.com
   - Select your project (n423-6048d)
   - Go to Build > App Hosting

2. **Click "Create Repository Connection"**

   - Select "GitHub" as source
   - Authorize Firebase to access your GitHub account
   - Select your repository: `n423DreamTeam/dreamTeamPRT2Laptop`
   - Select branch: `main` (or your production branch)

3. **Confirm Permissions**
   - Firebase needs permission to:
     - Push commits for automatic deployments
     - Monitor pull requests for preview deployments
     - Read your repository contents

#### Step 2: Configure Build Settings

1. **In Firebase Console, set Build Configuration:**

   ```yaml
   Runtime: Node.js 20
   Build Command: npm run build
   Output Directory: dist
   ```

2. **Key Configuration Details:**
   - **Runtime**: Node.js 20 (supports ES modules)
   - **Build Command**: `npm run build` compiles your Vite app
   - **Output Directory**: `dist/` (where Vite outputs production build)
   - **Environment Variables**: Set in next step

#### Step 3: Set Environment Variables

1. **In App Hosting Settings, add these secrets:**

   ```
   VITE_API_URL = http://localhost:3001
   VITE_FIREBASE_API_KEY = your_firebase_api_key
   VITE_FIREBASE_PROJECT_ID = n423-6048d
   BALL_DONT_LIE_API_KEY = your_ball_dont_lie_key
   ```

2. **For Production (different from development):**

   ```
   VITE_API_URL = https://your-api-server.com
   ```

3. **Add secrets via Firebase CLI:**
   ```bash
   firebase apphosting:secrets:set BALL_DONT_LIE_API_KEY
   # Follow prompts to enter your API key
   ```

#### Step 4: Configure Cloud Functions (Backend API)

Your `api.js` needs to run as a Cloud Function for the backend:

1. **Create Cloud Function wrapper** (`functions/api.js`):

   ```javascript
   const functions = require("firebase-functions");
   const express = require("express");
   const cors = require("cors");
   const fetch = require("node-fetch");

   const app = express();
   app.use(cors());

   const API_KEY = process.env.BALL_DONT_LIE_API_KEY;

   app.get("/api/players", async (req, res) => {
     const teamId = req.query.team_id || 12;
     try {
       const response = await fetch(
         `https://api.balldontlie.io/api/v1/players?team_ids[]=${teamId}`,
         { headers: { Authorization: API_KEY } }
       );
       const data = await response.json();
       res.json(data);
     } catch (err) {
       res.status(500).json({ error: err.message });
     }
   });

   exports.api = functions.https.onRequest(app);
   ```

2. **Update `functions/package.json`:**

   ```json
   {
     "name": "functions",
     "version": "1.0.0",
     "dependencies": {
       "firebase-functions": "^4.7.0",
       "firebase-admin": "^12.0.0",
       "express": "^4.18.2",
       "cors": "^2.8.5",
       "node-fetch": "^2.6.7"
     }
   }
   ```

3. **Install dependencies:**
   ```bash
   cd functions
   npm install
   ```

#### Step 5: Update firebase.json

Configure your deployment settings:

```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "node20"
  },
  "apphosting": {
    "locations": {
      "us-east1": {}
    }
  }
}
```

#### Step 6: Deploy

**First Time Deployment:**

```bash
firebase deploy
```

**Automatic Deployments (via GitHub):**

- Any push to `main` automatically deploys
- PRs get preview URLs automatically
- No manual deployment needed!

**Manual Deployment (if needed):**

```bash
npm run build
firebase deploy
```

#### Step 7: Access Your Site

After deployment completes:

1. **Go to Firebase Console**

   - Build > App Hosting
   - Copy your URL (format: `https://n423-6048d-default.firebaseapp.com`)

2. **Or Find in CLI Output:**

   ```
   ✔  Deploy complete!

   Project Console: https://console.firebase.google.com/project/n423-6048d/overview
   Hosting URL: https://n423-6048d-default.firebaseapp.com
   ```

3. **Custom Domain (Optional):**
   - In Firebase Console > Hosting > Domains
   - Add custom domain
   - Follow DNS setup instructions

#### Preview Deployments for Pull Requests

When you create a PR:

1. **Firebase automatically creates a preview URL**

   - Format: `https://pr-123--n423-6048d-default.firebaseapp.com`
   - Posted as comment on PR

2. **Benefits:**
   - Test changes before merging
   - Share with team for review
   - Each PR gets unique URL
   - Auto-deleted after PR closes

#### Managing App Hosting

**View Deployment History:**

```bash
firebase apphosting:builds:list
```

**Rollback to Previous Version:**

```bash
firebase apphosting:builds:rollback [build-id]
```

**View Logs:**

```bash
firebase apphosting:builds:log [build-id]
```

---

### Option 2: Traditional Firebase Hosting

If you only want frontend hosting (without backend):

#### Setup

1. **Build the Application**

   ```bash
   npm run build
   ```

2. **Deploy to Firebase**

   ```bash
   firebase deploy --only hosting
   ```

3. **Your site will be available at:**
   ```
   https://n423-6048d.web.app
   ```

#### Backend API Considerations

- You must host the API separately (Heroku, Render, Railway, etc.)
- Update `api.js` to use your hosted API URL
- Configure CORS headers in `api.js`

---

### Option 3: Docker + Cloud Run

For advanced setups with custom backend:

1. **Create Dockerfile:**

   ```dockerfile
   FROM node:20
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "run", "api"]
   ```

2. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy dreamteam-api \
     --source . \
     --platform managed \
     --region us-east1
   ```

---

### Production Checklist

- [ ] Update Firebase configuration for production
- [ ] Set Ball Don't Lie API key in Firebase secrets
- [ ] Update Firestore security rules for production access
- [ ] Configure Cloud Storage rules for image uploads
- [ ] Set up Firebase authentication providers
- [ ] Enable HTTPS/SSL certificate (automatic with App Hosting)
- [ ] Configure custom domain (optional)
- [ ] Set up analytics and monitoring
- [ ] Test all features in production environment
- [ ] Configure error logging and reporting
- [ ] Set up GitHub integration for automatic deployments
- [ ] Configure environment variables for production
- [ ] Test preview deployments with PRs
- [ ] Monitor build minutes and set up alerts

### Monitoring & Maintenance

**Firebase Console**

- Monitor Firestore database usage
- Check Cloud Storage for file space
- Review authentication logs
- Track Cloud Functions invocations

**Analytics**

- Track user signups and activity
- Monitor feature usage
- Analyze user retention

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Failed to edit message: Missing or insufficient permissions"

**Cause**: Firestore rules don't allow message updates

**Solution**:

- Verify `firestore.rules` has correct update permission:
  ```
  allow update, delete: if request.auth != null && request.auth.uid == resource.data.uid;
  ```
- Deploy rules: `firebase deploy --only firestore:rules`

#### 2. "Cannot read property 'firebase' of undefined"

**Cause**: Firebase not initialized before use

**Solution**:

- Ensure `src/main.js` is loaded before other scripts
- Check browser console for initialization errors
- Verify Firebase config is correct

#### 3. "401 Unauthorized" from Ball Don't Lie API

**Cause**: Invalid or missing API key

**Solution**:

- Go to https://balldontlie.io/api
- Generate a new API key
- Update `api.js` with new key
- Restart API server: `npm run api`

#### 4. Players Not Loading in Dashboard

**Cause**: API server not running or CORS issue

**Solution**:

- Start API server: `npm run api`
- Verify server is running on port 3001
- Check browser console for network errors
- Verify Ball Don't Lie API key is valid

#### 5. "Cannot connect to localhost:3001"

**Cause**: API server not started

**Solution**:

- Run: `npm run api`
- Wait for "Server running on port 3001" message
- Verify no other app is using port 3001
- Try: `lsof -i :3001` (Mac/Linux) or `netstat -ano | findstr :3001` (Windows)

#### 6. Chat Messages Not Showing

**Cause**: Firestore permissions or real-time listener issue

**Solution**:

- Check Firestore security rules allow `read: if true;` for messages
- Verify user is authenticated
- Check browser console for errors
- Refresh the page
- Clear browser cache and localStorage

#### 7. Styles Not Updating

**Cause**: SCSS not compiled to CSS

**Solution**:

- Compile SCSS: `npm run compile-sass`
- Make sure `src/css/styles.css` is up to date
- Check that CSS is linked in HTML: `<link rel="stylesheet" href="/src/css/styles.css">`
- Clear browser cache (Ctrl+Shift+Delete)

### Debug Mode

Enable debug logging in browser console:

```javascript
// Add to main.js
window.DEBUG = true;

// In chat.js
if (window.DEBUG) console.log("Debug info...");
```

### Performance Issues

**Slow Page Load**

- Check Firebase Firestore query indexes
- Optimize image sizes
- Use browser DevTools Performance tab

**High CPU/Memory**

- Limit real-time listeners (onSnapshot)
- Paginate large data sets
- Unload unused pages

---

## 👥 Contributing

### Development Workflow

1. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**

   - Keep commits atomic and well-described
   - Write descriptive commit messages
   - Test changes locally

3. **Test Your Changes**

   - Run smoke tests: `node scripts/smoke_test.js`
   - Test on multiple devices/browsers
   - Verify Firebase rules work correctly

4. **Submit Pull Request**
   - Push to GitHub: `git push origin feature/your-feature-name`
   - Create pull request with description
   - Request code review

### Code Style Guidelines

**JavaScript**

- Use ES6+ syntax
- Use meaningful variable names
- Comment complex logic
- Use async/await instead of promises when possible

**SCSS**

- Use variables for colors and sizing
- Keep selectors specific but not over-nested
- Use mixins for repeated patterns
- Organize by component

**HTML**

- Use semantic tags (header, nav, main, section, article)
- Include alt text for images
- Use proper heading hierarchy
- Include accessibility attributes (aria-label, etc.)

---

## 📝 License

This project is part of the DreamTeam Pacers Fan Platform initiative. All rights reserved.

---

## 🤝 Support

For issues, questions, or suggestions:

- **GitHub Issues**: https://github.com/n423DreamTeam/dreamTeamPRT2Laptop/issues
- **Email**: contact@dreamteampacers.dev
- **Discord**: [Join Community Server]

---

## 🙏 Acknowledgments

- **Ball Don't Lie API** - Real NBA statistics
- **Firebase** - Backend infrastructure
- **Vite** - Frontend build tooling
- **Indiana Pacers** - Team data and branding
- **Community Contributors** - Your support makes this possible!

---

## 📅 Changelog

### Version 1.0.0 (Current)

- ✅ Player roster and profiles
- ✅ Daily challenges with stats game
- ✅ Player unlock system with tiers
- ✅ Rewards collection
- ✅ Community chat with edit/delete
- ✅ Real-time leaderboards
- ✅ User accounts and profiles

### Upcoming Features

- 🔄 Trade system between players
- 🔄 Tournament mode
- 🔄 Mobile app (React Native)
- 🔄 Discord integration
- 🔄 Fantasy league integration
- 🔄 Merchandise rewards

---

**Last Updated:** December 2024  
**Repository:** https://github.com/n423DreamTeam/dreamTeamPRT2Laptop  
**Live Site:** Coming Soon
