module.exports = (req, res, next) => {
  req.blobs.forEach(blob => {
    const file = blob.content
    if(blob.content.ico !== undefined) {
      // Search if there's active phase
      const activePhase = blob.content.ico.phases.filter(phase => phase.phase_status.search(/Active/) !== -1)
      if (activePhase.length === 0) return
      // This object will be sent to the dates collection
      const datesObj = {
        startDate: activePhase[0].dates.start_date,
        endDate: activePhase[0].dates.end_date,
        project: blob.content.description.project_name 
      }
      // Add or update datesCollection
      req.db.collection('datesCollection').findOne({project: blob.content.description.project_name}, (err, res) => {
        if(err) return console.log('Err while searching project', err)
        if (res === null) {
          req.db.collection('datesCollection').save(datesObj, (err, res) => {
            if(err) console.log('Err while add to datesCollection', err)
            req.db.collection('activeProjects').save(blob.content, (err, res) => {
              console.log(err?err:`Project added to db: ${blob.content.description.project_name}`)
              next()
            })
          })
        } else {
          req.db.collection('activeProjects').update({project: blob.content.description.project_name}, blob.content, (err, res) => {
            if(err) console.log('Err while update datesCollection', err)
            req.db.collection('activeProjects').update({project: blob.content.description.project_name}, blob.content, (err, res) => {
              console.log(err?err:`Project updated in db: ${blob.content.description.project_name}`)
              next()
            })
          })
        }
      })
    } else {
      next()
    }
  })
} 