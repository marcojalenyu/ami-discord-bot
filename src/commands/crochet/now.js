const Basket = require("../../models/Basket");
const Pattern = require("../../models/Pattern");

module.exports = {
    name: 'now',
    description: 'View the current pattern and step.',
    // deleted: true,
    // devOnly: Boolean,
    // testOnly: Boolean,
    // options: Object[],
    callback: async (client, interaction) => {
        try {
            const basket = await Basket.findOne({ guildId: interaction.guildId });
            if (!basket) {
                interaction.reply({
                    content: 'Error: No basket registered. Please /register a basket first.',
                    MessageFlags: MessageFlags.Ephemeral
                });
            } else {
                const pattern = await Pattern.findOne({ _id: basket.currentPattern, basketId: basket._id });
                if (!pattern) {
                    interaction.reply({ 
                        content: 'Error: No pattern selected. Use /crochet to start crocheting a pattern.',
                        MessageFlags: MessageFlags.Ephemeral
                     });
                } else {
                    const steps = pattern.steps;
                    if (steps.length === 0) {
                        interaction.reply({ 
                            content: `Error: No steps found in pattern "${pattern.name}".`,
                            MessageFlags: MessageFlags.Ephemeral
                        });
                    } else {
                        if (pattern.currentStep === steps.length) {
                            interaction.reply({ content: `Pattern: "${pattern.name}"\nPattern completed!`});
                        } else {
                            const currentIndex = pattern.currentStep;
                            const currentStep = pattern.steps[currentIndex];
                            interaction.reply({ content: `Pattern: "${pattern.name}"\nStep ${currentIndex+1}/${steps.length}: ${currentStep}`});
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error);
            interaction.reply({ 
                content: 'There was an error finding the current step! Try again.', 
                MessageFlags: MessageFlags.Ephemeral
            });
        }
    }
}