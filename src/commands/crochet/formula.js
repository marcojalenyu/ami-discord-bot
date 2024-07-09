const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'formula',
    description: 'Shows commands for crochet formulas',
    // deleted: true,
    // devOnly: Boolean,
    // testOnly: Boolean,
    // options: Object[],

    callback: async (client, interaction) => {
        try {
            let message = `**Crochet Formulas**\n`;
            message += `\`/cost\` = Price x (Yarn - Remaining) / Yarn\n`;
            message += `\`/tax\` = Price x Tax\n`;
            message += `\`/addtax\` = Price + (Price x Tax)\n`;
            interaction.reply({
                content: message,
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            interaction.reply({ 
                content: 'Oh no! The calculator ran out of batteries. Try again.', 
                ephemeral: true 
            });
        }
    }
}