const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Complete']
    },
    phone: {
        type: String,
    },
    // This client ID will reference the Client schema that we have build and pull in the ID of the client
    clientId: {
        // This tells mongoose that we are looking for a schema type object ID
        type: mongoose.Schema.Types.ObjectId,
        // This tells mongoose that we are referring to the object ID of the Client schema specifically
        ref: 'Client',
    }
})

// This will export the mongoose schema, so we can use it in the rest of the files
module.exports = mongoose.model('Project', ProjectSchema)