const ErrorHandler = require("../utils/errorHadler");
const cathchAsyncErrors = require("./cathchAsyncErrors");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.isAutenticatedUser = cathchAsyncErrors(async(req,res,next)=>{
    
    const  {token}  = req.cookies;
        
    if(!token){
        return next(new ErrorHandler("Please Login to access this resourse",401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRETE);
    
    req.user = await User.findById(decodedData.id);
    
    next();
});

exports.authorizeRoles = (...roles)=>{
    return (req,res,next)=>{

        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(
                `Role: ${req.user.role} is not allowed to access this resourse`,403
            ));
        }
        next();
    }
}