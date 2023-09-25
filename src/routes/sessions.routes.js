import { Router } from "express";
import { userModel } from "../models/users.model.js";

const sessionRouter = Router();

//Session
sessionRouter.get('/', (req,res) => {
    res.render('home')
})

sessionRouter.post('/', async (req,res) => {
    const {email,password} = req.body
    req.session.email = email
    req.session.password = password 
    try {
        if(req.session.login)
/*             res.status(200).send({resultado: 'Login ya existente'}) */
            res.redirect(302, '/products')  
        const user = await userModel.findOne({email:email})
        if(user) {
            if(user.password === password) { 
/*                 res.status(200).send({resultado: 'Login valido', message: user}) */
                res.redirect(302, '/products')
            } else {
                res.status(401).send({resultado: 'Unauthorized', message: user})
            }
        }else {
            res.status(404).send({resultado: 'Not Found', message: user})
        }
    } catch(error) {
        res.status(400).send({error: `No se pudo loguear: ${error}`})
    }
})

export default sessionRouter