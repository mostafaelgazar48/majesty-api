const express = require('express')
const Category = require('../models/category');
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')

const router = new express.Router()
const multer = require('multer');
const upload = multer()

router.post('/category',upload.none(), adminAuth,async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedInputs = ['name']
    const isValidOperation = updates.every((update) => allowedInputs.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'some fields are invalid!' })
    }

   
    const category = new Category({
        ...req.body
    })

    try {
        await category.save()
        res.status(201).send(category)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/category',async (req, res) => {
    try {
        const category = await Category.find({});
        res.send(category)
    } catch (e) {
        res.status(500).send()
    }
})


router.get('/category/:id',async (req, res) => {
    const _id = req.params.id

    try {
        const category = await Category.findOne({ _id})

        if (!category) {
            return res.status(404).send()
        }

        res.send(category)
    } catch (e) {
        res.status(500).send()
    }
})


router.patch('/category/:id',upload.none(),adminAuth,async (req, res) => {
    const inputs = Object.keys(req.body)
    const allowedInputs = ['name']
    const isValidOperation = inputs.every((input) => allowedInputs.includes(input))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'some fields are invalid' })
    }

    try {
        const category = await Category.findOne({ _id: req.params.id})

        if (!category) {
            return res.status(404).send()
        }

        updates.forEach((update) => category[update] = req.body[update])
        await category.save()
        res.send(category)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.delete('/category/:id',adminAuth ,async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({ _id: req.params.id})

        if (!category) {
            res.status(404).send()
        }

        res.send({category,success:true})
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router