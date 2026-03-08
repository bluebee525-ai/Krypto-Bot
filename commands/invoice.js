const { EmbedBuilder } = require("discord.js")
const QRCode = require("qrcode")

const Invoice = require("../models/invoice")
const { getPrice } = require("../services/priceService")
const config = require("../config")

module.exports={

name:"invoice",

async execute(interaction){

const usd = interaction.options.getNumber("amount")
const coin = interaction.options.getString("coin")

const price = await getPrice(coin)

const cryptoAmount = usd/price

const invoiceId = Math.floor(Math.random()*1000000)

const address = config.addresses[coin]

await Invoice.create({

invoiceId,
user:interaction.user.id,
coin,
usd,
cryptoAmount,
address

})

const qr = await QRCode.toDataURL(address)

const embed = new EmbedBuilder()

.setTitle("💳 Crypto Invoice")
.setDescription(`Invoice ID: **${invoiceId}**`)
.addFields(
{name:"Amount",value:`$${usd}`,inline:true},
{name:"Send",value:`${cryptoAmount.toFixed(6)} ${coin}`,inline:true},
{name:"Address",value:address}
)
.setImage(qr)
.setColor("Green")

interaction.reply({embeds:[embed]})

}

}
