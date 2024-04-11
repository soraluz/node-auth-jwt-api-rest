import express, { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { createUser, deleteUser, getAllUsers, getUserbyId, updateUser } from "../controllers/userControllers"

const router = express.Router()
const JWT_SECRET= process.env.JWT_SECRET || "default-secret"

//Middleware de JWT para ver si estamos autenticados
const autenticateToken=(req: Request, res: Response, next: NextFunction)=> {

    const authHeader= req.headers["authorization"]
    console.log("token",authHeader)
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        return res.status(401).json({
            error: "no autorizado"
        })
    }

    jwt.verify(token, JWT_SECRET,(err, decoded)=>{

        if(err){
            console.log("error en la autenticacion", err)
            return res.status(403).json({error: "No tiene acceso a este recurso"})
        }
        next()
    })
}

router.post("7", autenticateToken,createUser)

router.get("/",autenticateToken, getAllUsers)

router.get("/:id",autenticateToken, getUserbyId)

router.put("/:id",autenticateToken, updateUser)

router.delete("/:id",autenticateToken, deleteUser)

export default router