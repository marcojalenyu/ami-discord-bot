const { ApplicationCommandOptionType } = require("discord.js");
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
            const basket = await Basket.findOne({ guildId: interaction.guildId }) || 
                await Basket.findOne({ userId: interaction.user.id });
            if (!basket || interaction.guildId !== basket.guildId) {
                interaction.reply({
                    content: 'Error: No basket registered. Please register a basket first.',
                });
                return;
            } else {
                // Find the pattern in the basket
                const patternName = interaction.options.getString('pattern');
                const pattern = await Pattern.findOne({ name: patternName, basketId: basket._id });
                if (!pattern) {
                    interaction.reply({ content: `Pattern "${patternName}" not found in basket.` });
                    return;
                } else {
                    // Reset the current pattern back to 0
                    if (basket.currentPattern) {
                        const oldPattern = await Pattern.findOne({ _id: basket.currentPattern, basketId: basket._id });
                        oldPattern.currentStep = 0;
                        await oldPattern.save();
                    }
                    // Set the current pattern to the selected pattern
                    basket.currentPattern = pattern._id;
                    await basket.save();
                    interaction.reply({ content: `Starting pattern "${patternName}".` });

                    // Send the first step of the pattern (if it exists)
                    if (pattern.steps.length > 0) {
                        const steps = pattern.steps;
                        const currentStep = steps[0];
                        if (interaction.guildId) {
                            interaction.channel.send({ content: `Step 1/${steps.length}: ${currentStep}`});
                        } else {
                            interaction.user.send({ content: `Step 1/${steps.length}: ${currentStep}`});
                        }
                    } else {
                        if (interaction.guildId) {
                            interaction.channel.send('No steps recorded yet. Start recording steps with `/record`');
                        } else {
                            interaction.user.send('No steps recorded yet. Start recording steps with `/record`');
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error);
            interaction.reply('Oh no! The instructions got crumpled! Please try again.');
        }
    }
}