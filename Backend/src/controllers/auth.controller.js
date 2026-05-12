import  { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export const register = async (req, res) => {

    const { username, email, password, role = "user"} = req.body;

    if(!username || !email || !password) return res.status(400).json({ message: "Please provide all required fields" });

    const existingUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existingUser) return res.status(409).json({ message: "Username or email already exists"});

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    
    const newUser = await User.create({
        username,
        email,
        password: hashPassword,
        role,
    })

    const token = jwt.sign({
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,

    }, process.env.JWT_SECRET)

    res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None"
})

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
        }
    })
    
}


export const login = async (req, res) => {
    const {username, email, password} = req.body;

    const user = await User.findOne({
        $or: [
            {username},
            {email}
        ]
    })

    if(!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });
    
    const token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,

    }, process.env.JWT_SECRET)

    res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None"
})

    res.status(200).json({
        message: "User logged in successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        }
    })
    
}

export const logout = (req, res) => {
    res.clearCookie("token");

    res.status(200).json({
        message: "User logged out successfully"
    })
}