const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");

module.exports = {
    name: 'addtax',
    description: 'Compute price of product with tax (i.e. PayPal fee)',
    // deleted: true,
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'price',
            description: 'Raw price of the product',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'tax',
            description: 'Tax/commission rate (e.g. 5 for 5%)',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'fee',
            description: 'Additional percent fee (optional)',
            type: ApplicationCommandOptionType.Number,
            required: false,
        }
    ],

    callback: async (client, interaction) => {
        try {
            const price = interaction.options.getNumber('price');
            const taxRate = interaction.options.getNumber('tax')/100;
            const percentFee = interaction.options.getNumber('fee')/100 || 0;

            const tax = price * taxRate;
            const totalPrice = price + tax;
            const fee = totalPrice * percentFee;

            let message = `Price Breakdown\n`;
            message += `-----------\n`;
            message += `Raw Price (P): ${price}\n`;
            message += `Tax Rate (t): ${(taxRate*100).toFixed(2)}%\n`;
            if (percentFee > 0) {
                message += `Fee Rate (f): ${(percentFee*100).toFixed(2)}%\n`;
            }
            message += `-----------\n`;
            message += `Raw Price (P): ${price}\n`;
            message += `Tax Amount (T = P x t): ${tax.toFixed(2)}\n`;
            if (percentFee > 0) {
                message += `Fee (F = (P + T) x f): ${fee.toFixed(2)}\n`;
            }
            message += `-----------\n`;
            message += `Price: ${(price-fee).toFixed(2)}\n`;
            message += `Tax: ${tax.toFixed(2)}\n`;
            if (percentFee > 0) {
                message += `Fee: ${fee.toFixed(2)}\n`;
            }
            message += `-----------\n`;
            message += `Subtotal: ${(totalPrice).toFixed(2)}\n`;
            interaction.reply({
                content: message,
                MessageFlags: MessageFlags.Ephemeral
            });
        } catch (error) {
            console.error(error);
            interaction.reply({ 
                content: 'Oh no! The calculator ran out of batteries. Try again.', 
                MessageFlags: MessageFlags.Ephemeral
            });
        }
    }
}