const prms = require('../helpers/promisified.js')
const upvoter = require('../helpers/upvoter.js')
const config = require('../../config.json')
const logger = require('../helpers/logger.js')
const owner = config.owner //'ninjascant',
  repo = config.repo

module.exports = (req, res, next) => {
  const event = req.headers['x-github-event']
  //logger.debug(req.headers)
  //console.log()
  //console.log(req.body)
  // if (res.body.ref !== 'refs/heads/gh-pages') return 
  if(event === 'pull_request' && req.body.action === 'opened') {
    // Get commits from pull request
    const pullReqNum = req.body.number
    const pullCommitsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullReqNum}/commits`
    const commitUrl = `https://api.github.com/repos/${owner}/${repo}/commits/`

    prms.apiReq(pullCommitsUrl)
      .then(res=>{
        res = JSON.parse(res)
        const promiseList = res.map(commit => prms.apiReq(commitUrl+commit.sha))
        return Promise.all(promiseList)
      })
      .then(commits => {
        req.commits = commits
        next()
      })
      .catch(error=>console.log(error))
  } else if(event === 'pull_request' && req.body.action === 'closed') {
    // Do nothing
    console.log('closed')
    return
  } else if(event === 'push') {
    // Get commits from commit
    const commits = req.body.commits.filter(commit => commit.added.length!==0 || commit.modified.length !== 0)
    if(commits.length === 0) return
    if(commits[0].modified.indexOf('chaingear.json')!==-1 ||commits[0].added.indexOf('chaingear.json')!==-1) {
      console.log('That was chaingear.json')
      return
    } 
    const url = `https://api.github.com/repos/${owner}/${repo}/commits/`
    const promiseList = commits.map(commit => prms.apiReq((url + commit.id)))
    Promise.all(promiseList)
      .then(commits => {
        commits = commits.map(commit => JSON.parse(commit))
        req.commits = commits
        const files = commits.map(commit => commit.files)
        next()
      })
      .catch(error=>console.log(error))
  }
  else {
    return
  }
}
