const ErrorHandler = require('../utils/errorHadler');

module.exports = (error,req,res,next)=>{

    error.statusCode = error.statusCode || 500;
    error.message = error.message || "internal server error";

    //wrong mongodb id error
    if(error.name === "CastError"){
        const message = `Resourse not found. Invalid: ${error.path}`;
        error=new ErrorHandler(message,400);
    }

    // Mongoose duplicate key error
    if(error.code === 11000 ){
        const message = `Duplicate ${Object.keys(error.keyValue)} Entered`;
        error=new ErrorHandler(message,400);
    }

    //Json web token error
    if(error.name === "JsonWebTokenError"){
        const message = `Json Web Token is  Invalid, try again`;
        error=new ErrorHandler(message,400);
    }

    //JWT expire error
    if(error.name === "TokenExpiredError"){
        const message = `Json Web Token is  Expired, try again`;
        error=new ErrorHandler(message,400);
    }


    res.status(error.statusCode).json({
        succeess:false,
        message:error.message
    })
}