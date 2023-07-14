const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {     // owner id
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // allows to create a reference to another model
         // its name must be the same as the name given in model we reference
    }
}, {
    timestamps: true
})
const Task = mongoose.model('Task', taskSchema)

module.exports = Task