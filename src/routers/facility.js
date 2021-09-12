const express = require('express')
const Facility = require('../models/facility');
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')

const router = new express.Router()
const multer = require('multer');
const facilityUpload = multer();


router.post('/facility', adminAuth, facilityUpload.none(), async (req, res) => {
    console.log(req.body);
    const inputField = Object.keys(req.body)
    const allowedInputs = [
        'description',
        'name',
        'city',
        'governorate',
        'discount',
        'card_type',
        'area',
        'address',
        'facility_type',
        'category',
        'image',
        'location.coordinates',
        'facebook',
        'twitter',
        'instagram',
        'website',
        'priority_number'
    ];
    const isValidOperation = inputField.every((field) => allowedInputs.includes(field))

    if (!isValidOperation) {
        return res.status(400).send({ success: false, error: 'some fields is not allowed' })
    }
    const facility = new Facility({
        ...req.body
    })

    try {
        await facility.save()
        req.app.get('io').emit('facility-created', { data: 'A new Facility Has Been Added' })
        res.status(201).send({ facility, success: true })
    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})
/*
router.get('/facilities/search', async (req, res) => {

    const searchFields = Object.keys(req.query)
    const allowedSearches = ['name', 'city', 'category'];
    const isValidOperation = searchFields.every((field) => allowedSearches.includes(field))
    const match = {};
    if (!isValidOperation) {
        return res.status(400).send({ success: false, error: 'field search is not allowed' })
    }


    try {
        let facilities =[]
        if(match){
            facilities = await Facility.find();
        }else
         facilities = await Facility.find();
        res.send({ facilities, success: true })
    } catch (e) {
        res.status(500).send({ success: false })
    }
})

*/
router.get('/facilities', async (req, res) => {

    const searchFields = Object.keys(req.query)
    const allowedSearches = ['name', 'city', 'category'];
    const isValidOperation = searchFields.every((field) => allowedSearches.includes(field))
    let match = {};
    if (!isValidOperation) {
        return res.status(400).send({ success: false, error: 'field search is not allowed' })
    }

    try {
        let facilities = []
        if (req.query.name || req.query.city || req.query.category) {
            const name = req.query.name;
            const city = req.query.city;
            const category = req.query.category;
            // console.log(name, city);
            let searchObj= []
            if(name){
                 searchObj.push( {"name": {$regex: `${name}`, $options: 'i'}})   
            }
            if(city) {
               searchObj.push( {"city": {$regex: `${city}`, $options: 'i'}});
            }
            if(category){
                searchObj.push( {"city": {$regex: `${city}`, $options: 'i'}})
            }

            facilities = await Facility.find({ $and: searchObj})

        } else {
            facilities = await Facility.find({});

        }

        res.send({ facilities, success: true })
    } catch (e) {
        console.log(e);
        res.status(500).send({ success: false })
    }
})

router.get('/facility/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const facility = await Facility.findOne({ _id })

        if (!facility) {
            return res.status(404).send({ success: false })
        }

        res.send({ facility, success: true })
    } catch (e) {
        res.status(500).send({ success: false })
    }
})


router.patch('/facility/:id', adminAuth, facilityUpload.none(), async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = [
        'description',
        'name',
        'city',
        'governorate',
        'discount',
        'descrition',
        'card_type',
        'area',
        'address',
        'facility_type',
        'category',
        'image',
        'facebook',
        'twitter',
        'instagram',
        'website',
        'priority_number'

    ]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ success: true, error: 'Invalid updates!' })
    }

    try {
        const facility = await Facility.findOne({ _id: req.params.id })

        if (!facility) {
            return res.status(404).send({ success: false })
        }

        updates.forEach((update) => facility[update] = req.body[update])
        await facility.save()
        res.send(facility)
    } catch (e) {
        console.log(e);
        res.status(400).send({ error: e, success: false })
        
    }
})

router.delete('/facility/:id', adminAuth, async (req, res) => {
    try {
        const facility = await Facility.findOneAndDelete({ _id: req.params.id })

        if (!facility) {
            res.status(404).send({ success: false })
        }

        res.send({ facility, success: true })
    } catch (e) {
        res.status(500).send({ success: false })
    }
})


const path = require('path');
const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'public/images',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now()
            + path.extname(file.originalname))
        // file.fieldname is name of the field (image)
        // path.extname get the uploaded file extension
    }
});

const upload = multer({
    dest: '/public/images',
    storage: imageStorage,
    limits: {
        fileSize: 1000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
})
//upload.single('image'),
router.post('/facility/upload/:id', adminAuth, upload.single('image'), async (req, res) => {
    const _id = req.params.id;
    const imageName = 'https://' + req.hostname + '/public/images' + req.file.filename
    //const facility =await Facility.find({_id});
    const facility = await Facility.findOneAndUpdate({ _id }, { image: imageName }, { new: true })


    res.status(201).send(facility)
    // res.send('uploaded successfully !');
}, (err, req, res, next) => {
    res.status(400).send({ error: err.message })
})


module.exports = router