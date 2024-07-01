import { response } from "express";
import mongoose from "mongoose";

export const connection = async ()=>{
    let response = await mongoose.connect('mongodb+srv://abinjos307:abinjose123@cluster0.hnvlmmq.mongodb.net/Food-Delivery').then(()=>console.log('connected'))
}