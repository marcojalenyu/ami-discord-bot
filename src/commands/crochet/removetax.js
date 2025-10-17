const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");

module.exports = {
    name: 'removetax',
    description: 'Compute tax amount of product and its price pre-tax (i.e. PayPal fee)',
    // deleted: true,
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'price',
            description: 'Total price of the product',
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
            description: 'Additional fee (optional, in decimal, e.g. 0.029 for 2.9% fee)',
            type: ApplicationCommandOptionType.Number,
            required: false,
        }
    ],

    callback: async (client, interaction) => {
        try {
            const totalPrice = interaction.options.getNumber('price');
            const taxRate = interaction.options.getNumber('tax');
            const percentFee = interaction.options.getNumber('fee') || 0;

            // total = P * (1 + t) * (1 + f)
            const priceBeforeTax = totalPrice / (1+taxRate);
            const taxAmount = priceBeforeTax * taxRate;
            const feeAmount = priceBeforeTax * percentFee;
            const priceBeforeTaxAndFee = priceBeforeTax - feeAmount;

            let message = `Price Breakdown\n`;
            message += `-----------\n`;
            message += `Total Price (incl. tax & fee): ${totalPrice.toFixed(2)}\n`;
            message += `Tax Rate (t): ${(taxRate * 100).toFixed(2)}%\n`;
            if (percentFee > 0) {
                message += `Fee Rate (f): ${(percentFee * 100).toFixed(2)}%\n`;
            }
            message += `-----------\n`;
            message += `Price before Tax (P): ${priceBeforeTax.toFixed(2)}\n`;
            message += `Tax Amount (T = P x t): ${taxAmount.toFixed(2)}\n`;
            if (percentFee > 0) {
                message += `Fee (F = (P + T) x f): ${feeAmount.toFixed(2)}\n`;
            }
            message += `-----------\n`;
            message += `Raw Price: ${priceBeforeTaxAndFee.toFixed(2)}\n`;

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