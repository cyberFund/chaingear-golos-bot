const http = require('http')
const golos = require('golos-js')
const createHandler = require('github-webhook-handler')
const Github = require('github-api-node')
const config = require('./config.json')

const github = new Github({
  username: "goloschaingear",
  password: config.git_key,
  auth: "basic"
})
const dataRepo = github.getRepo('goloschaingear', 'data')
const readFile = (repository) => {
  return new Promise((resolve, reject) => {
    repository.read('master', 'bot-list.json', (err, res) => err?reject(err):resolve(res))
  })
}
const port = 8080
const path = '/'
const handler = createHandler({path: path, secret: config.secret})

http.createServer((req, res) => {
	handler(req, res, (err) => {
		res.statusCode = 404
		res.end('no such location')
	})
}).listen(port)

handler.on('error', err => {
	console.error('Error', err.message)
})
handler.on('push', event => {
  console.log(event)
  const message = event.payload.commits[0].message
  if(message.search(/Add: /)!==-1) {
    const projectName = message.split(/Add: /)[1]
    readFile(dataRepo)
      .then(list => {
        const projects = list.map(item => item.project)
        const n = projects.indexOf(projectName)
        if(n!==-1) {
          return golos.broadcast.vote(config.wif,
            'cyberanalytics',
            projects[n].author,
            projects[n].url.split('/')[2],
            100,
            (err, res) => console.log(err?err:'Upvoted!')
            )
        }
      })
      .catch(error => console.log(error))
  }
})
