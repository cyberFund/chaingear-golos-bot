const mongoose = require('mongoose')

const ProjectSchema = mongoose.Schema({
  addedAt: {type: Date, default: Date.now},
  addedBy: {type: String},
  projectInfo: {
    blockchain: {
      project_name: {type: String, required: true, unique: true},
      headline: String,
      logo: String,
      state: {type: Number, required: true},
      asset_type: {type: String, required: true},
      dependency: {type: String, required: true},
      consensus_name: {type: String, required: true}
    },
    ico: {
      common_info: {
        is_ico: {type: Boolean, required: true},
        current_ico_phase: {type: Number, required: true},
        current_phase_status: {type: String, required: true},
        token_distribution: {
          total_supply: Number,
          shares: [
            {
              description: {type: String, required: true},
              percent: {type: Number, required: true}
            }
          ]
        },
        use_of_proceeds: [
          {
            description: {type: String, required: true},
            percent: {type: Number, required: true}
          }
        ]
      },
      phases: [
        {
          "phase_num": {type: Number, required: true},
          "phase_name": {type: String, required: true},
          "phase_status": {type: String, required: true},
          "registration": {
            "start_date": String,
            "end_date": String,
            "website": String,
            "terms": String
          },
          "terms": {
            "sales_agreement": {type: String, required: true},
            "sales_url": {type: String, required: true},
            "issued_tokens": Number,
            "sold_tokens": Number,
            "share_of_sold": Number,
            "token_distribution_date": String,
            "cap_limit": [
              {
                "currency": String,
                "amount": Number
              }
            ],
            "vesting": [
              {
                "supply_percent": Number,
                "lockup_condition": String,
                "lockup_date": String
              }
            ],
            "crowdsale_addresses": [
              {
                "currency": String,
                "address": String
              }
            ]
          },
          "dates": {
            "start_date": {type: String, required: true},
            "end_date": {type: String, required: true},
            "duration": String
          },
          "raised_funds": [
            {
              "currency": String,
              "amount": Number
            }
          ],
          "prices": {
            "token_final_price": [
              {
                "currency": String,
                "price": Number
              }
            ],
            "bonuses": [
              {
                "amount": String,
                "condition": String
              }
            ]
          },
          "contract": [
            {
              "contract_address": String,
              "contract_type": String
            }
          ]
        }
      ]
    },
    "app": {
      "info": [
        {
          "name": {type: String, required: true},
          "same_blockchain": {type: Boolean, required: true},
          "sources_availability": {type: Boolean, required: true},
          "app_status": {type: Number, required: true},
          "app_type": {type: String, required: true},
          "app_url": {type: String, required: true},
          "milestone": [
            {
              "number": Number,
              "name": String,
              "start_date": String,
              "end_date": String,
              "current_status": String
            }
          ],
          "links": [
            {
              "type": {type: String, required: true},
              "name": {type: String, required: true},
              "url": {type: String, required: true},
              "tags": [
                {"tag": {type: String, required: true}}
              ]
            }
          ]
        }
      ]
    },
    "token": [
      {
        "name": {type: String, required: true},
        "symbol": {type: String, required: true},
        "token_purpose": {type: String, required: true},
        "token_type": {type: String, required: true},
        "inflation_rate": String,
        "circulation_terms": String,
        "governance_rights_project": String,
        "governance_rights_org": String
      }
    ],
    "exchange": [
      {
        "exchange": String,
        "date": String,
        "price": String,
        "volume": String
      }
    ],
    "label": [
      {
        "blockchain": String,
        "address": String,
        "balance": String
      }
    ]
  }
})
module.exports = mongoose.model('project', ProjectSchema)