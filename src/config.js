const mongoose = require('mongoose')

const connect = mongoose.connect('mongodb://localhost:27017/climathon')

connect.then(() => {
    console.log('Connected')
}).catch(() => {
    console.log('DB Error')
})

const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})

const collection = new mongoose.model('users', LoginSchema)
module.exports = collection