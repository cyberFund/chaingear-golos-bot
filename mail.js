const fs = require('fs')
const readline = require('readline')
const google = require('googleapis')
const googleAuth = require('google-auth-library')
const Base64 = require('js-base64').Base64
const prms = require('./app/helpers/promisified.js')
const config = require('./config.json')

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send']
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json'

const gmail = google.gmail('v1')
const url = 'https://api.github.com/repos/ninjascant/golos-academy/issues'
let options = {
  headers: {
    'Authorization': "Basic " + new Buffer('ninjascant' + ":" + config.git_key1).toString("base64"),
    'User-Agent': 'ninjascant'
  },
  body: '',
  json: true
}

const listMessages = (auth) => {
  gmail.users.messages.list({
    auth: auth,
    userId: 'me'
  }, (err, res) => {
    if(err) {
      console.log('An error occured while processing messages list request')
      return
    }
    for (var i = 0; i < res.messages.length; i++) {
      getMessage(auth, res.messages[i].id, i)
    }
  })
}
const getMessage = (auth, id, n) => {
  gmail.users.messages.get({
    auth: auth,
    userId: 'me',
    id: id
  }, (err, res) => {
    if(err) {
      console.log(err)
      return
    }
    if(res.labelIds.indexOf('SENT')!==-1|| res.labelIds.indexOf('UNREAD')===-1) return
    const from_ = res.payload.headers.filter(header=>header.name === 'Return-Path')[0].value

    options.body = {
      title: 'Listing/update request from mail',
      body: `Request from ${from_}`,
      labels: 'Awaiting',
      assignees: 'ninjascant'
    }
    let mailLines = []
    mailLines.push('From: "Maxim Odegov" <m.odegov@cyberfund.io>')
    mailLines.push('To: cvlt.mao@gmail.com')
    mailLines.push('Content-type: text/html;charset=iso-8859-1')
    mailLines.push('MIME-Version: 1.0')
    mailLines.push('Subject: ICO Radar listing')
    mailLines.push('')
    mailLines.push('Hello. ')
    const email = mailLines.join('\r\n').trim()
    modifyLabels(auth, id, [''], [])
    sendMail(auth, email)
    prms.apiPostReq(url, options)
      .then(res=>console.log(res))
      .catch(err=>console.error(err))
  })
}
const sendMail = (auth, mail) => {
  mail = Base64.encode(mail)
  gmail.users.messages.send({
    auth: auth,
    userId: 'me',
    resource: {
      raw: mail
    }
  })
}
const modifyLabels = (auth, id, remove, add) => {
  gmail.users.messages.modify({
    auth: auth,
    userId: 'me',
    id: id,
    addLabelIds: add,
    removeLabelIds: remove
  })
}
const credentials_json = JSON.parse(fs.readFileSync('client_secret.json'))

authorize(credentials_json, listMessages)

// Authorization
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}
