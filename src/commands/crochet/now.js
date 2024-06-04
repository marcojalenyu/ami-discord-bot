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
            const basket = await Basket.findOne({ guildId: interaction.guildId }) ||
                await Basket.findOne({ userId: interaction.user.id });
            if (!basket || interaction.guildId !== basket.guildId) {
                interaction.reply({
                    content: 'Error: No basket registered. Please register a basket first.',
                });
                return;
            } else {
                const pattern = await Pattern.findOne({ _id: basket.currentPattern, basketId: basket._id });
                if (!pattern) {
                    interaction.reply({ content: 'Error: No pattern set in basket.' });
                    return;
                } else {
                    const steps = pattern.steps;
                    if (steps.length === 0) {
                        interaction.reply({ content: `No steps found in pattern "${pattern.name}".` });
                        return;
                    } else {
                        if (pattern.currentStep === steps.length) {
                            interaction.reply({ content: `Pattern: "${pattern.name}"\nPattern completed!`});
                            return;
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
            interaction.reply('Oh no! The pattern got tangled! Please try again.');
        }
    }
}