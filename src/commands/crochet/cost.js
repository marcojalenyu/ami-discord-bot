const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'cost',
    description: 'Calculate material cost for a crochet project',
    // deleted: true,
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'yarn',
            description: 'Amount of grams per yarn ball',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'remaining',
            description: 'Amount of grams of remaining yarn in the ball',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'price',
            description: 'Price of the yarn ball',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
    ],

    callback: async (client, interaction) => {
        try {
            const yarn = interaction.options.getNumber('yarn');
            const remaining = interaction.options.getNumber('remaining');
            const price = interaction.options.getNumber('price');
            const balls = (yarn-remaining) / yarn;
            const cost = balls * price;
            let message = `Cost Breakdown\n`;
            message += `-----------\n`;
            message += `Yarn (Y): ${yarn}g\n`;
            message += `Remaining (R): ${remaining}g\n`;
            message += `Balls (B): (Y - R) / Y = ${balls.toFixed(2)}\n`;
            message += `Price (P): ${price} per ball\n`;
            message += `-----------\n`;
            message += `Cost: B x P = ${cost.toFixed(2)}`;

            interaction.reply({
                content: message,
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            interaction.reply({ 
                content: 'Oh no! The calculator ran out of batteries. Try again.', 
                ephemeral: true 
            });
        }
    }
}