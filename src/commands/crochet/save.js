const Basket = require("../../models/Basket");

module.exports = {
    name: 'save',
    description: 'End record mode and save the pattern to your basket.',
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
                    ephemeral: true
                });
            } else if (!basket.isRecording) {
                interaction.reply({
                    content: 'Error: No pattern being recorded. Please /record a pattern first.',
                    ephemeral: true
                });
            } else {
                // Find the current pattern and set recording to false
                basket.currentPattern = null;
                basket.isRecording = false;
                await basket.save();
                interaction.reply({ content: `Recording stopped.` });
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