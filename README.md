# ✍️ Blogiary

<p align="center">
  <img src="frontend/src/assets/logo.png" alt="Blogiary Logo" width="150" />
</p>

<h3 align="center">A Next-Generation Social Blogging Platform</h3>

<p align="center">
  Where developers write, share, and discover stories—supercharged with an advanced AI assist!
  <br />
  <br />
  <a href="https://blogiary-shahidx05.vercel.app"><strong>🌐 View Live Demo »</strong></a>
</p>

---

## 📖 About The Project

Blogiary is not just another blogging platform—it's a complete ecosystem designed for creators, writers, and developers. Traditional blogging tools often lack modern social features or require third-party plugins for intelligent writing assistance. 

Blogiary solves this by natively integrating a powerful social graph (followers, feeds, bookmarks, and comments) alongside an **intelligent AI writing assistant**. Whether you are suffering from writer's block or just need to clean up your grammar, the integrated AI is right there within the editor to help you craft the perfect post.

---

## ✨ Features

**Core Platform**
- **Robust Authentication** — JWT-based secure login and registration.
- **Rich Text Editor** — Tiptap-powered editor for seamless formatting, linking, and embedding.
- **Social Graph** — Follow and unfollow users. Curated "For You" and "Following" feeds.
- **Engagement System** — Like, bookmark, and comment on stories to build community.
- **Search & Discovery** — Debounced real-time search across titles and content, plus tag-based filtering.

**AI-Powered Assist**
- **Generate & Rewrite** — Overcome writer's block instantly.
- **Tone & Length Adjustments** — Make it longer, shorter, or fix grammar seamlessly.
- **Smart Gateway** — Integrated OpenRouter fallback (StepFun/Nemotron) ensuring high availability.
- **Clean Output** — Intelligent Markdown-to-HTML sanitization for seamless Tiptap integration.

**Performance & Security**
- **Rate Limiting** — Production-grade middleware protecting APIs from abuse.
- **XSS Protection** — Aggressive HTML sanitization on all post content.
- **Cloud Storage** — Scalable image and avatar uploads via Cloudinary.
- **Responsive & Accessible** — Polished UI supporting light/dark modes on any device.

---

## 📸 Screenshots

### 1. Home Feed
![Home Feed](frontend/src/assets/feed.png)
*A personalized, distraction-free reading experience.*

### 2. Rich Text Editor
![Editor](frontend/src/assets/editor.png)
*Focus on writing with a clean, responsive Tiptap editor.*

### 3. AI Assist in Action
![AI Assist](frontend/src/assets/editor_ai.png)
*Highlight text to automatically generate, expand, or fix grammar.*

### 4. Post Details & Engagement
![Post Details](frontend/src/assets/post_details.png)
*Like, bookmark, and leave comments.*

### 5. User Profile (Placeholder - Add your image here)
![User Profile](frontend/src/assets/profile.png)
*View follower counts, published posts, and manage your content.*

---

## 🛠 Tech Stack

**Frontend**
<br>
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

**Backend**
<br>
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

