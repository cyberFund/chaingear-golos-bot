const toml = require('toml')
const Base64 = require('js-base64').Base64
const prms = require('../helpers/promisified.js')
const config = require('../../config.json')
const upvoter = require('../helpers/upvoter.js')
const owner = config.owner //'ninjascant',
  repo = config.repo
let options = {
  headers: {
    'Authorization': "Basic " + new Buffer('ninjascant' + ":" + config.git_key1).toString("base64"),
    'User-Agent': 'ninjascant'
  },
  body: '',
  json: true
}
const issueUrl = `https://api.github.com/repos/${owner}/${repo}/issues`

module.exports = (req, res, next) => {
  const blobGetUrl = `https://api.github.com/repos/${owner}/${repo}/git/blobs/`
  const promiseList = req.commits.map(commit => {
    commit = JSON.parse(commit)
    upvoter(commit)
    return commit.files.map(file=>{
      if(file.filename.search(/toml/)===-1) return null
      else return prms.apiReq(blobGetUrl+file.sha)
    }).filter(prom => prom !== null)
  }).reduce((prev, curr) => prev.concat(curr))
  Promise.all(promiseList)
    .then(blobs => {
      blobs = blobs.map(blob => {
        blob = JSON.parse(blob)
        try {
          blob.content = toml.parse(Base64.decode(blob.content))
        } catch(err) {
          console.log('Toml file is not valid')
          options.body = {
            title: 'Invalid toml file',
            body: `This file is not valid: ${Base64.decode(blob.content).slice(0, 100)}`,
            labels: ['Awaiting'],
            assignees: ['ninjascant']
          }
          prms.apiPostReq(issueUrl, options)
            .then(res=>res)
            .catch(err=>console.error(err))
          return
        }
        return blob
      })
      req.blobs = blobs
      next()
    })
    .catch(error=>console.log(error))
}
