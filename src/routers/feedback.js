const express = require('express')
const Feedback = require('../models/feedback');
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')

const router = new express.Router()
const multer = require('multer');
const upload = multer()

router.post('/feedback',auth,upload.none(), async (req, res) => {
    const inputField = Object.keys(req.body)
    const allowedInputs = ['name','mobile','date','description'];
    const isValidOperation = inputField.every((field) => allowedInputs.includes(field))
   
    if (!isValidOperation) {
        return res.status(400).send({success:false, error: 'some fields are not allowed' })
    }
   
    const feedback = new Feedback({
        ...req.body
    })

    try {
        await feedback.save()
        res.status(201).send(feedback)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/feedback', adminAuth,async (req, res) => {
    try {
        const feedback = await Feedback.find({resolved:false});
        res.send(feedback)
    } catch (e) {
        res.status(500).send()
    }
})


router.get('/feedback/:id', adminAuth,async (req, res) => {
    const _id = req.params.id

    try {
        const feedback = await Feedback.findOne({ _id})

        if (!feedback) {
            return res.status(404).send()
        }

        res.send(feedback)
    } catch (e) {
        res.status(500).send()
    }
})


router.patch('/feedback/:id', adminAuth,upload.none(),async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['resolved']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const feedback = await Feedback.findOne({ _id: req.params.id})

        if (!feedback) {
            return res.status(404).send()
        }

        updates.forEach((update) => feedback[update] = req.body[update])
        await feedback.save()
        res.send(feedback)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.delete('/feedback/:id',adminAuth ,async (req, res) => {
    try {
        const feedback = await Feedback.findOneAndDelete({ _id: req.params.id})

        if (!feedback) {
            res.status(404).send()
        }

        res.send(feedback)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router