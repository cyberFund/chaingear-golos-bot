const Github = require('github-api-node')
const config = require('../../config.json')
const toml = require('toml-js')
const jsonfile = require('jsonfile')
const tomlify = require('tomlify-j0.4')

const github = new Github({
	username: "goloschaingear",
	password: config.git_key,
	auth: "basic"
})

const baseRepo = github.getRepo('ninjascant', 'chaingear')
const repo = github.getRepo('goloschaingear', 'chaingear')
const dataRepo = github.getRepo('goloschaingear', 'data')

const options = {
	author: {name: 'GolosBot', email: 'echo.from@yandex.ru'},
	committer: {name: 'GolosBot', email: 'echo.from@yandex.ru'},
	encode: true
}

let lastPost = {}

const getBranches = (repository) => {
	return new Promise((resolve, reject) => {
		repository.listBranches((err, branches) => err?reject(err):resolve(branches))
	})
}
const createBranch = (repository, link) => {
	return new Promise((resolve, reject) => {
		repository.branch('from-golos', link, err => err?reject(err):resolve(link))
	})
}
const writeOrUpdate = (repository, branch, link, file, text) => {
	return new Promise((resolve, reject)=> {
		repository.write(branch,
			file,
			text,
			`Test commit from a form`,
			options,
			err => err?reject(err):resolve(`File RaidenNetwork.toml created`))
	})
}
const readFile = (repository) => {
	return new Promise((resolve, reject) => {
		repository.read('master', 'bot-list.json', (err, res) => err?reject(err):resolve(res))
	})
}
const createPullRequest = (base, pullReq) => {
	return new Promise((resolve, reject) => {
		base.createPullRequest(pullReq, (err, res) => err?reject(err):resolve(res))
	})
}


module.exports = (app) => {
	app.post('/pullreq', (req, res) => {
		delete req.body['_id']
		const name = req.body.blockchain.project_name.replace(/[\W]/g, '')
		getBranches(repo)
			.then(branches => branches.indexOf(name)===-1?createBranch(repo, name):name)
			.then(none => {
				return writeOrUpdate(repo, 
					name, 
					name, 
					`sources/${name}/${name}.toml`, 
					tomlify.toToml(req.body, {space: 2}))
			})
			.then(none => {
				const pull = {
					title: `Add: ${name}`,
					body: 'Pull request from chaingear-frontend: update project info',
					base: 'gh-pages',
					head: `goloschaingear:${name}`
				}
				return createPullRequest(baseRepo, pull)
			})
			.then(none=>{
				res.send(none)
			})
			.catch(err=>console.log(err))
	})
}
