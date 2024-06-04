const { ApplicationCommandOptionType } = require("discord.js");
const Basket = require("../../models/Basket");
const Pattern = require("../../models/Pattern");

module.exports = {
    name: 'move',
    description: 'Move to any step in the current pattern.',
    // deleted: true,
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'step',
            description: 'The step to move to.',
            type: ApplicationCommandOptionType.Integer,
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
                // Find the current pattern in the basket
                const pattern = await Pattern.findOne({ _id: basket.currentPattern, basketId: basket._id });
                if (!pattern) {
                    interaction.reply({ content: `No pattern selected. Use \`/crochet\` to select a pattern.` });
                    return;
                } else {
                    // Move to the selected step
                    const step = interaction.options.getInteger('step');
                    if (step < 1 || step > pattern.steps.length) {
                        interaction.reply({ content: `Invalid step number. Please enter a number between 1 and ${pattern.steps.length}.` });
                        return;
                    } else {
                        pattern.currentStep = step - 1;
                        await pattern.save();
                        interaction.reply({ content: `Moved to step ${step}.` });
                    }
                }
            }
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error while trying to move to the step.' });
        }
    }
}