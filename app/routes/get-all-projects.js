const mongoose = require('mongoose')
const Project = require('../models/project.js')

module.exports = (app) => {
  app.get('/get-all-projects', (req, res) => {
    const query = Project.find({})
    query.exec((err, projects) => {
      if (err) res.send(err)
      res.send(projects)
    })
  })
}