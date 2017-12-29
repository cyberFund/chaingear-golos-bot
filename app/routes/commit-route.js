const config = require('../../config.json')
const prms = require('../helpers/promisified.js')
const convert = require('../helpers/new_to_old.js')
const getCommits = require('../middlewares/get-commits-middleware.js')
const getBlobs = require('../middlewares/blobs-middleware.js')
const sendToDb = require('../middlewares/db-middleware.js')
const _ = require('lodash')
const Base64 = require('js-base64').Base64
const jsonfile = require('jsonfile')
const githubMiddleware = require('github-webhook-middleware')({
  secret: config.commit_webhook_secret
})

const owner = config.owner //'ninjascant',
  repo = config.repo
const path = '/'
const br = 'gh-pages'
const blobGetUrl = 'https://api.github.com/repos/cyberFund/chaingear/git/blobs/'
const url = 'https://api.github.com/repos/cyberFund/chaingear/commits/'

module.exports = (app, db) => {
  app.post('/commit', githubMiddleware, getCommits, getBlobs, sendToDb, (req, res) => {
    let currentCgSha = ''

    if(req.blobs[0] === undefined) return
    blobs = req.blobs.map(blob => {
      if(blob.content.ico!==undefined) {
        console.log('New file');
        blob.content = convert(blob.content)
      }
      return blob.content
    })
    prms.getFileBlob(owner, repo, br, 'chaingear.json')
      .then(fileBlob => {
        currentCgSha = fileBlob.sha
        const updated = blobs.map(file => file.system)
        let chaingear = JSON.parse(Base64.decode(fileBlob.content))
        for (let i = 0; i < blobs.length; i++) {
          const m = _.findIndex(chaingear, (o) => o.system === updated[i])
          chaingear.splice(m, 1, blobs[i])
        }
        chaingear = _.sortBy(chaingear, ['system'])
        return chaingear
      })
      .then(newFile => {
        const fileStr = JSON.stringify(newFile, null, 4)
        return prms.updateFile(owner, repo, 'chaingear.json', 'Commit from chaingear-backend', fileStr, currentCgSha, br)
      })
      .then(none => {
        currentCgSha = ''
        res.send('Success')
        console.log(none)
      })
      .catch(error=>console.log(error))
  })
}
