module.exports = (req, res, next) => {
  req.blobs.forEach(blob => {
    const file = blob.content
    console.log(file)
    if(file.ico !== undefined) {
      // Search if there's active phase
      const activePhase = file.ico.phases.filter(phase => phase.phase_status.search(/Active/) !== -1)
      if (activePhase.length !== 0) {
        // Add or update activeProjects
        req.db.collection('activeProjects').findOne({project: file.blockchain.project_name}, (err, res) => {
          if(err) return console.log('Err while searching project', err)
          if (res === null) {
            req.db.collection('activeProjects').save(file, (err, res) => {
              console.log(`Project added to activeProjects: ${file.blockchain.project_name}`)
              next()
            })
          } else {
            req.db.collection('activeProjects').update({project: file.blockchain.project_name}, file, (err, res) => {
              if(err) return console.log('Err while update activeProjects', err)
              console.log(`Project updated in activeProjects: ${file.blockchain.project_name}`)
              next()
            })
          }
        })
      } else {
        // check if there's filled raised_funds fields
        const inWork = (file.ico.phases.filter(phase => phase.raised_funds[0].amount === 0).length === 0)
        if (inWork) {
          req.db.collection('finishedInWork').findOne({project: file.blockchain.project_name}, (err, res) => {
            if (res === null) {
              req.db.collection('finishedInWork').save(file, (err, res) => {
                console.log(err?err:`Project added to finishedInWork: ${file.blockchain.project_name}`)
                next()
              })
            } else {
              req.db.collection('finishedInWork').update({project: file.blockchain.project_name}, file, (err, res) => {
                if(err) return console.log('Err while update datesCollection', err)
                console.log(`Project updated in finishedInWork: ${file.blockchain.project_name}`)
              })
            }
          })
        } else {
          req.db.collection('finished').findOne({project: file.blockchain.project_name}, (err, res) => {
            if (res === null) {
              req.db.collection('finished').save(file, (err, res) => {
                console.log(err?err:`Project added to finished: ${file.blockchain.project_name}`)
                next()
              })
            } else {
              req.db.collection('finished').update({project: file.blockchain.project_name}, file, (err, res) => {
                if(err) return console.log('Err while update datesCollection', err)
                console.log(`Project updated in finished: ${file.blockchain.project_name}`)
              })
            }
          })
        }
      }
    } else {
      next()
    }
  })
} 