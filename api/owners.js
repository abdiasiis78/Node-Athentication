import express from "express";
import bcrypt from 'bcrypt'
import prisma from "./lib/index.js";
import Jwt from "jsonwebtoken";
import 'dotenv/config'
const SECRET_KEY = process.env.SECRET_KEY


const router = express.Router();

router.post("/signup", async (req, res) =>{
  const {name, email, password} = req.body

  try{

    
    const existingOwner = await prisma.owner.findUnique({
      where:{
        email: email,
      }  
    })

    if(existingOwner){
      return res.status(409).json({
        message: 'owner is alredy exist'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newOwner = await prisma.owner.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword
      }
    })

    return res.status(201).json({
      message: 'Owner creation successfully',
      owner: newOwner
    })

  }catch(err){
    return res.status(500).json({
      message: 'something went wrong',
      error : err.message
    })
  }

})


router.post('/login', async (req, res) => {
  const {email, password} = req.body

  try{
    const isexistingOwner = await prisma.owner.findUnique({
      where:{
        email
      }
    })

    if(!isexistingOwner){
     res.status(404).json({
      message: 'owner was not found'  
     })
    }

    const checkPassword = await bcrypt.compare(password, isexistingOwner.password)
    if(!checkPassword){
      res.status(401).json({
        message: 'invalid credentials'
      })
    }
    // create a token
   const token = Jwt.sign(
    {id: isexistingOwner.id, email: isexistingOwner.email},
    SECRET_KEY,
    {expiresIn: '4h'}
   )

   return res.status(201).json({
    message: 'Owner logedin seccesfully',
    token: token
   })

  }catch(err){
    return res.status(500).json({
      message: 'something went wrong',
      error : err.message
    })
  }
})

export default router;