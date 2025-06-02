const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");
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
            const basket = await Basket.findOne({ guildId: interaction.guildId });
            if (!basket) {
                interaction.reply({
                    content: 'Error: No basket registered. Please /register a basket first.',
                    MessageFlags: MessageFlags.Ephemeral
                });
            } else {
                // Find the current pattern in the basket
                const pattern = await Pattern.findOne({ _id: basket.currentPattern, basketId: basket._id });
                if (!pattern) {
                    interaction.reply({ 
                        content: `Error: No pattern selected. Use /crochet to start crocheting a pattern.`,
                        MessageFlags: MessageFlags.Ephemeral
                    });
                } else {
                    // Move to the selected step
                    const step = interaction.options.getInteger('step');
                    if (step < 1 || step > pattern.steps.length) {
                        interaction.reply({ 
                            content: `Error: Invalid. Enter a number between 1 and ${pattern.steps.length}.`,
                            MessageFlags: MessageFlags.Ephemeral
                        });
                    } else {
                        pattern.currentStep = step - 1;
                        await pattern.save();
                        interaction.reply({ content: `Pattern ${pattern.name} moved to Step ${step}.` });
                    }
                }
            }
        } catch (error) {
            console.error(error);
            interaction.reply({ 
                content: 'There was an error moving to the step! Try again.', 
                MessageFlags: MessageFlags.Ephemeral
            });
        }
    }
}