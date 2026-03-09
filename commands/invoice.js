// commands/invoice.js
const { MessageEmbed } = require("discord.js");
const QRCode = require("qrcode");
const mongoose = require("mongoose");

// Invoice schema
const invoiceSchema = new mongoose.Schema({
  invoiceId: String,
  userId: String,
  coin: String,
  amount: Number,
  wallet: String,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);

module.exports = {
  name: "invoice",
  description: "Create a crypto invoice",
  options: [
    {
      name: "amount",
      description: "Amount to pay",
      type: 10, // NUMBER type
      required: true,
    },
    {
      name: "coin",
      description: "Coin to pay with (BTC, LTC, ETH, BNB, USDT)",
      type: 3, // STRING type
      required: true,
    },
  ],
  async execute(interaction) {
    const amount = interaction.options.getNumber("amount");
    const coin = interaction.options.getString("coin").toUpperCase();
    const wallet = process.env[`${coin}_ADDRESS`];

    if (!wallet) {
      return interaction.reply({ content: `❌ Wallet for ${coin} not configured.`, ephemeral: true });
    }

    // Generate unique invoice ID
    const invoiceId = `INV${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create invoice in DB
    const invoice = new Invoice({
      invoiceId,
      userId: interaction.user.id,
      coin,
      amount,
      wallet,
    });

    await invoice.save();

    // Generate QR code (payment string)
    const paymentString = `${coin}:${wallet}?amount=${amount}`;
    const qrDataUrl = await QRCode.toDataURL(paymentString);

    // Reply with an embed
    const embed = new MessageEmbed()
      .setTitle(`Invoice #${invoiceId}`)
      .setDescription(`Pay **${amount} ${coin}** to the wallet below.`)
      .addField("Wallet", `\`${wallet}\``)
      .setImage(qrDataUrl)
      .setColor("GREEN")
      .setFooter({ text: "Krypto Bot – Crypto Invoices" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
