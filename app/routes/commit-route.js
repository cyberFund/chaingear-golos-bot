const config = require('../../config.json')
const prms = require('../helpers/promisified.js')
const convert = require('../helpers/new_to_old.js')
const getCommits = require('../middlewares/get-commit-middleware.js')
const getBlobs = require('../middlewares/blobs-middleware.js')
const _ = require('lodash')
const Base64 = require('js-base64').Base64
const githubMiddleware = require('github-webhook-middleware')({
  secret: config.git_secret
})

const owner = 'ninjascant',
  repo = 'golos-academy'
const path = '/'
const br = 'master'
const blobGetUrl = 'https://api.github.com/repos/cyberFund/chaingear/git/blobs/'
const url = 'https://api.github.com/repos/cyberFund/chaingear/commits/'

module.exports = (app, db) => {
  app.post('/', githubMiddleware, getCommits, getBlobs, (req, res) => {
    let currentCgSha = ''
    blobs = req.blobs.map(blob => {
      if(blob.content.ico!==undefined) {
        blob.content = convert(blob.content)
      }
      return blob.content
    })
    prms.getFileBlob(owner, repo, br, 'chaingear.json')
      .then(fileBlob => {
        currentCgSha = fileBlob.sha
        const updated = blobs.map(file => file.system)
        let chaingear = JSON.parse(Base64.decode(fileBlob.content))
        chaingear = chaingear.filter(proj => {
          return updated.indexOf(proj.system)===-1
        })
        const n = chaingear.length
        const fiat = chaingear.slice(n-15)
        let crypto = chaingear.slice(0, n-15)
        crypto = crypto.concat(blobs)
        crypto = _.sortBy(crypto, ['system'])

        return crypto.concat(fiat)
      })
      .then(newFile => {
        const fileStr = JSON.stringify(newFile, null, 4)
        return prms.updateFile(owner, repo, 'chaingear.json', 'Commit from chaingear-backend', fileStr, currentCgSha, br)
      })
      .then(none => {
        console.log(none)
      })
      .catch(error=>console.log(error))
  })
  app.listen(port, () => {
    console.log('listen 8080')
  })
}
