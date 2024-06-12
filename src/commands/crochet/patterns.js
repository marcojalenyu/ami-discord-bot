const Basket = require("../../models/Basket");
const Pattern = require("../../models/Pattern");

module.exports = {
    name: 'patterns',
    description: 'View patterns in your basket.',
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
            } else {
                const patterns = await Pattern.find({ basketId: basket._id });
                if (patterns.length === 0) {
                    interaction.reply({ 
                        content: 'No pattern found in basket. Use /record to start recording a pattern.', 
                        ephemeral: true
                    });
                } else {
                    const patternNames = patterns.map(pattern => pattern.name);
                    interaction.reply({ content: `Patterns in basket:\n${patternNames.join('\n')}` });
                }
            }
        } catch (error) {
            console.error(error);
            interaction.reply('Oh no! The basket is upside down! Please try again.');
        }
    }
}