import User from "../models/User.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();
const {APP_TOKEN: secret } = process.env;

const loginPage = (req, res) => {
    // console.log(req.session)
    res.render('page/login', {error: false})
}

const login = (req, res) => {
    // console.log("post login")

    const email = req.body.email
    const password = req.body.password
    // console.log(req.session)

    User.findOne({email: email})
    .then((doc) => {
        // console.log(doc)
        if (!doc) throw err
        // console.log(doc.password)
        if( doc.password !== password) {

            res.render("page/login", {error: "password"})
        } else {
            const token = jwt.sign(
                //1er argument : données du payload
                {
                    "userId": doc._id,
                    "name": doc.name,
                    "mail": doc.email,
                    "played": doc.played
                },
                //2ème argument : la phrase secrète
                secret,
                {
                    expiresIn: '2h'
                }
            )
            // req.session.login = doc.name
            req.session.token = token

            res.redirect("/")
        }
    })
    .catch((err) => {
        // console.log("err")
        res.render("page/login", {error: "email"})
    })

    // res.render("page/game")
}

const logout = (req, res) => {
    // req.destroy()
    // req.session.login = '';
    req.session.token = '';
    res.redirect('/login')
}

export { loginPage, login, logout };