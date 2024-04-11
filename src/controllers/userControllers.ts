import { Request, Response } from "express"
import { comparePasswords, hashPassword } from "../services/password.Service"
import prisma from "../models/user"

export const createUser = async (req : Request, res: Response) : Promise<void>=> {

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
 

       /*  const user={
            id:1,
            email,
            password: hashedPassword
        }    */
        
        
        res.status(201).json(user)

    } catch (error: any) {
        
        if(!email)  res.status(400).json({
            message: error.message
        });
       else if(!password)  res.status(400).json({
            message: error.message
        });
else{
    res.status(500).json({
        error: "Hubo un error, pruebe mas tarde"
    })
}

        
    } 

}

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const users= await prisma.findMany()
        res.status(200).json(users)
    } catch (error:any) {
        res.status(500).json({
            error: "Hubo un error, pruebe mas tarde"
        })
    }
}


export const getUserbyId = async (req: Request, res: Response): Promise<void> => {
    const userId= parseInt(req.params.id)
    try {
        
        const user= await prisma.findUnique({
            where:{
                id:userId
            }
        })

        if(!user){
            res.status(404).json({
                error: "El usuario no fue encontrado"
            })
            return
        }
        res.status(200).json(user)
        
    } catch (error:any) {
        res.status(500).json({
            error: "Hubo un error, pruebe mas tarde"
        })
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const userId= parseInt(req.params.id)
    const {password} = req.body

    try {
        let dataToUpdate:any = {
            ...req.body
        }
        
        if(password){
            const hashedPassword= await hashPassword(password)
            dataToUpdate.password= hashedPassword
        }

        const user= await prisma.update({
            where:{
                id:userId
            },
            data: dataToUpdate
        })

        res.status(200).json(user)

    } catch (error:any) {
        if(error?.code === "P2002" && error?.meta?.target?.includes("email")){
            res.status(400).json({
                error: "El email ingresado ya existe"
            })
        }else if(error?.code=== "P2025"){
            res.status(404).json("Usuario no encontrado")
        }else{
            res.status(500).json({
                error: "Hubo un error, pruebe mas tarde"
            })
        }
       
    }
}

export const deleteUser= async (req: Request, res: Response): Promise<void>=>{
    const userId= parseInt(req.params.id)
    try {
        
        await prisma.delete({
            where:{
                id: userId
            }
        })
        res.status(200).json({
            message: `El usuario ${userId} a sido eliminado`
        }).end()
    }  catch (error:any) {
        if(error?.code=== "P2025"){
            res.status(404).json("Usuario no encontrado")
        }else{
            res.status(500).json({
                error: "Hubo un error, pruebe mas tarde"
            })
        }
       
    }
}
