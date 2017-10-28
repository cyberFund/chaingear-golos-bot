const golos = require('golos-js')
const Github = require('github-api-node')
var config = require('./config.json')

var github = new Github({
  username: "goloschaingear",
  password: config.git_key,
  auth: "basic"
});

const repo = github.getRepo('goloschaingear', 'chaingear');

const options = {
	author: {name: 'GolosBot', email: 'echo.from@yandex.ru'},
	committer: {name: 'GolosBot', email: 'echo.from@yandex.ru'},
	encode: true
}
let lastPost = {}

const main = () => {
	golos.api.getDiscussionsByCreated({"select_tags":[], "limit":10}, (err, res)=>err?console.log(err):res)
		.then(posts=>{
			meta = JSON.parse(posts[0].json_metadata)
			if(posts[0].id!==lastPost.id ) {
				const link = posts[0].permlink.replace(/[\W]/g, '')
				const file = 'sources/' + link + '/' + link +'.toml'

				repo.branch('test1', link, (err) => {
					console.log(err?err:'Branch ' + link + ' created')
					return repo.write(link, file, posts[0].body, 'Commit from golos', options, (err) => console.log(err?err:'File ' + link + '.toml created'));
				})
			}

			lastPost.id = posts[0].id
		    lastPost.url = posts[0].url
		    lastPost.meta = JSON.parse(posts[0].json_metadata)
		    return
		})
}

golos.api.getDiscussionsByCreated({"select_tags":[], "limit":10}, (err, res)=>err?console.log(err):res)
    .then(posts=>{
    	lastPost.id = posts[0].id
    	lastPost.url = posts[0].url
    	lastPost.meta = JSON.parse(posts[0].json_metadata)
    	setInterval(main, 1000)
    })
