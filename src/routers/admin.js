const express = require('express')
const Admin = require('../models/admin')
const auth = require('../middleware/auth')
const router = new express.Router()
const adminAuth= require('../middleware/adminAuth');
const multer = require('multer');
const upload = multer()
const bcrypt =require('bcryptjs')


router.post('/admin',adminAuth,upload.none(), async (req, res) => {

  const admin = new Admin(req.body)

    try {
        await admin.save()
        const token = await admin.generateAdminAuthToken()
        
    res.status(201).send({ admin, token,success:true })
    } catch (e) {
        res.status(400).send(e)
    } 
})

router.post('/admin/login',upload.none(),  async (req, res,next) => {
    if(!req.body.username || !req.body.password){
        res.status(401).send({success:false,message:'please provide credentials'})
    }
  try {
    const admin = await Admin.findOne({ username:req.body.username })

    if (!admin) {
        res.status(401).send({success:false,message:'unable to login'})

    }

    const isMatch = await bcrypt.compare(req.body.password, admin.password)

    if (!isMatch) {
        res.status(401).send({success:false,message:'unable to login'})

    }

        const token = await admin.generateAdminAuthToken()
       res.send({ admin, token,success:true })
    } catch (e) {
       next(e)
    } 
})

router.post('/admin/logout', adminAuth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send({message:'logout succesfully',success:true})
    } catch (e) {
        res.status(500).send(e)
    }
})

//logout endpoint

// add token expiration for admin


module.exports = router