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
            message += `\`/cost\` = price*(yarn-remaining)/yarn\n`;
            message += `\`/tax\` = price*tax\n`;
            message += `\`/addtax\` = price+(price*tax)\n`;
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