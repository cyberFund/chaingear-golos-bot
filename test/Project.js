process.env.NODE_ENV = 'test'

const mongoose = require('mongoose')
const Project = require('../app/models/project.js')

const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../server.js')

chai.use(chaiHttp)

// GET paths
describe('/get-all-projects', () => {
  it('it should get all the projects', done => {
    Project.remove({}, err => {
      chai.request('http://localhost:8000')
        .get('/get-all-projects')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.length.should.be.eql(0)
          done()
        })
    })
  })
})

describe('/get-finished-projects', () => {
  it('it should get all projects with finished status', done => {
    const activeProject = new Project({projectInfo: require('./mock-projects/active-project.json')})
    const finishedProject = new Project({projectInfo: require('./mock-projects/finished-project.json')})
    const finishedProject1 = new Project({projectInfo: require('./mock-projects/finished-project1.json')})
    
      activeProject.save((err, proj) => {
        finishedProject.save((err, proj) => {
          finishedProject1.save((err, proj) => {
            chai.request('http://localhost:8000')
              .get('/get-finished-projects')
              .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
                res.body.length.should.be.eql(2)
                done()
              })
          })
        })
      }) 
    })
})

describe('/get-active-projects', () => {
  it('it should get all projects with active status', done => {
    const activeProject = new Project({projectInfo: require('./mock-projects/active-project.json')})
    const finishedProject = new Project({projectInfo: require('./mock-projects/finished-project.json')})
    const finishedProject1 = new Project({projectInfo: require('./mock-projects/finished-project1.json')})
    
      activeProject.save((err, proj) => {
        finishedProject.save((err, proj) => {
          finishedProject1.save((err, proj) => {
            chai.request('http://localhost:8000')
              .get('/get-active-projects')
              .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
                res.body.length.should.be.eql(1)
                done()
              })
          })
        })
      }) 
    })
})

// POST paths
describe('/add-project required fields', () => {
  it('it should not add a project to db if it has not all required fields', done => {
    const project = {
      addedAt: '',
      addedBy: '',
      projectInfo: {
        blockchain: {
          headline: 'String',
          logo: 'String',
          state: '1',
          asset_type: 'blockchain protocol',
          dependency: 'Waves',
          consensus_name: 'POS'
        }
      }
    }
    chai.request('http://localhost:8000')
      .post('/add-project')
      .send(project)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('errors')
        res.body.errors.should.have.property('projectInfo.blockchain.project_name')
        res.body.errors['projectInfo.blockchain.project_name'].should.have.property('kind').eql('required')
        done()
      })
  })
})



