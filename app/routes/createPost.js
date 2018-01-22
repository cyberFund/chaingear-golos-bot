const config = require('../../config.json')
const prms = require('../helpers/promisified.js')
const Github = require('github-api-node')
const postGen = require('../helpers/post_generator.js')

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
    const post = postGen(req.body.form)
    writeOrUpdate(repo, br, `post${i}`, `posts/post${i}.md`, post)
      .then(result=>{
        console.log(result)
        res.send('Success!')
      })
      .catch(error=>console.log(error))
  })
}
