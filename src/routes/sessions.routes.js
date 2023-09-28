import { Router } from "express";
import { userModel } from "../models/users.model.js";

const sessionRouter = Router();

//Session
sessionRouter.get('/logout', (req,res) => {
    try {
        if (req.session.login){
            req.session.destroy();
        }
        res.redirect("/static/login");
    } catch (error) {
        res.status(400).send({ error: `Error al terminar sesion: ${error} `});
    }
});

sessionRouter.post('/login', async (req,res) => {
    const {email,password} = req.body
    try {
        if(req.session.login)
            res.status(200).send({ error: `Login ya existente`});
        const user = await userModel.findOne({email: email});
        if(user) {
            if(user.password == password) {
                req.session.login = true;
                res.redirect(`/static/products?info=${user.first_name}`);
                return;
            } else {
                res.send("login", { message: 'Password Incorrecto'});
            }
        }else {
            res.status(404).send({ error: 'Usuario no existe'});
        }
    } catch(error) {
        res.render("login", { message: "Error en login"})
    }
})

export default sessionRouter