//npm run dev
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const schedule = require('node-schedule')
const db = require('./config/db')

const app = express()
app.use(bodyParser.json())
app.use(express.static('dist'))
const port = 8000

MongoClient.connect(db.url, (err, database) => {
	if(err) return console.log(err)

	const everyDayJob = schedule.scheduleJob('05 * * * * *', () => {
		console.log('Another work day is here')
	})

	require('./app/routes/index.js')(app, database)
	app.listen(port, () => {
	  console.log('listen 8080')
	})
})

