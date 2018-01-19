const fs = require('fs')
const dateFormat = require('dateformat')
const plotGen = require('./plot_generator.js')
const form = {
  blockchain: {
    project_name: 'Dether'
  },
  short_description: {
    text: 'Some description'
  },
  token: {
    name: 'Token',
    symbol: 'TOK',
    token_purpose: 'ICO token',
    inflation_rate: '10% annual decrease'
  },
  ico: {
    ico_start_date_date: '2018-01-25T00:00:00',
    ico_end_date_date: '2018-02-30T00:00:00',
    reg_start_date_date: '2018-01-15T00:00:00',
    reg_end_date_date: '2018-01-24T00:00:00',
    reg_url: 'https://ico.coolblockchain.io/reg',
    sales_url: 'https://ico.coolblockchain.io',
    sales_agreement: 'https://ico.coolblockchain.io/terms',
    issued_tokens: 150000000,
    cap_limit_currency: 'USD',
    cap_limit_amount: 10000000
  },
  funds: {
    distr: [
      {description: 'bounty', percent: 25},
      {description: 'ico', percent: 30}
    ],
    proceeds: [
      {description: 'development', percent: 40},
      {description: 'marketing', percent: 50}
    ]
  },
  links: [
    {
                "type": "website",
                "name": "adamant.im",
                "url": "https://adamant.im/",
                "tags": [
                    "Main"
                ]
            },
            {
                "type": "paper",
                "name": "ADAMANT Whitepaper",
                "url": "https://adamant.im/whitepaper/adamant-whitepaper-en.pdf",
                "tags": [
                    "Main",
                    "Science"
                ]
            },
            {
                "type": "github",
                "name": "ADAMANT Github",
                "url": "https://github.com/adamant-im",
                "icon": "github.png",
                "tags": [
                    "Main",
                    "Code"
                ]
            },
            {
                "type": "forum",
                "name": "Bitcointalk",
                "url": "https://bitcointalk.org/index.php?topic=2635646.0",
                "icon": "bitcointalk.png",
                "tags": [
                    "News"
                ]
            },
            {
                "type": "twitter",
                "name": "Twitter",
                "url": "https://twitter.com/adamant_im",
                "icon": "twitter.png",
                "tags": [
                    "News"
                ]
            },
            {
                "type": "custom",
                "name": "ADAMANT Telegram",
                "url": "https://t.me/adamant_im",
                "icon": "telegram.png",
                "tags": [
                    "News"
                ]
            },
            {
                "type": "custom",
                "name": "Facebook",
                "url": "https://www.facebook.com/adamant.im/",
                "icon": "facebook.png",
                "tags": [
                    "News"
                ]
            }
  ]
}
const createPost = (form) => {
  plotGen(form.funds.proceeds, `./files/${form.blockchain.project_name}/funds_distr.png`, 3)
  plotGen(form.funds.distr, `./files/${form.blockchain.project_name}/token_distr.png`, 2)
  // String for short description
  const descrStr = `## Краткое описание:
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
    `\nКоличество токенов, выставленных на продажу: ${form.ico.issued_tokens} ${form.token.symbol}\n`:''
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

  ![](http://ninja-analytics.ru/files/${form.blockchain.project_name}/token_distr.png)

  Описание | Процент
  --|--${tokenDistrStr}

  ### Как будут использованы собранные средства:

  ![](http://ninja-analytics.ru/files/${form.blockchain.project_name}/funds_distr.png)

  Описание | Процент
  --|--${fundsDistrStr}

  `
  // Links string
  const linksList = form.links.reduce((str, curr) => str += `\n* [${curr.name}](${curr.url})`, '')
  const linksStr = `\n## Полезные ссылки\n${linksList}`
  // Full post string
  const fullPost = `${descrStr}${tokenStr}${icoStr}${linksStr}`
  // return fullPost
  fs.writeFileSync('./test.md', fullPost)
}
//module.exports = createPost
createPost(form)
