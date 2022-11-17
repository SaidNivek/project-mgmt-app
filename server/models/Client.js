const mongoose = require('mongoose')

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },

})

// This will export the mongoose schema, so we can use it in the rest of the files
module.exports = mongoose.model('Client', ClientSchema)