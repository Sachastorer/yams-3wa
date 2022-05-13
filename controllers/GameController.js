import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { diceRoll, getNbPastriesWon, handlePastries } from "../utils/functions.js"
import PastrieModel from "../models/Pastrie.js"
import PastrieWonModel from "../models/PastrieWon.js"
import UserModel from "../models/User.js"


dotenv.config();
const {APP_TOKEN: secret } = process.env;

const gamePage = async (req, res) => {
    // console.log(req.session)
    const token = req.session.token
    try {
        //vérification du token

        const docs = await PastrieModel.findOne({number: {"$gte": 1}}).exec()
        if(docs.length < 1) res.redirect("/results")

        const tokenSigned = jwt.verify(token, secret)

        const user = await UserModel.find({_id: tokenSigned.userId})
        
        if(user[0].played) {
            res.status(200).render("page/game", {nb: false, login: tokenSigned.name, message: false, played: true})
        } else {
            res.status(200).render("page/game", {nb: false, login: tokenSigned.name, message: false, played: false})
        }
        
    } catch (err) {
        req.session.token = '';
        res.redirect("/login")
    }
}

const play = async (req, res) => {

    const token = req.session.token
    const tokenSigned = jwt.verify(token, secret)

    console.log("played : " + tokenSigned.played)
    await UserModel.findByIdAndUpdate(tokenSigned.userId ,{played: true})


        
    const docs = await PastrieModel.find({number: {"$gte": 1}}).exec()

    if(tokenSigned.name) {

        if(docs.length < 1) {
            res.status(200).redirect("/results")
        } else {
    
            const nb = diceRoll()
            const nbPastries = getNbPastriesWon(nb)
    
            const pastriesDisplayed = []
    
    
            if(nbPastries === 0) {
                res.status(200).render("page/game", {nb: nb, login: tokenSigned.name, message: "perdu", pastries: pastriesDisplayed, played: true})
            } else {
    
                let pastrie 
                for(let i = 0; i < nbPastries; i++) {
                    pastrie = await handlePastries()
                    pastriesDisplayed.push(pastrie)
                }

                res.status(200).render("page/game", {nb: nb, login: tokenSigned.name, message: "gagne", pastries: pastriesDisplayed, played: true})
            } 
        }

    } else {
        req.session.token = '';
        res.render("page/login", {error: "session", login: false})
    }

        
    // res.render("page/game", {nb: nb, login: tokenSigned.name})
}

const test = async (req, res) => {

    const token = req.session.token
    const tokenSigned = jwt.verify(token, secret)
        
    const docs = await PastrieModel.find({number: {"$gte": 1}}).exec()

    if(tokenSigned.name) {

        if(docs.length < 1) {
            res.status(200).redirect("/results")
        } else {
    
            const nb = diceRoll()
            const nbPastries = getNbPastriesWon(nb)
            // const nbPastries = 3
            console.log("Tirage : " + nb[0] + " " + nb[1] + " " + nb[2] + " " + nb[3] + " " + nb[4] + " " + nb[5])
            const pastriesDisplayed = []
    
    
            if(nbPastries === 0) {
                res.status(200).render("page/game", {nb: nb, login: tokenSigned.name, message: "perdu", pastries: pastriesDisplayed, played: true})
            } else {
    
                let pastrie 
                for(let i = 0; i < nbPastries; i++) {
                    pastrie = await handlePastries()
                    pastriesDisplayed.push(pastrie)
                }

                res.status(200).render("page/game", {nb: nb, login: tokenSigned.name, message: "gagne", pastries: pastriesDisplayed, played: true})
            } 
        }

    } else {
        req.session.token = '';
        res.render("page/login", {error: "session", login: false})
    }

        
    // res.render("page/game", {nb: nb, login: tokenSigned.name})
}

const results = async (req, res) => {

    const token = req.session.token
    const docs = await PastrieWonModel.find({}).exec()
    if (token) {
        const tokenSigned = jwt.verify(token, secret)
        res.status(200).render('page/results', {error: false, pastries: docs, login: tokenSigned.name})

    } else {
        res.status(200).render('page/results', {error: false, pastries: docs, login: false})
    }

}

const reset = async (req, res) => {

    const token = req.session.token
    const docs = await PastrieWonModel.find({}).exec()
    
    await UserModel.updateMany({}, { played: false }).exec()

    if(docs.length>0) {

        await PastrieWonModel.collection.drop();
        await PastrieModel.updateMany({ "number": { $ne: 10 } }, {"$set":{"number": 10}}).exec()
    }

    if(token) {
        const tokenSigned = jwt.verify(token, secret)

        res.status(200).render('page/results', {error: false, pastries: [], login: tokenSigned.name})
    } else {
        res.status(200).render('page/results', {error: false, pastries: [], login: false})
    }

}

export { gamePage, results, play, test, reset };

