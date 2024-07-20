import jwt from "jsonwebtoken";

const authMiddleware = async (req,res,next)=>{
    const {token} = req.headers;
    if(!token){
        res.json({success:false,message:'Error in auth token'})

    }
    try {
        const decodeToken = jwt.verify(token,process.env.JWT_SECRET);
        req.body.userId = decodeToken.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error!"})
    }
}

export default authMiddleware