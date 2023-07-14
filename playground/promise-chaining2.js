require('../src/db/mongoose')

const Task = require('../src/models/task')

//removes the one with this id and then counts the rest 
// Task.findByIdAndRemove('64a814bb1680927c29af0335').then((task) => {
//     console.log(task)
//     return Task.countDocuments({completed: false})
// }).then((res) => {
//     console.log(res)
// }).catch((e) => {
//     console.log(e)
// })

// //these 2 methods are the same
// BEFORE ASYNC
// Task.findByIdAndDelete('64a814b61680927c29af0333').then((task) => {
//     console.log(task)
//     return Task.countDocuments({completed: false})
// }).then((res) => {
//     console.log(res)
// }).catch((e) => {
//     console.log(e)
// })

// AFTER ASYNC

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed: false})
    return count
}

deleteTaskAndCount('64a8294eae8ec598b8a6e54e').then((res)=>{
    console.log(res)
}).catch((e)=> {
    console.log(e)
})


