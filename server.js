//npm run dev
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const expressMongoDb = require('express-mongo-db')
const bodyParser = require('body-parser')
const db = require('./config/db')
const logger = require('./app/helpers/logger.js')

const app = express()
app.use(expressMongoDb(db.url))
app.use(bodyParser.json())
app.use(express.static('dist'))
app.use('/static', express.static('files'))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})
const port = 8000

MongoClient.connect(db.url, (err, database) => {
	if(err) return console.log(err)

  // Worker that wakes up at 06:00AM UTC to search for finished ICOs
  // require('./app/workers/finished-worker.js')(database)
  // Routes
  logger.level = 'debug'
  logger.info('Hello world')
  logger.debug('Debug info')
	require('./app/routes/index.js')(app, database)
	app.listen(port, () => {
	  console.log('listen 8000')
	})
})

