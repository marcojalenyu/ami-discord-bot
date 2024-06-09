require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const mongoose = require('mongoose');
const keep_alive = require('./keep_alive');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({ 
    intents: [ 
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

(async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        eventHandler(client);
        
        // Check the current time every minute to help keep the bot alive
        setInterval(async () => {
            const now = new Date();
            const currentTime = `${now.getHours()}:${now.getMinutes()}`;
            console.log(`Current time: ${currentTime}`);
        }, 60 * 1000);

    } catch (error) {
        console.error('Error connecting to MongoDB');
    }
})();

client.login(process.env.TOKEN);