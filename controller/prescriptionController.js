const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer')
const Prescription = require('../models/prescriptionModel');

const multerStorage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null, 'public');
    },
    filename: (req,file,cb)=>{
        const ext = file.mimetype.split('/')[1]
        cb(null, `prescriptions/user-${file.fieldname}-${Date.now()}.${ext}`)
    }
})

// const multerStorage = multer.memoryStorage();

const multerFilter = (req,file,cb)=>{
    if (file.mimetype.startsWith('application')){
        cb(null, true)
    } else{
        cb(new AppError('Not a file! Please upload a File',400),false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter:multerFilter
})

exports.uploadPrescription = upload.single('myFile')


exports.uploadFile = catchAsync(async (req,res,next)=>{

    const prescription = await Prescription.create({
        user:req.user._id,
        name:req.file.filename
    })

    // res.status(201).json({
    //     status:'success',
    //     message:'File has been created'
    // })
    res.redirect('/upload')
})

exports.myPrescriptions = catchAsync(async(req,res,next)=>{
    const user = req.user
    const prescriptions = await Prescription.find({user})

    res.status(200).json({
        status:'success',
        data:prescriptions
    })
})