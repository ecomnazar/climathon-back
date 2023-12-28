const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const collection = require('./config')
const bcrypt = require('bcrypt')
const multer = require('multer')

const app = express()
const PORT = 4003

app.set('view engine', 'ejs')
app.use(express.static('public'))

// convert data to json
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// get requests

app.get('/', (req, res) => {
    res.render('login')
})
app.get('/signup', (req, res) => {
    res.render('signup')
})

// storage for images

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public')
    },
    filename: (req, res, cb) => {
        cb(null, res.fieldname + '_' + Date.now() + '_' + res.originalname)
    }
})

let upload = multer({
    storage: storage
}).single('image')

// post requests

app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    }
    const existingUser = await collection.findOne({ name: data.name })
    if(existingUser){
        res.send('User already exists')
    } else{
        const hashedPassword = await bcrypt.hash(data.password, 10)
        data.password = hashedPassword
        const userData = await collection.insertMany(data)
        res.redirect('http://127.0.0.1:5500/login.html')
    }
})

app.post('/login', async (req, res) => {
    try {
        const check = await collection.findOne({name: req.body.name})
        if(check){
            const match = await bcrypt.compare(req.body.password, check.password)
            const user = req.body.name
            if(match){
                // res.send('Login successful')
                res.send(user)
                // res.redirect('http://127.0.0.1:5500/home.html')
            } else{
                res.send('Login failed')
            }
        } else{
            res.send('Login failed')
        }
    } catch (error) {
        
    }
})

app.post('post', upload, (req, res) => {
    
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

