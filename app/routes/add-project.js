const mongoose = require('mongoose')
const Project = require('../models/project.js')

module.exports = (app) => {
  app.post('/add-project', (req, res) => {
    const newProject = new Project(req.body)
    newProject.save((err, proj) => {
      if (err) res.send(err)
      else res.json({message: 'Project added'})
    })
  })
}