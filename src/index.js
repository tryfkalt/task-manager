const app = require('./app')

const port = process.env.port

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


// =================================

//middleware funs must be declared above the resistered routers
//this is the do sth below
// has access to the same info as the route handler plus next
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET REQS ARE DISABLED') 
//     } else {
//         next()
//     }
//     // console.log(req.method, req.path) // request http method and path
// })

// app.use((req, res, next) => {
//     res.status(503).send('ALL ACTIONS DISABLED under maintenance')
// })

// =================================



// const multer = require('multer')

// const upload = multer({
//     dest: 'images', // destination
//     limits: { //limitations eg to size 
//         fileSize: 200000 // 200KB
//     },
//     // filtering files  
//     //1 is request , 2 is file, 3 is callback when done
//     fileFilter(req, file, cb){ //... or type
//         // cb(new Error('FIle must be txt'))
//         // cb(undefined, true)

//         // !file.originalname.endsWith('.txt')
//         // match is used to match to regex
//         if(!file.originalname.match(/\.(doc|txt)$/)) {
//             return cb(new Error('Not a txt file of a doc'))
//         }

//         cb(undefined, true)
//     } 
// })

// // const errorMiddleware = (req, res, next) => {
// //     throw new Error('from middleware')
// // }
// // 3rd arg is when everything is ok 4th when its not (error)
// // app.post('/upload', errorMiddleware, (req, res) => {
// //     res.send() //the word in single must match with key in body form-data key
// // }, (error, req, res, next) => {
// //     res.status(400).send({ error: error.message})
// // })

// //upload.single is a middleware 1st arg is the name for the upload
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send() //the word in single must match with key in body form-data key
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message})
// })





//with app.use we register our router with our existing app// here we load our routersapp.use(userRouter)app.use(taskRouter)
//
//  without middleware:  new request --> run route handler
//
//  with middleware:     new request --> do sth --> run route handler
//


// const Task = require('./models/task')
// const User = require('./models/user')


// const main = async () => {
// //     // const task = await Task.findById('64ad70a59dd1f5886ff5e650')
// //     // // take owner from being the id to be the entire profile of owner
// //     // // populate data from a relationship
// //     // // like mapping
// //     // await task.populate('owner').execPopulate()
// //     // console.log(task.owner)

//     const user = User.findById('64ad707559333b87a6951f4f')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }

// main()



// const pet = {
//     name: 'hal'
// }

// // its called when JSON.stringify is called
// //Whatever the toJSON method returns is what will be returned from calling JSON.stringify() on that object.
// pet.toJSON = function () {
//     return {}
// }

// // thats what express does when we use res.send behind the scenes
// console.log(JSON.stringify(pet))




// const jwt = require('jsonwebtoken')

// const myFunction = async() => {
//     //to create a new web token we use sign method
//     // sign returns a token
//     // 1st arg is obj(data embedded in token) and 2nd is string random chars
//     //3rd arg is additional info about the token (in an obj we can declare the expiration time)
//     // the point of jwt is to create data that is able to be modified with a signature
//     const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '7 days'})
//     console.log(token)
//     //verifiy token 
//     // the 2nd arg must be the same with sign (same secret/signature)
//     //verified returns the payload of the token if token is valid
//     const data = jwt.verify(token, 'thisismynewcourse')
//     console.log(data)
// }

// myFunction()

// //to store data in the db we use hashed data
// const bcrypt = require('bcryptjs')


// const myFunction = async() => {
//         // what the user gives
//     const password = 'Red12345!'

//     //hash method returns a promise
//     // 1st arg is the password.... 2nd is the number of rounds it redoes the hashing (around 8 is fine)
//     const hashedPassword = await bcrypt.hash(password, 8)


//     console.log(password)
//     console.log(hashedPassword)

//         //check if pass is correct
//     const isMatch = await bcrypt.compare(password, hashedPassword)
//     console.log(isMatch)
// }

// myFunction()

// encryption
// andrew --> aljgnalsgpjoekadgkansdo --> andrew

//hashing
// mypass --> afjbakjsgnasdg --/> irriversable

// so in order to check eg if the pass the user gives is corerct we hash the pass and check if the hashed data matches the hash in the db


