module.exports = (app, db) => {
  app.get('/getFinished', (req, res) => {
    db.collection('finishedInWork').find().toArray((err, data) => {
      if (err) {
        console.log(err)
        res.send('Error while handling request')
      } else {
        res.send(data)
      }
    })
  })
}