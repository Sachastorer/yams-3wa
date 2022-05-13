import express from "express"
import { gamePage, results, play, test, reset } from "../controllers/GameController.js"
import {loginPage, login, logout} from "../controllers/LoginController.js"
import connected from "../middleware/connected.js"

const router = express.Router()

router.get("/", connected, gamePage)
router.get("/results", results)
router.get("/play", connected, play)
router.get("/test", connected, test)
router.get("/reset", reset)

router.get("/login", loginPage)
router.post("/login", login)
router.get("/logout", logout)

export default router