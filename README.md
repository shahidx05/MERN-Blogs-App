# Social Blogging Platform

A full-stack social blogging platform where developers can write, share, and discover stories. Built with the MERN stack.

🌐 **Live Demo:** [link](https://mern-blogs-app-shahidx05.vercel.app/)

---
 
## 🛠 Tech Stack
 
**Frontend**
 
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
 
**Backend**
 
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
 
**Deployed On**
 
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
 
---
 
## ✨ Features
 
- **Authentication** — Register, login with JWT-based auth
- **Rich Text Editor** — TipTap editor with formatting, links, and more
- **Image Uploads** — Cover images and avatars via Cloudinary
- **Social** — Like, bookmark, comment on posts
- **Follow System** — Follow/unfollow users, view following feed
- **Search** — Debounced search across titles and content
- **Tags** — Tag posts, filter by topic
- **Reading Time** — Auto-calculated reading time per post
- **View Counter** — Track post views
- **For You / Following Feed** — Personalized home feed
- **Dark / Light Mode** — Persistent theme toggle
- **Fully Responsive** — Works on all screen sizes
- **Rate Limiting** — Protect API from abuse
- **HTML Sanitization** — XSS protection on post content
 
---
 
## 📸 Screenshots
 
 
---
 
## 🚀 Run Locally
 
### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
 
### Backend
 
```bash
cd backend
npm install
cp .env.example .env   # fill in your values
node index.js
```
 
### Frontend
 
```bash
cd frontend
npm install
cp .env.example .env   # add VITE_API_URL
npm run dev
```
 
### Environment Variables
 
**Backend `.env`**
```
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_strong_secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```
 
**Frontend `.env`**
```
VITE_API_URL=http://localhost:3000
```
 
---
 
## 📁 Project Structure
 
```
Blogs-app/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── hooks/
    │   ├── pages/
    │   ├── services/
    │   └── utils/
    └── index.html
```
 
---
 
## 🔗 API Endpoints
 
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/posts` | Get all posts | No |
| GET | `/api/posts/following` | Get following feed | Yes |
| POST | `/api/posts` | Create post | Yes |
| PUT | `/api/posts/:id` | Edit post | Yes |
| DELETE | `/api/posts/:id` | Delete post | Yes |
| PATCH | `/api/posts/like/:id` | Like/unlike post | Yes |
| GET | `/api/comments/:postId` | Get comments | No |
| POST | `/api/comments/:postId` | Add comment | Yes |
| DELETE | `/api/comments/:id` | Delete comment | Yes |
| GET | `/api/users/:username` | Get user profile | No |
| PUT | `/api/users/profile` | Update profile | Yes |
| PATCH | `/api/users/follow/:id` | Follow/unfollow | Yes |
| PATCH | `/api/users/bookmarks/:id` | Bookmark post | Yes |
 
---
 
## 👨‍💻 Author
 
**Shahid Khan**
 
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/your-username)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/your-username)
[![X](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/your-username)
 
---
 
## 📄 License
 
MIT License
