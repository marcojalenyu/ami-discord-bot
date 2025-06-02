const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");
const Pattern = require("../../models/Pattern");
const Basket = require("../../models/Basket");

module.exports = {
    name: 'steps',
    description: 'View steps in a pattern.',
    // deleted: true,
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'name',
            description: 'Label your pattern',
            type: ApplicationCommandOptionType.String,
            required: true
        },
    ],

    callback: async (client, interaction) => {
        try {
            const basket = await Basket.findOne({ guildId: interaction.guildId });
            if (!basket) {
                interaction.reply({
                    content: 'Error: No basket registered. Please /register a basket first.',
                    MessageFlags: MessageFlags.Ephemeral
                });
            } else {
                const name = interaction.options.getString('name');
                const pattern = await Pattern.findOne({ name: name, basketId: basket._id });
                if (!pattern) {
                    interaction.reply({ 
                        content: `Error: Pattern "${name}" not found in basket.`,
                        MessageFlags: MessageFlags.Ephemeral
                    });
                } else {
                    const steps = pattern.steps;
                    if (steps.length === 0) {
                        interaction.reply({ content: `No steps found in pattern "${name}".` });
                    } else {
                        let message = `Steps in Pattern **${name}**:\n`;
                        for (let i = 0; i < steps.length; i++) {
                            message += `${i + 1}. ${steps[i]}`;
                            if (i === pattern.currentStep) {
                                message += ' <---';
                            }
                            message += '\n';
                        }
                        interaction.reply({ content: message });
                    }
                }
            }
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: 'Oh no! The pattern got tangled! Please try again.',
                MessageFlags: MessageFlags.Ephemeral
            });
        }
    }
}