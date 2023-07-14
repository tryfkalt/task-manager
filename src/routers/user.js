const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendByeEmail } = require('../emails/accounts')


// create a new router for all different resource routes
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
	// user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})


// jwt is JSON WEB TOKEN
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        //we use user. and not User cause we are working on one user and not the whole model atributes (we create a token to a user)
       
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try { //we are auth so we dont have to fetch the data again we already have access
        
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
    
    // try {
    //     const users = await User.find({})
    //     res.send(users)
    // } catch (e){
    //     res.status(500).send()
    // }
    
    
    // User.find({}).then((users) => {
    //     res.send(users)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})


//no longer need for this
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id

//     try{
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (e) {
//         res.status(500).send()
//     }

//     // User.findById(_id).then((user) => {
//     //     if (!user) {
//     //         return res.status(404).send()
//     //     }one
// })

router.patch('/users/me', auth, async (req, res) => {
// the 1st arg is the filter the 2nd the updates we want to make and the 3rd is options obj
// the new option returns the new user and not the existing one
// the runvalidators option allows us to run validations before update
    
    // object.keys converts an obj to an arr of its properties
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try { // mongoose bypasses middleware with the update method -- it makes changes directly to db thats why we use the runvalidators
        // const user = await User.findById(req.user._id)

        updates.forEach((update) => req.user[update] = req.body[update])
        //the middleware executes here
        await req.user.save()
        
         // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true})
        
        // if(!user){
        //     return res.status(404).send()
        // }
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
    // const user = await User.findByIdAndDelete(req.user._id)

        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        sendByeEmail(req.user.email, req.user.name)
        res.send(req.user)
    }  catch(e){
        //console.log(e)
        res.status(500).send()
    }
})


const upload = multer({
    //dest: 'avatars', // destination
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|png)$/)){
            return cb(new Error ('Wrong Type'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    //just png resized 
    // sharp takes the data and returns buffer
    // once we pass it into the sharp constructor we no longer have direct access to the buffer. After sharp has done its processing, we need to extract the buffer again by calling toBuffer.
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()

    //by removing the dest property in mutler the data is forwarded in the func here
    //req.user.avatar = req.file.buffer //change the data to the avatar property of user
   
    req.user.avatar = buffer
    await req.user.save()   // save changes
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message}) // this 5th arg runs when error 
})

router.delete('/users/me/avatar', auth, async(req, res)=> {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}), (error, req, res, next) => {
    res.status(400).send({error: error.message}) // this 5th arg runs when error 
}


router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error()
        }
// res header tell the requester what data they are getting back
        res.set('Content-Type', 'image/png') // key value pairs / name of header and value
        res.send(user.avatar)
    } catch(e){
        res.status(404).send()
    }
})

module.exports = router