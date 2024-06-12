const Basket = require('../../models/Basket');

module.exports = {
    name: 'register',
    description: 'Register a basket to store your patterns',
    // deleted: true,
    // devOnly: Boolean,
    // testOnly: Boolean,
    // options; Object[],
    callback: async (client, interaction) => {
        try {
            // Check if the user already has a basket
            const existingBasket = await Basket.findOne({ guildId: interaction.guildId });
            // If the basket already exists or the interaction is not in a guild, return an error
            if (existingBasket) {
                interaction.reply({
                    content: 'Error: This server already has a basket!',
                    ephemeral: true
                });
            } else if (!interaction.guildId) {
                interaction.reply({
                    content: 'Error: You can only register baskets in servers.',
                    ephemeral: true
                });
            } else {
                const newBasket = new Basket();
                newBasket.guildId = interaction.guildId;
                await newBasket.save();
                interaction.reply({ content: 'Basket basketed. Happy crocheting!' });
            }
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: 'Uh oh, the basket had a defect! Please try again.',
                ephemeral: true
            });
        }
    }
}