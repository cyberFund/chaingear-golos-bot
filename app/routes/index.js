const pullReqRoute = require('./pull-req-route.js')
const commitRoute = require('./commit-route.js')
const issuesRoute = require('./issues-route.js')
const getFinishedRoute = require('./get-finished-route.js')
const pullReq = require('./pullReq.js')

module.exports = (app, db) => {
  //pullReqRoute(app, db)
  pullReq(app)
  commitRoute(app, db)
  getFinishedRoute(app, db)
  //issuesRoute(app)
}
