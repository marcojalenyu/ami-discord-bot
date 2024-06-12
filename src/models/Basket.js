const { Schema, model } = require('mongoose');

const basketSchema = new Schema({
    guildId: {
        type: String,
        default: null
    },
    channelId: {
        type: String,
        default: null
    },
    isRecording: {
        type: Boolean,
        default: false
    },
    currentPattern: {
        type: Schema.Types.ObjectId,
        default: null
    },
    patterns: {
        type: [{
            type: Schema.Types.ObjectId,
        }],
        default: []
    }
});

module.exports = model('Basket', basketSchema);