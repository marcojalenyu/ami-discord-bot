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
            const basket = await Basket.findOne({ guildId: interaction.guildId }) ||
                await Basket.findOne({ userId: interaction.user.id });            
            if (!basket || interaction.guildId !== basket.guildId) {
                interaction.reply({
                    content: 'Error: No basket registered. Please register a basket first.',
                });
                return;
            } else if (!basket.isRecording) {
                interaction.reply({
                    content: 'Error: No pattern being recorded. Please start recording a pattern first.',
                });
                return;
            } else {
                // Find the current pattern and set recording to false
                basket.currentPattern = null;
                basket.isRecording = false;
                await basket.save();
                interaction.reply({ content: `Pattern saved to basket!` });
            }
        } catch (error) {
            console.error(error);
            interaction.reply('Oh no! The pattern tangled while being stored! Please try again.');
        }
    }
}