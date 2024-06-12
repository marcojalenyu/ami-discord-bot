const { ApplicationCommandOptionType } = require("discord.js");
const Basket = require("../../models/Basket");
const Pattern = require("../../models/Pattern");

module.exports = {
    name: 'record',
    description: 'Starts recording each line of the next messages as steps for a pattern.',
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
                    ephemeral: true
                });
            } else {
                // Check if the pattern already exists
                const name = interaction.options.getString('name');
                const existingPattern = await Pattern.findOne({ name: name, basketId: basket._id });
                let message = '';
                // If the pattern exists, set it as the current pattern, else create a new pattern
                if (existingPattern) { 
                    basket.currentPattern = existingPattern._id; 
                } else {
                    const pattern = new Pattern({ 
                        basketId: basket._id,
                        name: name 
                    });
                    await pattern.save();
                    basket.patterns.push(pattern);
                    basket.currentPattern = pattern._id;
                    message += `Pattern "${name}" added to the basket!\n`;
                }      
                // Save the channel ID and set recording to true
                basket.channelId = interaction.channelId;
                basket.isRecording = true;
                await basket.save();
                message += `This channel is currently recording the next messages as steps for "${name}".`;
                interaction.reply({ content: message });
            }
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: 'Oh no! The pattern got tangled! Please try again.',
                ephemeral: true
            });
        }
    }
}