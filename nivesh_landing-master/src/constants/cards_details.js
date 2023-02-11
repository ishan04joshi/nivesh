import riskFree from '../lotties/risk_free.json'
import highRisk from '../lotties/high_risk.json'
import veryHighRisk from '../lotties/very_high_risk.json'
import shortTerm from '../lotties/short_term.json'
import mediumTerm from '../lotties/medium_term.json'
import longTerm from '../lotties/long_term.json'


const card_details = [
    {
        heading: "low risk",
        description: "Fund Return under 10%",
        image: riskFree
    },
    {
        heading: "medium risk",
        description: "Fund Return under 10 to 20%",
        image: highRisk
    },
    {
        heading: "high risk",
        description: "Fund Return more than 20%",
        image: veryHighRisk
    },
];


export default card_details;