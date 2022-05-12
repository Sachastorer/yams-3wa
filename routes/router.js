import express from "express"
import { gamePage, results, play } from "../controllers/GameController.js"
import {loginPage, login, logout} from "../controllers/LoginController.js"
import connected from "../middleware/connected.js"

const router = express.Router()

router.get("/", connected, gamePage)
router.get("/results", connected, results)
router.get("/play", connected, play)

router.get("/login", loginPage)
router.post("/login", login)
router.get("/logout", logout)

export default router