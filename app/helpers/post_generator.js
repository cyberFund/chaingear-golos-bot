const fs = require('fs')
const dateFormat = require('dateformat')
const plotGen = require('./plot_generator.js')

const createPost = (form) => {
  fs.mkdir(`./files/${form.blockchain.project_name}`, (err) => {
    plotGen(form.funds.proceeds, `./files/${form.blockchain.project_name}/funds_distr.png`, 2)
    plotGen(form.funds.distr, `./files/${form.blockchain.project_name}/token_distr.png`, 1)
  })
  // String for short description
  const descrStr = `Автор поста: ${form.username}\n## Краткое описание:
  ${form.short_description.text}`

  // String for token description
  let purposeStr = ''
  switch (form.token.token_purpose) {
    case 'ICO token':
      purposeStr = 'токен будет использоваться только для сбора средств в ходе ICO\n'
      break
    case 'App token':
      purposeStr = 'токен будет использоваться только в приложении\n'
      break
    case 'Both':
      purposeStr = 'токен будет использоваться как в ходе ICO, так и в приложении\n'
    default:
      purposeStr = 'неизвестно\n'
      break
  }
  const supplyStr = (form.token.total_supply !== undefined)?
    `\nОбщее число токенов (supply): ${form.token.total_supply}\n`:''
  const inflationStr = (form.token.inflation_rate === undefined || form.token.inflation_rate=== '')?
    '':`\nИнфляция/дефляция: ${form.token.inflation_rate}\n`
  const govProj = (form.token.governance_rights_project === undefined || form.token.governance_rights_project === '')?
    '':`\nПрава на участие в развитии проекта: ${form.token.governance_rights_project}\n`
  const govOrg = (form.token.governance_rights_org === undefined || form.token.governance_rights_org === '')?
    '':`\nПрава на получение доли в организации: ${form.token.governance_rights_org}\n`
  const tokenStr = `\n## Токен
  Название: ${form.token.name} (${form.token.symbol})

  Назначение: ${purposeStr}${supplyStr}${inflationStr}${govProj}${govOrg}`

  // String forICO description
  const regDatesStr = (form.ico.reg_start_date_date!==undefined && form.ico.reg_end_date_date!==undefined)?
    `\nПериод проведения регистрации: ${dateFormat(form.ico.reg_start_date_date, 'fullDate')} - ${dateFormat(form.ico.reg_end_date_date, 'fullDate')}\n`:''
  const regSiteStr = (form.ico.reg_url!==undefined)?
    `\nСтраница регистрации: ${form.ico.reg_url}\n`:''
  const issuedStr = (form.ico.issued_tokens!==undefined)?
    `\nz\nКоличество токенов, выставленных на продажу: ${form.ico.issued_tokens} ${form.token.symbol}\n`:''
  const tokenDistrDate = (form.ico.token_distr_date!==undefined)?
    `\nДата распределения токенов: ${dateFormat(form.ico.token_distr_date, 'fullDate')}\n`:''
  const capStr = (form.ico.cap_limit_amount!==undefined)?
    `\nЛимит: ${form.ico.cap_limit_amount} ${form.ico.cap_limit_currency}\n`:''
  const tokenDistrStr = form.funds.distr.reduce((str, curr) => {
    str += `\n${curr.description} | ${curr.percent}`
    return str
  }, '')
  const fundsDistrStr = form.funds.proceeds.reduce((str, curr) => str += `\n${curr.description} | ${curr.percent}`, '')
  const icoStr = `\n## ICO${regDatesStr}${regSiteStr}
  Период проведения ICO: ${dateFormat(form.ico.ico_start_date_date, 'fullDate')} - ${dateFormat(form.ico.ico_end_date_date, 'fullDate')}

  Страница краудсейла: ${form.ico.sales_url}${issuedStr}${tokenDistrDate}${capStr}

  Условия проведения ICO: ${form.ico.sales_agreement}

  ### Распределение токенов

  ![](http://ninja-analytics.ru/static/${form.blockchain.project_name}/token_distr.png)

  Описание | Процент
  --|--${tokenDistrStr}

  ### Как будут использованы собранные средства:

  ![](http://ninja-analytics.ru/static/${form.blockchain.project_name}/funds_distr.png)

  Описание | Процент
  --|--${fundsDistrStr}

  `
  // Links string
  const linksList = form.links.reduce((str, curr) => str += `\n* [${curr.name}](${curr.url})`, '')
  const linksStr = `\n## Полезные ссылки\n${linksList}`
  // Full post string
  const fullPost = `${descrStr}${tokenStr}${icoStr}${linksStr}\n\nЭтот пост создан участником [краудсорс-программы](https://golos.io/cyberanalytics/@cyberanalytics/link-to-post-with-programm-description), запущенной сообществом @cyberanalytics. Все выплаты за пост будут переведены в кошелек участника`
  return fullPost
  //fs.writeFileSync('./test.md', fullPost)
}
module.exports = createPost
// createPost(form)
