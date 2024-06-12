require('dotenv').config();
const devs = process.env.DEVS.split(',');
const testServer = process.env.TEST_SERVER;
const Basket = require('../../models/Basket');
const Pattern = require('../../models/Pattern');

module.exports = async (client, message) => {
    try {
        if (message.author.bot) return;
        // Check if the guild or user is in the database
        const basket = await Basket.findOne({ guildId: message.guild.id });
        // If the basket is not found or the guild does not match the basket's guild
        if (!basket) {
            return;
        } else {
            if (basket.isRecording && basket.channelId === message.channel.id) {
                const steps = message.content.split('\n');
                const currentPattern = await Pattern.findById(basket.currentPattern);
                
                currentPattern.steps.push(...steps);
                await currentPattern.save();
            }
        }
    } catch (error) {
        console.error("There was an error handling the command.");
    }
};
