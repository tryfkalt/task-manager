const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
//const task = new Task(req.body) // old
    const task = new Task({
        ...req.body, // all properties of req body PLUS the owner (owner doesnt belong in req)
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
    // task.save().then(() => {
        //     // res.status(201).send(task)
        // // }).catch((e) => {
        // //     res.status(400).send(e)
        // })   
})

// GET /tasks?completed=false
// GET /tasks?limit=10&skip=0 (0 first page, 10 is second page)
// GET /tasks?sortBy=createdAt_desc
router.get('/tasks', auth, async (req, res) => {
    //match and sort are declared this way cause it not certain the user gonna provide them value
    const match = {}
    const sort = {}
    //req.query.completed is A STRING ('true','false')
    if (req.query.completed ) { //if completed is provided
        //this syntax goes to empty match and CREATES a property completed and sets the value
        match.completed = req.query.completed === 'true' // a way to put the boolean value to the property
        console.log(match)
    }

    if (req.query.sortBy){
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        //const tasks = await Task.find({ owner: req.user._id })
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit), // converts a str to int
                skip: parseInt(req.query.skip),
                sort
                // sort: {
                //     createdAt: parseInt(req.query.sort.createdAt) // 1 is increasing -1 is descending
                // }
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
    
             // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
    
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
    
      // Task.findById(_id).then((task) => {
    //     if (!task) {
    //         return res.status(404).send()
    //     }

    //     res.send(task)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})

       // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new : true, runValidators: true})
        
        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router