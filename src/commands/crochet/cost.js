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
            interaction.reply({
                content: `The project used ${balls.toFixed(2)} yarn balls, costing ${cost.toFixed(2)}.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            interaction.reply('Oh no! The yarn calculator ran out of batteries.');
        }
    }
}