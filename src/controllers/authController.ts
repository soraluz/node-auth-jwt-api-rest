import { Request, Response } from "express"
import { comparePasswords, hashPassword } from "../services/password.Service"
import prisma from "../models/user"
import { generateToken } from "../services/auth.service"

export const register = async (req : Request, res: Response) : Promise<void>=> {

    const { email, password }= req.body

     
   
    try {

        if(!email) throw new Error("El email es obligatorio")
        
        if(!password) throw new Error("El password es obligatorio")
       
        const hashedPassword = await hashPassword(password)
        console.log("hash",hashedPassword)

        const user = await prisma.create({
            data:{
                email,
                password: hashedPassword
            }
        }) 
 
/* 
        const user={
            id:1,
            email,
            password: hashedPassword
        }    */
        
        const token= generateToken(user)
        res.status(201).json({token})

    } catch (error: any) {
        
        if(!email)  res.status(400).json({
            message: error.message
        });
       else if(!password)  res.status(400).json({
            message: error.message
        });
else{
    res.status(500).json({
        error: "Hubo un error en el registro"
    })
}

        
    } 

}

export const login = async (req: Request, res: Response): Promise<void>=> {

    const { email, password } = req.body

    try {
        if(!email) throw new Error("El email es obligatorio")
        
        if(!password) throw new Error("El password es obligatorio")
        
       const user= await prisma.findUnique(
            { where: {email}
        })
       /* const user= {
        id:1,
        email: "ricardo.soraluz@gmail.com",
        password:"$2b$10$U35m2ZZRHzNZmOb38OEctOUU99raHL8VRX6etTXaRFv0AyDwlU902"
       } */

        if(!user){
                res.status(404).json({ error: "Usuario no encontrado"})
                return
        }

        const  passwordMatch= await comparePasswords(password, user.password)

        if(!passwordMatch){
            res.status(401).json({
                error: "Usuario y contraseña no coinciden"
            })
        }

        const token= generateToken(user)
        res.status(200).json({token})


    } catch (error: any) {
        console.log("Error: ",error)
    }
}
