const Basket = require("../../models/Basket");
const Pattern = require("../../models/Pattern");

module.exports = {
    name: 'wipe',
    description: 'Wipe the basket clean.',
    // deleted: true,
    // devOnly: Boolean,
    // testOnly: Boolean,

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
                basket.patterns = [];
                basket.currentPattern = null;
                basket.isRecording = false;
                basket.channelId = null;
                await basket.save();
                await Pattern.deleteMany({ basketId: basket._id });
                interaction.reply({ content: 'Basket wiped clean.' });
            }
        } catch (error) {
            console.error(error);
            interaction.reply('Oh no! The basket fell off! Please try again.');
        }
    }
}