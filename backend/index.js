const express = require('express')
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth.routes')
const postRoutes = require('./routes/post.routes')
const userRoutes = require('./routes/user.routes')
const app = express()
const port = process.env.PORT || 4000
app.use(express.json())
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Blogs API')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
