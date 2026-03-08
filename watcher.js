const Invoice = require("./models/invoice")

function startWatcher(client){

setInterval(async()=>{

const invoices = await Invoice.find({status:"pending"})

for(const invoice of invoices){

// here we would normally call blockchain APIs
// to detect tx + confirmations

// simplified placeholder logic

if(invoice.confirmations >= 3){

invoice.status="paid"

await invoice.save()

const user = await client.users.fetch(invoice.user)

user.send(`✅ Payment confirmed for invoice ${invoice.invoiceId}`)

}

}

},30000)

}

module.exports={startWatcher}
