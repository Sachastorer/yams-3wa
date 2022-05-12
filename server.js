console.clear()
console.log('************** START *******************')

import express from "express";
import dotenv from 'dotenv'
import mongoose from "mongoose"
import router from "./routes/router.js"
import session from 'express-session';

dotenv.config();
const { APP_LOCALHOST : hostname, APP_PORT: port, APP_TOKEN: secret, APP_DSN: dsn } = process.env;
const app = express();

mongoose.connect(dsn, {
  "useNewUrlParser": true,
  "useUnifiedTopology": true,
})

app.set('view engine', 'ejs')

import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(session({
  name: 'session',
  secret: secret,
  login: "",
  token: "",
  resave: false,
  saveUninitialized: false,
}))

app.use('/', router)

app.listen(port, () => {
  console.log(`Example app listening at http://${hostname}:${port}`);
});
