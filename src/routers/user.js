const express = require('express')
const app= express();
const User = require('../models/user')
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')
const router = new express.Router()
const multer = require('multer');
const upload = multer()
const bcrypt =require('bcryptjs')

/*
router.get('/users',(req,res)=>{
   
   req.app.get('io').emit('users-created',{data:'users is created'})
   res.send('hello users');
})
*/

router.get('/users',adminAuth,async (req, res) => {
    try {
        const users = await User.find({});
        res.send({users,success:true})
    } catch (e) {
        res.status(500).send({message:'some thing went wrong ',success:false})
    }
})

router.post('/users',adminAuth ,upload.none(),async (req, res) => {
    const inputField = Object.keys(req.body)
    const allowedInputs = [
    "firstname",
    "lastname" ,
    "email",
    "mobile" ,
    "password",
    "cardtype",
    "card_serial_number",
    "points"
    ];
    const isValidOperation = inputField.every((field) => allowedInputs.includes(field))

    if (!isValidOperation) {
        return res.status(400).send({ success: false, error: 'some fields is not allowed' })
    }

  const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token,success:true })
    } catch (e) {
        console.log(e);
        res.status(400).send({success:false ,message:'unable to create'})

    } 
})

router.post('/users/login',upload.none(),async (req, res,next) => {

    if(!req.body.email || !req.body.password){
        res.status(401).send({success:false,message:'please provide credentials'})
    }
    try {
        const user = await User.findOne({ email:req.body.email })
    
        if (!user) {
            res.status(401).send({success:false,message:'unable to login'})
        }
    
        const isMatch = await bcrypt.compare(req.body.password, user.password)
    
        if (!isMatch) {
            res.status(401).send({success:false,message:'unable to login'})
        }
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token,success:true })
    } catch (e) {
      
        next(e)
      
    }
})


router.post('/users/logout', auth,upload.none(), async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send({success:true})
    } catch (e) {
        res.status(500).send()
    }
})

/*
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})
*/
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// router.patch('/users/:id', auth,upload.none(), async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }

//     try {
//         updates.forEach((update) => req.user[update] = req.body[update])
//         await req.user.save()
//         res.send(req.user)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })


router.delete('/users/:id',adminAuth,upload.none(), async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findOneAndDelete({ _id})

        if (!user) {
            res.status(404).send()
        }

        res.send({success:true})
    } catch (e) {
        res.status(500).send({success:false})
    }
    }
)

module.exports = router