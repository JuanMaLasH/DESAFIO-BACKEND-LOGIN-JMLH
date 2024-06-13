import { Router } from "express";
const router = Router();

import { UserModel } from "../daos/mongodb/models/user.model.js";

router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email: email, password: password });
        if (existingUser) {
            return res.status(400).send({ error: "El correo electrónico ya está registrado" });
        }
        const role = email === 'admincoder@coder.com' && password === "adminCod3r123" ? 'admin' : 'usuario';
        const newUser = await UserModel.create({ first_name, last_name, email, password, age, role });
        req.session.login = true;
        req.session.user = { ...newUser._doc };
        res.redirect("/products");
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        res.status(500).send({ error: "Error interno del servidor" });
    }
});

export default router;