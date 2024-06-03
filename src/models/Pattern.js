const { Schema, model } = require('mongoose');

const patternSchema = new Schema({
    basketId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Basket'
    },
    name: {
        type: String,
        required: true
    },
    currentStep: {
        type: Number,
        default: 0
    },
    steps: {
        type: [{
            type: Schema.Types.String
        }],
        default: []
    }
});

module.exports = model('Pattern', patternSchema);