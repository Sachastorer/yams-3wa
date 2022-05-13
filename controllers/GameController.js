import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { diceRoll, getNbPastriesWon, handlePastries } from "../utils/functions.js"
import PastrieModel from "../models/Pastrie.js"
import PastrieWonModel from "../models/PastrieWon.js"


dotenv.config();
const {APP_TOKEN: secret } = process.env;

const gamePage = async (req, res) => {
    // console.log(req.session)
    const token = req.session.token
    try {
        //vérification du token

        const docs = await PastrieModel.find({number: {"$gte": 1}}).exec()
        if(docs.length < 1) res.redirect("/results")

        const tokenSigned = jwt.verify(token, secret)
        // console.log("played : " + tokenSigned.played)
        
        if(tokenSigned.played) {
            res.redirect("/results")
        } else {
            res.status(200).render("page/game", {nb: false, login: tokenSigned.name, message: false})
        }
        
    } catch (err) {
        req.session.token = '';
        res.redirect("/login")
    }
}

const play = async (req, res) => {

    const token = req.session.token
    const tokenSigned = jwt.verify(token, secret)
        
    const docs = await PastrieModel.find({number: {"$gte": 1}}).exec()

    if(tokenSigned.name) {

        if(docs.length < 1) {
            res.status(200).redirect("/results")
        } else {
    
            const nb = diceRoll()
            const nbPastries = getNbPastriesWon(nb)
    
            const pastriesDisplayed = []
    
    
            if(nbPastries === 0) {
                res.status(200).render("page/game", {nb: nb, login: tokenSigned.name, message: "perdu", pastries: pastriesDisplayed})
            } else {
    
                let pastrie 
                for(let i = 0; i < nbPastries; i++) {
                    pastrie = await handlePastries()
                    pastriesDisplayed.push(pastrie)
                }

                res.status(200).render("page/game", {nb: nb, login: tokenSigned.name, message: "gagne", pastries: pastriesDisplayed})
            } 
        }

    } else {
        req.session.token = '';
        res.render("page/login", {error: "session"})
    }

        
    // res.render("page/game", {nb: nb, login: tokenSigned.name})
}

const results = async (req, res) => {

    const token = req.session.token
    const tokenSigned = jwt.verify(token, secret)

    const docs = await PastrieWonModel.find({}).exec()
    res.status(200).render('page/results', {error: false, pastries: docs, login: tokenSigned.name})
}

const reset = async (req, res) => {

    const token = req.session.token
    const tokenSigned = jwt.verify(token, secret)
    
    const docs = await PastrieWonModel.find({}).exec()

    if(docs.length>0) {

        await PastrieWonModel.collection.drop();
        await PastrieModel.updateMany({ "number": { $ne: 10 } }, {"$set":{"number": 10}}).exec()
    }
    res.status(200).render('page/results', {error: false, pastries: [], login: tokenSigned.name})
}

export { gamePage, results, play, reset };