**AI, Services & Hosting**
<br>
![OpenRouter](https://img.shields.io/badge/OpenRouter-000000?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

---

## 🔬 Deep Dive: System Architecture

### 🧠 The AI Engine (OpenRouter Integration)
The platform uses an intelligent backend controller that processes all text transformations. Instead of relying on a single point of failure, Blogiary uses an **OpenRouter Gateway**. 
- **Primary Model**: StepFun's `Step-3.5-Flash` is used for ultra-fast, high-quality generation.
- **Fallback Model**: In the event of network lag or rate-limiting, the system automatically falls back to NVIDIA's `Nemotron-Nano-9B`.
- **Sanitization Pipeline**: All AI responses are passed through a regex-based HTML cleaner that strips markdown wrappers (like ` ```html `) before returning raw HTML directly into the TipTap Editor schema.

### 👥 The Social Engine
- **Following System**: Users can follow/unfollow each other, populating a custom `Following` feed alongside the global `For You` feed.
- **Interaction Data**: Likes and Bookmarks are handled via optimistic UI updates on the frontend while securely validating state against the MongoDB backend.
- **Reading Time Calculation**: Every post calculates its reading time dynamically based on standard 200 WPM reading speeds before saving to the database.

---

## 🗄️ Data Models

At the core of the database, Blogiary relies on three main Mongoose schemas:

1. **User**: Stores authentication details, Cloudinary avatar URLs, arrays of `followers`, `following`, and `bookmarks`.
2. **Post**: Stores the TipTap HTML content, cover image, read time, view counter, arrays of `likes`, and references to the author.
3. **Comment**: References the parent `Post` and the `User` who authored the comment, along with timestamps for chronologically sorting discussions.

---

## 🚀 Run Locally

### Prerequisites
- **Node.js** v18+
- **MongoDB Atlas** account (or local MongoDB instance)
- **Cloudinary** account (for image hosting)
- **OpenRouter** API key (for AI features)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

**Environment Variables (`backend/.env`):**
| Variable | Description |
|----------|-------------|
| `PORT` | API Port (e.g., 3000) |
| `MONGO_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Secure key for signing auth tokens |
| `CLIENT_URL` | Frontend URL for CORS (e.g., http://localhost:5173) |
| `CLOUDINARY_*` | Keys for handling avatar and cover image uploads |
| `OPENROUTER_API_KEY` | Your OpenRouter key to power the AI assist |

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

**Environment Variables (`frontend/.env`):**
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | URL of the backend (e.g., http://localhost:3000) |

```bash
npm run dev
```

---

## 📁 Project Architecture

```
Blogiary/
├── backend/
│   ├── controllers/      # Business logic (AI, Auth, Posts, Users)
│   ├── middleware/       # Guards (Rate limiting, JWT Auth checks)
│   ├── models/           # Mongoose schemas (User, Post, Comment)
│   ├── routes/           # API Endpoint definitions
│   └── index.js          # Server entry point
└── frontend/
    ├── src/
    │   ├── assets/       # Static media (Images, logos)
    │   ├── components/   # Reusable UI (Buttons, Cards, Modals)
    │   ├── context/      # Global State (AuthContext, ThemeContext)
    │   ├── hooks/        # Custom React hooks (useDebounce, etc.)
    │   ├── pages/        # Main Views (Landing, Editor, Feed, Profile)
    │   ├── services/     # Axios API integration layer
    │   └── utils/        # Helper functions (Time formatting, etc.)
    └── index.html
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **Auth** | | | |
| POST | `/api/auth/register` | Register a new user account | No |
| POST | `/api/auth/login` | Authenticate and receive JWT | No |
| GET | `/api/auth/me` | Fetch currently logged in user profile | Yes |
| **Posts** | | | |
| GET | `/api/posts` | Fetch the global feed of posts | No |
| GET | `/api/posts/following` | Fetch posts strictly from followed users | Yes |
| POST | `/api/posts` | Create a new blog post | Yes |
| PUT | `/api/posts/:id` | Update an existing post | Yes |
| DELETE | `/api/posts/:id` | Remove a post permanently | Yes |
| PATCH | `/api/posts/like/:id` | Toggle like status on a post | Yes |
| **Comments** | | | |
| GET | `/api/comments/:postId` | Fetch all comments for a specific post | No |
| POST | `/api/comments/:postId` | Add a new comment | Yes |
| DELETE | `/api/comments/:id` | Remove a comment | Yes |
| **Users** | | | |
| GET | `/api/users/:username` | Fetch public profile data | No |
| PUT | `/api/users/profile` | Update profile bio/avatar | Yes |
| PATCH | `/api/users/follow/:id` | Toggle follow status | Yes |
| PATCH | `/api/users/bookmarks/:id`| Toggle post bookmark status | Yes |
| **AI** | | | |
| POST | `/api/ai/generate` | Run text through OpenRouter Gateway | Yes |

---

## 👨‍💻 Author

**Shahid Khan**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/shahidx05)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/shahidx05)
[![X](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/shahidx_05)

---