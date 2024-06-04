const { ApplicationCommandOptionType } = require("discord.js");
const Basket = require("../../models/Basket");
const Pattern = require("../../models/Pattern");

module.exports = {
    name: 'record',
    description: 'Turn on record mode to turn lines of next messages into steps for a pattern.',
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
                // Create a new pattern and save it to the database
                const name = interaction.options.getString('name');
                // Check if the pattern name already exists
                const existingPattern = await Pattern.findOne({ name: name, basketId: basket._id });
                if (!existingPattern) {
                    const pattern = new Pattern({ 
                        basketId: basket._id,
                        name: name 
                    });
                    await pattern.save();
                    basket.patterns.push(pattern);
                    basket.currentPattern = pattern;
                } else {
                    basket.currentPattern = existingPattern._id;
                }                
                // Save the channel ID and set recording to true
                if (interaction.guildId) {
                    basket.channelId = interaction.channelId;
                }
                basket.isRecording = true;
                await basket.save();
                interaction.reply({ content: `Pattern "${name}" added to basket! This channel is currently recording the next messages as steps.` });
            }
        } catch (error) {
            console.error(error);
            interaction.reply('Oh no! The pattern got tangled! Please try again.');
        }
    }
}