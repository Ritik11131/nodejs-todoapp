import { User } from "../models/user.js"
import bcrypt from "bcrypt"
import { setCookie } from "../utils/features.js"

export const login = async (req,res,next) => {
    const { email, password } = req.body

    const user  =await User.findOne({email}).select("+password");

    if(!user) return res.status(404).json({
        success:false,
        message:"Invalid Email Or Password"
    });

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch) return res.status(404).json({
        success:false,
        message:"Invalid Email Or Password"
    });

    setCookie(user,res,`Welcome back, ${user.name}`,200)
}


export const logout = async (req,res,next) => {

    return res.status(200).cookie("token","",{
        expires:new Date(Date.now()),
        sameSite:process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure:process.env.NODE_ENV === "Development" ? false : true
    }).json({
        success:true,
        message:req.user
    });

}

export const registerUser = async (req,res)=>{
    const { name, email, password } = req.body;
    let user = await User.findOne({email});

    if(user) return res.status(404).json({
        success:false,
        message:"User Already Exist"
    });

    const hashedPassword = await bcrypt.hash(password,10)

    user = await User.create({
        name,
        email,
        password:hashedPassword
    })

    setCookie(user,res,"Registered Successfully",201)
}


export const getMyProfile = (req,res)=>{
   
    res.status(200).json({
        success:true,
        user:req.user
    })
}