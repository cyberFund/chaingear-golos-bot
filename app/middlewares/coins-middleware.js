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
    return blob.content.ico.phases.map(phase => {
      return {
        date: new Date(phase.dates.end_date)
        currency: phase.raised_funds.currency
      }
    })
  }).reduce((prev, curr) => prev.concat(curr)
  getCurrencisByDates(dates)
    .then(prices => {
      req.prices = prices
      next()
    })
}
