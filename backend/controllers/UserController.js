import userModel from "../models/UserModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'

// login function 
const userLogin = async (req,res)=>{
    const {email, password} = req.body;
    try{
        const user = await userModel.findOne({email:email})
        if(!user){
            res.json({success:false, message:"Email not found"})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            res.json({success:false, message:"Invalid Password"})
        }
        const token = createToken(user._id)
        res.json({success:true, message:"Login Success"})
    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

//token generating function
const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

//register function
const userRegister = async (req,res)=>{
    const {name, password, email} = req.body
    try {
        if(!validator.isEmail(email)){
            res.json({success:false,message:"User email already exists!"})
        }
        if(password.length<8){
            res.json({success:false,message:"Enter a strong password!"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        })

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({success:true,token})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:'Error in registering'})
        
    }
    
}


export {userLogin, userRegister}