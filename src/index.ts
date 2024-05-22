import express from 'express'
import path from 'path'
import app from './routes/router'

const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'views')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
