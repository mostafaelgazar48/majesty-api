const express = require('express')
const Contact = require('../models/contact');
const adminAuth = require('../middleware/adminAuth')
const router = new express.Router()
const multer = require('multer');
const upload = multer()

router.post('/contact',upload.none(),async (req, res) => {

    const inputField = Object.keys(req.body)
    const allowedInputs = ['message', 'phone'];
    const isValidOperation = inputField.every((field) => allowedInputs.includes(field))
   
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    const contact = new Contact({
        ...req.body
    })

    try {
        await contact.save()
        res.status(201).send({message:'added successfully',success:true})
    } catch (e) {
        res.status(400).send({success:false})
    }
})

router.get('/contact',adminAuth,async (req, res) => {
    try {
        const contact = await Contact.find({});
        if(contact.length ===0){
            res.status(200).send({message:'couldn`t find contacts data'})
        }
        res.send(contact)
    } catch (e) {
        res.status(500).send()
    }
})


router.get('/test',async (req, res) => {
console.log(process.env.PORT);
})
module.exports =router;