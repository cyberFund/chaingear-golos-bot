const request = require('request')
const GitHubApi = require("github")
const config = require('../../config.json')
const Base64 = require('js-base64').Base64

const username = "ninjascant",
    password = config.git_key1

const readOptions = {
  headers: {
    'Authorization': "Basic " + new Buffer(username + ":" + password).toString("base64"),
    'User-Agent': 'ninjascant'
  }
}
const postOptions = {
  auth: {
    user: 'ninjascant',
    password: config.git_key1
  },
  headers: {
    //'Authorization': "Basic " + new Buffer(username + ":" + password).toString("base64"),
    'User-Agent': 'ninjascant'
  },
  json: true
}

const github = new GitHubApi({
    debug: false
  })

github.authenticate({
  type: "basic",
  username: "ninjascant",
  password: config.git_key1
})

const readFile = (repository) => {
  return new Promise((resolve, reject) => {
    repository.read('master', 'bot-list.json', (err, res) => err?reject(err):resolve(res))
  })
}
const apiReq = (url) => {
  return new Promise((resolve, reject) => {
    request(url, readOptions,
      (err, response, body) => err?reject(err):resolve(body))
  })
}
const apiPostReq = (url) => {
  return new Promise((resolve, reject) => {
    console.log(postOptions);
    request.post(url, postOptions,
      (err, response, body) => err?console.log(err):resolve(response))
  })
}
const getFileBlob = (owner, repo, branch, filePath) => {
  const urls = {
    ref: `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/`, // + branch
    tree: `https://api.github.com/repos/${owner}/${repo}/git/trees/`, // + tree sha
    blob: `https://api.github.com/repos/${owner}/${repo}/git/blobs/` // + blob sha
  }
  return new Promise((resolve, reject) => {
    apiReq(urls.ref+branch)
      .then(ref => {
        console.log(ref);
        const sha = JSON.parse(ref).object.sha
        return apiReq(urls.tree+sha)
      })
      .then(tree => {
        tree = JSON.parse(tree)
        const sha = tree.tree.filter(item => item.path===filePath)[0].sha
        //console.log(tree);
        return apiReq(urls.blob+sha)
      })
      .then(blob => {
        blob = JSON.parse(blob)
        resolve(blob)
      })
      .catch(err=>console.log(err))
  })
}  /*
const updateFile = (owner, repo, path, message, content, sha, branch) => {
  return new Promise((resolve, reject) => {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/`
    const postReq = {
      message: message,
      commiter: {
        name: 'chaingear-backend',
        email: 'm.odegov@cyberfund.io'
      },
      content: Base64.encode(content),
      sha: sha
    }
    postOptions.body = JSON.stringify(postReq)

    apiPostReq(url+path)
      .then(res=>{
        console.log(res);
        resolve(res)
      })
      .catch(err=>console.log(err))
  })
}*/
  const getRef = (owner, repo, ref) => {
    return new Promise((resolve, reject) => {
      github.gitdata.getReference({owner: owner, repo: repo, ref: `heads/${ref}`},
        (err, res) => err?reject(err):resolve(res))
    })
  }
  const getTree = (owner, repo, sha) => {
    return new Promise((resolve, reject) => {
      github.gitdata.getTree({owner: owner, repo: repo, sha: sha},
        (err, res) => err?reject(err):resolve(res))
    })
  }
  const getBlob = (owner, repo, sha) => {
    return new Promise((resolve, reject) => {
      github.gitdata.getBlob({owner: owner, repo: repo, sha: sha},
        (err, res) => err?reject(err):resolve(res))
    })
  }

const updateFile = (owner, repo, path, message, content, sha, branch) => {
  return new Promise((resolve, reject) => {
    github.repos.updateFile({
          owner: owner,
          repo: repo,
          path: path,
          message: message,
          content: Base64.encode(content), //
          sha: sha,
          branch: branch
      }, (err, res) => err?reject(err):resolve('File chaingear.json constructed and commited'))
  })
}
module.exports = {
  readFile: readFile,
  apiReq: apiReq,
  updateFile: updateFile,
  getRef: getRef,
  getTree: getTree,
  getBlob: getBlob,
  getFileBlob: getFileBlob
}
