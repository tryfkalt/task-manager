const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task') 

// the model definition takes as the second argument the schema
// we could just leave it as it is
// but now that we delcared a schema we can take advantage of middleware


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: { // unique makes sure it cannot duplicate the email ( another user registers with same emails)
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
        // store an arr of tokens
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: { // we make it buffer to store data if we want to deploy
        type: Buffer
    }
}, { // when created and when last updated
    timestamps: true
})

// virtual property is not actual data its a relationship between entities
// here we have a rel on a virtual not real field (not stored in db)
// foreignfield is name of field on the other thing (in this case the Task) that creates the ref
// localfield is where the local data is stored
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


// THE .STATICS ARE ACCESSIBLE TO THE MODELS 
// THE .METHODS ARE --//-- TO THE INSTANCES 

//toJSON is a way to automate hiding properties of the response obj
//
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}


// we need binding so we dont use arrow
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    // with this we can save tokens to db
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

// will be called in router
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}


// do sth before an ever is pre and post is after
// 1st arg is the name of the event 2nd is function to run
// HERE WE MUST USE THE STANDARD FUN AND NOT ARROW BECAUSE WE NEED BINDING

//we call next when we are done cause the event can be async so we have to know when its done 


// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

// if next dont get called then the fun is running non stop doing nothing
    next()
})


//delete user tasks when user gets deleted

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()

})

const User = mongoose.model('User', userSchema)

module.exports = User