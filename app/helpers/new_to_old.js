module.exports = (new_file) => {
  let old_json = {
    genesis_id: '',
    system: new_file.blockchain.project_name,
    dependencies: [],
    icon: new_file.blockchain.logo,
    token: {
      name: new_file.ico.common_info.token.name,
      symbol: new_file.ico.common_info.token.symbol
    },
    consensus: {
      consensus_type: new_file.ico.common_info.token.dependency,
      consensus_name: new_file.ico.common_info.token.dependency
    },
    descriptions: {
      state: 'Project',
      system_type: 'cryptoasset',
      headline: new_file.blockchain.headline
    },
    crowdsales: {
      start_date: new_file.ico.phases[0].dates.start_date,
      end_date: new_file.ico.phases[0].dates.end_date,
      end_date_plan: new_file.ico.phases[0].dates.end_date,
      genesis_address: [''],
      funding_term: new_file.ico.phases[0].terms.sales_agreement,
      funding_url: new_file.ico.phases[0].terms.sales_url,
      tokens_sold: new_file.ico.phases[0].terms.sold_tokens,
      tokens_issued: new_file.ico.phases[0].terms.issued_tokens,
      btc_raised: '',
      cap_limit: [], //new_file.ico.phases.terms.cap_limit
      raised: ['']
    },
    links: new_file.links
  }
  old_json.dependencies.push(new_file.ico.common_info.token.dependency)
  if(new_file.ico.phases[0].terms.cap_limit.amount>0) {
    old_json.crowdsales.cap_limit.push(`${new_file.ico.phases[0].terms.cap_limit.currency}=${new_file.ico.phases[0].terms.cap_limit.amount}`)
  }
  return old_json
}
