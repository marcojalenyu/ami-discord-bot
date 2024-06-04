const { ApplicationCommandOptionType } = require("discord.js");
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
            const basket = await Basket.findOne({ guildId: interaction.guildId }) ||
                await Basket.findOne({ userId: interaction.user.id });

            if (!basket || interaction.guildId !== basket.guildId) {
                interaction.reply({
                    content: 'Error: No basket registered. Please register a basket first.',
                });
                return;
            } else {
                const name = interaction.options.getString('name');
                const pattern = await Pattern.findOne({ name: name, basketId: basket._id });

                if (!pattern) {
                    interaction.reply({ content: `Pattern "${name}" not found in basket.` });
                    return;
                } else {
                    const steps = pattern.steps;
                    if (steps.length === 0) {
                        interaction.reply({ content: `No steps found in pattern "${name}".` });
                        return;
                    } else {
                        const message = `Steps in pattern "${name}":\n`;
                        for (let i = 0; i < steps.length; i++) {
                            message += `${i + 1}. ${steps[i]}`;
                            if (i !== pattern.currentStep) {
                                message += ' <--';
                            }
                            message += '\n';
                        }
                        interaction.reply({ content: message });
                    }
                }
            }
        } catch (error) {
            console.error(error);
            interaction.reply('Oh no! The pattern got crumpled! Please try again.');
        }
    }
}