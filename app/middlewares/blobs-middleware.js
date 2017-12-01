const toml = require('toml')
const Base64 = require('js-base64').Base64
const prms = require('./helpers/promisified.js')

const owner = 'ninjascant',
  repo = 'golos-academy'

module.exports = (req, res, next) => {
  const blobGetUrl = `https://api.github.com/repos/${owner}/${repo}/git/blobs/`
  const promiseList = req.commits.map(commit => {
    commit = JSON.parse(commit)
    return commit.files.map(file=>{
      if(file.filename.search(/toml/)===-1) return null
      else return prms.apiReq(blobGetUrl+file.sha)
    }).filter(prom => prom !== null)
  }).reduce((prev, curr) => prev.concat(curr))
  Promise.all(promiseList)
    .then(blobs => {
      blobs = blobs.map(blob => {
        blob = JSON.parse(blob)
        blob.content = toml.parse(Base64.decode(blob.content))
        return blob
      })
      req.blobs = blobs
      next()
    })
    .catch(error=>console.log(error))
}
