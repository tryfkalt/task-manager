// for middleware methods we use in our app we use seperate files
// in postman we can provide the token to the route by adding a key-value pair. Key is Authorization and value is Bearer [token string] 
//as we dont want to auth at every router we add it as a 2nd arg in the router we want in user.js in routers

const jwt = require('jsonwebtoken')
const User = require('../models/user')

//dont quite get it 
const auth = async (req, res, next) => {
    try {// we use replace to get rid of the Bearer
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        //second filter checks if token is in tokens arr... we use ' ' cause it has a special char .
        const user = await User.findOne({  _id: decoded._id, 'tokens.token': token})
        
        if(!user) {
            throw new Error()
        }
        
        req.token = token
        req.user = user 
        next()
    } catch (e) {
        res.status(401).send({ error: 'Authentication error'})
    }
}

module.exports = auth
