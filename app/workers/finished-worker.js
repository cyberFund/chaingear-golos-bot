const schedule = require('node-schedule')

module.exports = (db) => {
  const everyDayJob = schedule.scheduleJob('25 22 15 * * *', () => {
    console.log('Another work day is here')
    const db1 = db.db('chaingear-db')
    db1.collection('activeProjects').find().toArray((err, res) => {
      if(err) return console.log(err)
      const finished = res.filter(project => {
        return new Date(project.ico.phases[0].dates.end_date).valueOf() < new Date().valueOf()
      })
      finished.forEach(project => {
        db1.collection('activeProjects').deleteOne({'blockchain.project_name': project.blockchain.project_name})
        db1.collection('finishedInWork').save(project, (err, res) => {
          if(err) return console.log('Err while adding project', err)
          console.log(`${project.blockchain.project_name} project added to finishedInWork`)
        })
      })
    })
  })
}