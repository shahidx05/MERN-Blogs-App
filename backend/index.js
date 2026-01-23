const express = require('express')
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth.routes')
const app = express()
const port = 3000
app.use(express.json())
connectDB();

app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Blogs API')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
