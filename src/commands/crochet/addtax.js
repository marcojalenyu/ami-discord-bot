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
            description: 'Tax/commission rate (in decimal, e.g. 0.05 for +5% tax)',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'fee',
            description: 'Additional fee (optional, in decimal, e.g. 0.029 for +2.9% fee)',
            type: ApplicationCommandOptionType.Number,
            required: false,
        }
    ],

    callback: async (client, interaction) => {
        try {
            const price = interaction.options.getNumber('price');
            const taxRate = interaction.options.getNumber('tax');
            const percentFee = interaction.options.getNumber('fee') || 0;

            const tax = price * taxRate;
            const totalPrice = price + tax;
            const fee = price * percentFee;

            let message = `Price Breakdown\n`;
            message += `-----------\n`;
            message += `Raw Price (P): ${price}\n`;
            message += `Tax Rate (t): ${(taxRate*100).toFixed(2)}%\n`;
            if (percentFee > 0) {
                message += `Fee Rate (f): ${(percentFee*100).toFixed(2)}%\n`;
            }
            message += `-----------\n`;
            message += `Raw Price (P): ${price}\n`;
            message += `Tax (T = P x t): ${tax.toFixed(2)}\n`;
            if (percentFee > 0) {
                message += `Fee (F = P x f): ${fee.toFixed(2)}\n`;
            }
            message += `-----------\n`;
            message += `Subtotal: ${(totalPrice).toFixed(2)}\n`;
            interaction.reply({
                content: message,
                flags: MessageFlags.Ephemeral
            });
        } catch (error) {
            console.error(error);
            interaction.reply({ 
                content: 'Oh no! The calculator ran out of batteries. Try again.', 
                flags: MessageFlags.Ephemeral
            });
        }
    }
}