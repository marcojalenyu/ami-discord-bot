const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");

module.exports = {
    name: 'tax',
    description: 'Compute tax amount of product and its price pre-tax (i.e. PayPal fee)',
    deleted: true,
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
            description: 'Tax/commission rate (in decimal form)',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
    ],

    callback: async (client, interaction) => {
        try {
            const price = interaction.options.getNumber('price');
            const tax = interaction.options.getNumber('tax');
            const taxAmount = price * tax;
            let message = `Tax Breakdown\n`;
            message += `-----------\n`;
            message += `Full Price (P): ${price}\n`;
            message += `Tax (T): ${(tax*100).toFixed(2)}%\n`;
            message += `-----------\n`;
            message += `Price (No Tax): P - (P * T) = ${(price - taxAmount).toFixed(2)}\n`;
            message += `Tax Amount: P * T = ${taxAmount.toFixed(2)}\n`;            
            message += `At a tax rate of ${(tax*100).toFixed(2)}%, the product is ${(price - taxAmount).toFixed(2)} before tax.`;
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