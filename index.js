const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const UserModel = require("./models/Emp")

const app = express();
app.use(express.json());


mongoose.connect("mongodb+srv://mitul:mitul123@cluster0.h8i1djj.mongodb.net/demo")

app.post("/reg",async(req,res)=>{
    const {email,name} = req.body

    const salt = await bcrypt.genSalt(10);
    const hasedpassword = await bcrypt.hash(req.body.password,salt)
    let user_data = {
        name : name,
        email : email,
        password:hasedpassword
    }

    const user = new UserModel(user_data);
    await user.save();

    return res.status(201).json({message:"Register succesfully"});   
})


app.post("/login",async(req,res)=>{
    const {email,password} = req.body

    const user = await UserModel.findOne({email:email});
    if(!user) return res.status(409).json({message:"Not match"}) 

    if(password){
        const valid_password = await bcrypt.compare(password,user.password)
        if(valid_password){
            return res.status(409).json({ message: "AppStrings.INVALID_PASSWORD" }, 409);
        }
    }

    return res.status(201).json({message:"Login succesfully"});   
})

app.listen(3000,()=>{
    console.log("Server started");
})