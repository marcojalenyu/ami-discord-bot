const Basket = require("../../models/Basket");
const Pattern = require("../../models/Pattern");

module.exports = {
    name: 'reset',
    description: 'Reset the current pattern to the first step.',
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
                        if (pattern.currentStep === 0) {
                            interaction.reply({ content: `Pattern already at the first step.`});
                            return;
                        } else {
                            pattern.currentStep = 0;
                            const currentIndex = pattern.currentStep;
                            const currentStep = pattern.steps[currentIndex];
                            await pattern.save();
                            interaction.reply({ content: `Back to Step 1/${pattern.steps.length}: ${currentStep}`});
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