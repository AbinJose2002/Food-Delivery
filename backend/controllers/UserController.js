import userModel from "../models/UserModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'

// login function 
const userLogin = (req,res)=>{

}

//register function
const userRegister = (req,res)=>{
    const {name, password, email} = req.body
}


export {userLogin, userRegister}