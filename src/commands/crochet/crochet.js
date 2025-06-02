const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");
const Basket = require("../../models/Basket");
const Pattern = require("../../models/Pattern");

module.exports = {
    name: 'crochet',
    description: 'Start crocheting a pattern.',
    // deleted: true,
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'pattern',
            description: 'The pattern to start crocheting.',
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
                // Find the pattern in the basket
                const patternName = interaction.options.getString('pattern');
                const pattern = await Pattern.findOne({ name: patternName, basketId: basket._id });
                if (pattern && pattern.steps.length > 0) {
                    // Set the current pattern to the selected pattern
                    basket.isRecording = false;
                    basket.currentPattern = pattern._id;
                    await basket.save();
                    // Go to the current step
                    const steps = pattern.steps;
                    const step = steps[pattern.currentStep];
                    // Send the current step to the channel
                    interaction.reply({ content: `Starting pattern "${patternName}".\nStep ${pattern.currentStep+1}/${steps.length}: ${step}` });
                } else if (pattern && pattern.steps.length === 0) {
                    interaction.reply({ 
                        content: `Error: No steps found. "/record ${patternName}" to add steps.`,
                        MessageFlags: MessageFlags.Ephemeral
                    });
                } else {
                    interaction.reply({ 
                        content: `Error: Pattern "${patternName}" not found in basket.`,
                        MessageFlags: MessageFlags.Ephemeral
                    });
                }
            }
        } catch (error) {
            console.error(error);
            interaction.reply({ 
                content: 'Oh no! The pattern got crumpled! Try again.', 
                MessageFlags: MessageFlags.Ephemeral
            });
        }
    }
}