const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");

module.exports = {
    name: 'addition',
    description: 'Add two numbers together',
    // deleted: true,
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'num1',
            description: 'The first number',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'num2',
            description: 'The second number',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
    ],

    callback: async (client, interaction) => {
        try {
            const num1 = interaction.options.getNumber('num1');
            const num2 = interaction.options.getNumber('num2');
            const sum = num1 + num2;
            interaction.reply({
                content: `The sum of ${num1} and ${num2} is ${sum}.`,
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