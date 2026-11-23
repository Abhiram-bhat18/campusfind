# CampusFind – AI-Powered Smart Lost & Found Platform for College Campuses 🎓

CampusFind is a production-ready, full-stack, AI-powered Smart Lost & Found web application designed for college campuses. It provides a secure, fast, and user-friendly platform where students can report lost items, list found belongings, match reports using Computer Vision and OCR, communicate safely via realtime messaging, and complete verified claim handovers.

---

## 🌟 Key Features

1. **AI Vision & Smart Match Engine**:
   - **OCR Text Reader**: Automatically extracts text, student roll numbers, and names from uploaded ID card and document photos using browser OCR.
   - **Color & Tag Predictor**: Computer Vision algorithms extract dominant colors and suggest tags instantly.
   - **AI Match Score %**: Calculates match confidence scores between open Lost reports and Found items based on location, time window, category, tags, and OCR content.

2. **Verification & Claim System**:
   - Only Found items can be claimed.
   - Claimants submit proof details, photo evidence, and reason for claim.
   - Found item owners can Accept, Reject, or Request Info on claims.
   - Marking item as resolved triggers celebration confetti and awards reputation points!

3. **Interactive Campus Map**:
   - Visual map displaying pinned lost (red) and found (green) items across campus complexes.
   - Filter pins by building location, item type, or status.

4. **Realtime In-App Messaging**:
   - In-app chat between item owner and claimant.
   - Read receipts, typing indicators, and image sharing.

5. **Gamification & User Reputation**:
   - Reputation points awarded for returning items and reporting found items.
   - Badges like *Trusted Finder*, *Helpful Student*, *Campus Guardian*, *Top Contributor*.
   - Monthly Campus Leaderboard.

6. **Admin Panel & Moderation**:
   - System metrics and recovery analytics.
   - User verification and moderation.
   - Safety flag reports log.
   - Broadcast emergency campus announcements.
   - Export CSV reports.

7. **Supabase PostgreSQL & Row Level Security (RLS)**:
   - Complete PostgreSQL migration schema provided in `supabase/schema.sql`.
   - Row Level Security policies for user privacy.
   - Seamless local mock storage fallback engine so the app works out-of-the-box instantly!

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons, Recharts, Canvas Confetti
- **Backend / Database**: Supabase (Auth, PostgreSQL, Realtime, Storage, RLS) + Local Mock Engine
- **AI Integrations**: Tesseract.js OCR, HTML5 Canvas Color Extractor, Fuzzy Search Matcher

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm or pnpm

### 2. Installation & Running Locally
```bash
# Navigate to the project directory
cd campusfind

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Open `http://localhost:3000` in your browser to test CampusFind.

### 3. Production Build
```bash
# Build for production
npm run build

# Preview production bundle
npm run preview
```

---

## 🗄️ Database Setup (Supabase)

To connect to a live Supabase instance:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL Editor in Supabase and run `supabase/schema.sql`.
3. Copy your project credentials and create a `.env` file:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
## DevOps Deployment

CampusFind uses GitHub Actions for continuous integration
and Vercel for automatic deployment.
