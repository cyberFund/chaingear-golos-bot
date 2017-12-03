const config = require('../../config.json')
const getCommits = require('../middlewares/get-commits-middleware.js')
const getBlobs = require('../middlewares/blobs-middleware.js')
const getCoins = require('../middlewares/coins-middleware.js')
const prms = require('../helpers/promisified.js')
const format = require('../helpers/formater.js')
const githubMiddleware = require('github-webhook-middleware')({
  secret: config.pull_webhook_secret
})

module.exports = (app, db) => {
  app.post('/pull', [githubMiddleware, getCommits, getBlobs, getCoins], (req, res) => {
    // Updates blobs and sends it to the head repo
    const updatedFiles = req.blobs.map(blob => {
      if(blob.content.ico===undefined) return null
      blob.content.ico.phases = blob.content.ico.phases.map(phase => {
        //console.log(phase);
        if(phase.dates.end_date==='') return null
        const currency = phase.raised_funds[0].currency
        const coins = ['ETH', 'BTC', 'USD'].filter(coin => coin !== currency)
        const prices = req.prices.filter(price => price.date.toString() === new Date(new Date(phase.dates.end_date).valueOf() + 1.8e+7).toString())
        console.log(prices);
        phase.raised_funds.push({
          currency: coins[0],
          amount: req.prices[0].prices[coins[0]] * phase.raised_funds[0].amount
        })
        phase.raised_funds.push({currency: coins[1], amount: prices[0].prices[coins[1]] * phase.raised_funds[0].amount})
        const duration = new Date(phase.dates.end_date).valueOf() - new Date(phase.dates.start_date).valueOf()
        phase.dates.duration = format.formatDuration(duration)

        return phase
      })
      return blob
    }).filter(phase => phase !== null)
    console.log('End');
    // prms.updateFile
  })
}
