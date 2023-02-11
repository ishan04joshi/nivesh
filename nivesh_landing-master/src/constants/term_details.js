import riskFree from '../lotties/risk_free.json'
import highRisk from '../lotties/high_risk.json'
import veryHighRisk from '../lotties/very_high_risk.json'
import shortTerm from '../lotties/short_term.json'
import mediumTerm from '../lotties/medium_term.json'
import longTerm from '../lotties/long_term.json'

const term_details = [
    {
        heading: "short term",
        description: "Fund to invest upto 1 year",
        image: shortTerm
    },
    {
        heading: "medium term",
        description: "Fund toInvest for 1 to 3 years",
        image: mediumTerm
    },
    {
        heading: "long term",
        description: "Fund to invest more than 3 years",
        image: longTerm
    },
]

export default term_details;
