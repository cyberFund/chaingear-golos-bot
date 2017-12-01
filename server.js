//npm run dev
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
const port = 8080

require('./app/routes/index.js')(app, {})

app.listen(port, () => {
  console.log('listen 8080')
})
