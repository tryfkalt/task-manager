require('../src/db/mongoose')
const User = require('../src/models/user')

// BEFORE ASYNC
// //the second arg is an obj of the updates we want to provide like $set in mongodb
// User.findByIdAndUpdate('64a80829eddf743a5a679efc', { age : 1 }).then((user) =>{
//     console.log(user)
//     return User.countDocuments({ age:1 })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

// AFTER ASYNC
const updateAgeandCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments( { age })
    return count
}

updateAgeandCount('64a80829eddf743a5a679efc', 2).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})