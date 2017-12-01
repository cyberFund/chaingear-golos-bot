const config = require('../../config.json')
const golos = require('golos-js')

module.exports = (commits) => {
  commits.forEach(commit => {
    if(commit.commit.commiter==='GolosBot') {
      const projectName = commit.commit.message.split(/Add: /)[1]
      const url = 'https://api.github.com/repos/goloschaingear/data/contents/bot-list.json'
      apiReq(url)
        .then(list => {
          const projects = list.map(item => item.project)
          return golos.broadcast.vote(config.wif,
            'golos-chaingear',
            projects[n].author,
            projects[n].url.split('/')[2],
            100,
            (err, res) => console.log(err?err:'Upvoted!'))
          })
      .catch(error => console.log(error))
    }
  })
}
