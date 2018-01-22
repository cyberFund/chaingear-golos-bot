const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const config = require('config')
const logger = require('./app/helpers/logger.js')

const options = {keepAlive: 1, connectTimeoutMS: 30000 }

mongoose.connect(config.DBHost, options);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const app = express()
if (process.env.NODE_ENV !== 'test') app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(express.static('dist'))
app.use('/static', express.static('files'))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})
const port = 8000

require('./app/routes/index.js')(app)
app.listen(port, () => {
	console.log('listen 8000')
})


