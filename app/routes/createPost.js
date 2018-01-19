const config = require('../../config.json')
const prms = require('../helpers/promisified.js')
const Github = require('github-api-node')

const owner = 'ninjascant', // 'ninjascant'
  path = '/posts/',
  br = 'master'
const github = new Github({
  username: owner,
  password: config.git_key1,
  auth: "basic"
})
const repo = github.getRepo(owner, 'golos-academy')
const options = {
	author: {name: 'GolosBot', email: 'echo.from@yandex.ru'},
	committer: {name: 'GolosBot', email: 'echo.from@yandex.ru'},
	encode: true
}
const writeOrUpdate = (repository, branch, link, file, text) => {
  return new Promise((resolve, reject)=> {
  	repository.write(branch,
  	  file,
  		text,
  		`Commit from golosBot. Add: ${link}`,
  		options,
  		err => err?reject(err):resolve(`File ${link}.md created`))
  })
}

let i = 0
module.exports = (app, db) => {
  app.post('/createPost', (req, res) => {
    console.log(req.body)
    writeOrUpdate(repo, br, `post${i}`, `posts/post${i}.md`, req.body.post)
      .then(result=>console.log(result))
      .catch(error=>console.log(error))
  })
}
