require("dotenv").config()

module.exports = {

addresses:{
BTC:process.env.BTC_ADDRESS,
ETH:process.env.ETH_ADDRESS,
BNB:process.env.BNB_ADDRESS,
LTC:process.env.LTC_ADDRESS,
USDT:process.env.USDT_ADDRESS
},

confirmations:parseInt(process.env.CONFIRMATIONS),
logChannel:process.env.LOG_CHANNEL

}
