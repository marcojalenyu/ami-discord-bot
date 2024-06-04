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
            const existingBasket = await Basket.findOne({ guildId: interaction.guildId }) || 
                await Basket.findOne({ userId: interaction.user.id });
            
            if (existingBasket && existingBasket.guildId === interaction.guildId) {
                interaction.reply({
                    content: 'This place already has a basket!',
                    ephemeral: true
                });
                return;
            } else {
                const newBasket = new Basket();
                if (interaction.guildId) {
                    newBasket.guildId = interaction.guildId;
                } else {
                    newBasket.userId = interaction.user.id;
                }
                await newBasket.save();
                interaction.reply({ content: 'Basket basketed. Happy crocheting!' });
            }
        } catch (error) {
            console.error(error);
            interaction.reply('Uh oh, the basket had a defect! Please try again.');
        }
    }
}