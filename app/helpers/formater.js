const formatDuration = (ms) => {
  const seconds = ms/60
  if(seconds===0) return 'now'
  const date = {
    second: seconds%60,
    minute: (Math.floor(seconds/60)>=60)?Math.floor(seconds/60)%60:Math.floor(seconds/60),
    hour: (Math.floor(seconds/60/60)>24)?Math.floor(seconds/60/60)%24:Math.floor(seconds/60/60),
    day: (Math.floor(seconds/60/60/24)>365)?Math.floor(seconds/60/60/24)%365:Math.floor(seconds/60/60/24),
    year: Math.floor(seconds/60/60/24/365)
  }
  const dateArr = []
  for (key in date) {
    if(date[key]>=1&&date[key]<2) dateArr.push(`${date[key]} ${key}`)
    else if(date[key]>1) dateArr.push(`${date[key]} ${key}s`)
    else null
  }
  return dateArr.reverse().join(', ').replace(/,([^,]*)$/, ' and'+'$1')
}
module.exports = {
  formatDuration: formatDuration
}
