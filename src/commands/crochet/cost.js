const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'cost',
    description: 'Calculate the cost of a pattern',
    // deleted: true,
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'used',
            description: 'Grams of yarn used in the project',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'yarn',
            description: 'Amount of grams per yarn ball',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'price',
            description: 'Price of a yarn ball',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
    ],

    callback: async (client, interaction) => {
        try {
            const used = interaction.options.getNumber('used');
            const yarn = interaction.options.getNumber('yarn');
            const price = interaction.options.getNumber('price');
            const balls = used / yarn;
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