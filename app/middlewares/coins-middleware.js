global.fetch = require('node-fetch')
const cc = require('cryptocompare')

const getCurrencisByDates = (dates) => {
  const promiseList = dates.map(date => {
    let coins = []
    switch (date.currency) {
      case 'ETH':
        coins.push('BTC', 'USD')
        break
      case 'BTC':
        coins.push('ETH', 'USD')
        break
      case 'USD':
        coins.push('ETH', 'BTC')
        break
      default:
        break
    }
    return new Promise((resolve, reject) => {
      cc.priceHistorical(date.currency, coins, date.date)
        .then(prices => {
          const tmp = {
            date: date.date,
            prices: prices
          }
          resolve(tmp)
        })
        .catch(error=>reject(error))
    })

  }) //coins.map(coin=>cc.priceHistorical(coin, )))
  return Promise.all(promiseList)
}

module.exports = (req, res, next) => {
  const dates = req.blobs.map(blob => {
    if(blob.content.ico === undefined) return null
    return blob.content.ico.phases.map(phase => {
      if(phase.dates.end_date!=='') {

        return {
          date: new Date(new Date(phase.dates.end_date).valueOf() + 1.8e+7),
          currency: phase.raised_funds[0].currency
        }
      } else {
        return null
      }
    }).filter(coin => coin!==null)
  }).filter(coin => coin!==null).reduce((prev, curr) => prev.concat(curr))
  //console.log(dates);
  getCurrencisByDates(dates)
    .then(prices => {
      req.prices = prices
      next()
    })
    .catch(err=>console.error(err))
}
