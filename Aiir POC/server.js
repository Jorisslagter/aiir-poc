const express = require('express')
const path = require('path')

const app = express()
const port = process.env.PORT || 8080

// Serve the static files from the dist folder
app.use(express.static(path.join(__dirname, 'dist')))

// Route all requests to the Vue app's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Start the server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
