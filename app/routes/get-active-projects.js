const mongoose = require('mongoose')
const Project = require('../models/project.js')

module.exports = (app) => {
  app.get('/get-active-projects', (req, res) => {
    const query = Project.find({'projectInfo.ico.common_info.current_phase_status': 'Active'})
    query.exec((err, projects) => {
      if (err) res.send(err)
      res.send(projects)
    })
  })
}