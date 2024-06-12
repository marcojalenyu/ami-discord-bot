const Basket = require("../../models/Basket");
const Pattern = require("../../models/Pattern");

module.exports = {
    name: 'next',
    description: 'Go to the next step in the current pattern.',
    // deleted: true,
    // devOnly: Boolean,
    // testOnly: Boolean,
    // options: Object[],

    callback: async (client, interaction) => {
        try {
            const basket = await Basket.findOne({ guildId: interaction.guildId });
            if (!basket) {
                interaction.reply({
                    content: 'Error: No basket registered. Please register a basket first.',
                    ephemeral: true
                });
            } else {
                const pattern = await Pattern.findOne({ _id: basket.currentPattern, basketId: basket._id });
                if (!pattern) {
                    interaction.reply({ 
                        content: 'Error: No pattern selected. Use /crochet to start crocheting a pattern.',
                        ephemeral: true
                    });
                } else {
                    const steps = pattern.steps;
                    if (steps.length === 0) {
                        interaction.reply({ 
                            content: `Error: No steps found in pattern "${pattern.name}".`,
                            ephemeral: true
                        });
                    } else {
                        // If the current step is already the last step, return an error
                        if (pattern.currentStep === steps.length) {
                            interaction.reply({ 
                                content: `Error: Pattern already completed.`,
                                ephemeral: true
                            });
                        } else {
                            pattern.currentStep++;
                            const currentIndex = pattern.currentStep;
                            const currentStep = pattern.steps[currentIndex];
                            await pattern.save();
                            if (pattern.currentStep === steps.length) {
                                interaction.reply({ content: `Pattern completed!`});
                            } else {
                                interaction.reply({ content: `Step ${currentIndex+1}/${steps.length}: ${currentStep}`});
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error);
            interaction.reply({ 
                content: 'There was an error moving to the next! Try again.', 
                ephemeral: true 
            });
        }
    }
}